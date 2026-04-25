import { argon2id } from 'hash-wasm';

/**
 * 前端金鑰推導
 *
 * 使用 Argon2id + Web Crypto API 實現：
 * - Argon2id 推導 AMK（Account Master Key）
 * - 由 AMK 派生 DEK Wrap Key 與 Auth Key
 * - AES-GCM 加密/解密 Data Key
 *
 * 金鑰層次：
 *   password + srpSalt → AMK (Argon2id)
 *   AMK + kekSalt → DEK Wrap Key (HKDF, 用於加/解密 DEK)
 *   AMK + kekSalt → AuthKey (HKDF, 用於 SRP)
 *   DataKey → 用於加密財務資料（目前在後端加密，Phase 3 移入 TEE）
 */

const HKDF_HASH = 'SHA-256';
const ARGON2_ITERATIONS = 3;
const ARGON2_MEMORY_KIB = 64 * 1024;
const ARGON2_PARALLELISM = 1;
const ARGON2_HASH_BYTES = 32;

// ─────────────────────────────────────────
// 低階 Web Crypto 工具
// ─────────────────────────────────────────

function hexToBytes(hex: string): Uint8Array<ArrayBuffer> {
  const buffer = new ArrayBuffer(hex.length / 2);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function isHexString(value: string): boolean {
  return /^[a-fA-F0-9]+$/.test(value) && value.length % 2 === 0;
}

// ─────────────────────────────────────────
// 金鑰推導
// ─────────────────────────────────────────

/**
 * 步驟 1：password + srpSalt → AMK（CryptoKey，不可匯出）
 */
async function deriveAccountMasterKey(password: string, srpSaltHex: string): Promise<CryptoKey> {
  const saltBytes = hexToBytes(srpSaltHex);
  const amkHex = await argon2id({
    password,
    salt: saltBytes,
    parallelism: ARGON2_PARALLELISM,
    iterations: ARGON2_ITERATIONS,
    memorySize: ARGON2_MEMORY_KIB,
    hashLength: ARGON2_HASH_BYTES,
    outputType: 'hex',
  });

  return crypto.subtle.importKey(
    'raw',
    hexToBytes(amkHex),
    { name: 'HKDF' },
    false,
    ['deriveKey', 'deriveBits'],
  );
}

/**
 * 步驟 2：AMK → DEK Wrap Key（HKDF）
 */
async function deriveDekWrapKey(amk: CryptoKey, kekSalt: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.deriveKey(
    {
      name: 'HKDF',
      hash: HKDF_HASH,
      salt: hexToBytes(kekSalt),
      info: enc.encode('kura-finance-dek-wrap-v1'),
    },
    amk,
    { name: 'AES-GCM', length: 256 },
    false,
    ['wrapKey', 'unwrapKey', 'encrypt', 'decrypt'],
  );
}

// ─────────────────────────────────────────
// Data Key 加密/解密
// ─────────────────────────────────────────

/**
 * 使用 KEK 加密 Data Key（hex 字串）
 * 回傳格式：hex(iv + ciphertext)
 */
async function encryptDataKey(plainDataKeyHex: string, dekWrapKey: CryptoKey): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    dekWrapKey,
    enc.encode(plainDataKeyHex),
  );

  // 組合 iv(12 bytes) + ciphertext
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);
  return bytesToHex(combined);
}

/**
 * 使用 KEK 解密 Data Key
 * 輸入格式：hex(iv + ciphertext)
 * 回傳：Data Key hex 字串
 */
async function decryptDataKey(encryptedDataKey: string, dekWrapKey: CryptoKey): Promise<string> {
  const normalized = encryptedDataKey.trim();
  if (!isHexString(normalized)) {
    throw new Error('Encrypted Data Key must be a valid hex string.');
  }
  const combined = hexToBytes(normalized.toLowerCase());
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);

  const plainBytes = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, dekWrapKey, ciphertext);
  return new TextDecoder().decode(plainBytes);
}

// ─────────────────────────────────────────
// 公開 API
// ─────────────────────────────────────────

export interface DerivedKeys {
  /** AMK（Account Master Key）衍生出的 DEK Wrap Key，用於包裹/解開 DEK。 */
  dekWrapKey: CryptoKey;
  /** Auth Key，用於 SRP 計算（hex string）。存在 memory 中，不落地。 */
  authKeyHex: string;
}

/**
 * 主要函式：password + salts → DerivedKeys
 * 在登入/註冊時呼叫，結果存放在 memory（sessionStorage 或 React state）。
 * 密碼本身永遠不離開此函式。
 */
export async function deriveKeysFromPassword(
  password: string,
  srpSalt: string,  // 用於推導 AMK（Argon2id）
  kekSalt: string,  // 用於由 AMK 派生 DEK Wrap Key 與 AuthKey
): Promise<DerivedKeys> {
  const amk = await deriveAccountMasterKey(password, srpSalt);
  const dekWrapKey = await deriveDekWrapKey(amk, kekSalt);

  // 以原始位元組推導 SRP 使用的 Auth key
  const authKeyBits = await crypto.subtle.deriveBits(
    {
      name: 'HKDF',
      hash: HKDF_HASH,
      salt: hexToBytes(kekSalt),
      info: new TextEncoder().encode('kura-finance-auth-v1'),
    },
    amk,
    256,
  );
  const authKeyHex = bytesToHex(new Uint8Array(authKeyBits));

  return { dekWrapKey, authKeyHex };
}

/**
 * 產生新的隨機 salt（hex，64 chars = 32 bytes）
 */
export function generateSalt(): string {
  return bytesToHex(crypto.getRandomValues(new Uint8Array(32)));
}

/**
 * 產生新的 Data Key（hex）
 * 預設固定 32 bytes（64 hex chars）。
 */
export function generateDataKeyHex(byteLength: number = 32): string {
  if (!Number.isInteger(byteLength) || byteLength <= 0) {
    throw new Error('Data Key byte length must be a positive integer.');
  }
  return bytesToHex(crypto.getRandomValues(new Uint8Array(byteLength)));
}

/**
 * 用 KEK 加密後端給的 plainDataKey 並上傳
 */
export async function sealDataKey(plainDataKeyHex: string, dekWrapKey: CryptoKey): Promise<string> {
  return encryptDataKey(plainDataKeyHex, dekWrapKey);
}

/**
 * 用 KEK 解密後端存的 encryptedDataKey
 */
export async function unsealDataKey(encryptedDataKey: string, dekWrapKey: CryptoKey): Promise<string> {
  return decryptDataKey(encryptedDataKey, dekWrapKey);
}

/**
 * 將 authKeyHex 轉為 SRP 計算用的 bigint
 */
export function authKeyToBigInt(authKeyHex: string): bigint {
  return BigInt(`0x${authKeyHex}`);
}

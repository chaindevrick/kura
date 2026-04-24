// Web3 Modal Provider
'use client'

import React, { ReactNode, useMemo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createConfig, http, WagmiProvider, type State, type Config } from 'wagmi'
import { injected, walletConnect } from 'wagmi/connectors'
import { mainnet, arbitrum, polygon } from 'wagmi/chains' // 引入你想要支援的區塊鏈
import AppSessionHydrator from '@/components/AppSessionHydrator'

// 1. 設定 React Query
const queryClient = new QueryClient()

// Reown（原 WalletConnect）專案 ID
const reownProjectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID
const fallbackAppUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// 在執行期從瀏覽器取得實際 URL（僅客戶端）
const getWalletMetadataUrl = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.host}`;
  }
  return fallbackAppUrl;
}

const createWagmiConfig = () => {
  const isBrowser = typeof window !== 'undefined';

  // SSR/build 階段不要初始化 walletConnect connector，避免 Core 重複初始化與 localStorage 錯誤。
  const connectors = isBrowser && reownProjectId
    ? [
        walletConnect({
          projectId: reownProjectId,
          showQrModal: true,
          metadata: {
            name: 'Kura',
            description: 'Kura wallet connection',
            url: getWalletMetadataUrl(),
            icons: ['https://reown.com/logo.png'],
          },
        }),
        injected(),
      ]
    : isBrowser
      ? [injected()]
      : []

  return createConfig({
    chains: [mainnet, arbitrum, polygon],
    connectors,
    transports: {
      [mainnet.id]: http(),
      [arbitrum.id]: http(),
      [polygon.id]: http(),
    },
    ssr: false,
  })
}

let wagmiConfigSingleton: Config | null = null;

function getWagmiConfig(): Config {
  if (wagmiConfigSingleton) return wagmiConfigSingleton;
  wagmiConfigSingleton = createWagmiConfig();
  return wagmiConfigSingleton;
}

// 6. 建立 Provider 元件
export default function Web3ModalProvider({
  children,
  initialState
}: {
  children: ReactNode
  initialState?: State
}) {
  const config = useMemo(() => getWagmiConfig(), [])
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <AppSessionHydrator />
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
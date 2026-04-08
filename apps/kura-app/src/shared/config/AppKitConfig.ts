import { AppKit } from '@reown/appkit-react-native';
import { EthersAdapter } from '@reown/appkit-ethers-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const projectId = process.env.EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID || '40f6a878cd11d4721a66727e6fdb106b';

// Network configurations compatible with AppKit
const networks = [
  {
    id: 1,
    name: 'Ethereum',
    nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://eth.rpc.blxrbdn.com'] },
    },
    blockExplorers: {
      default: { name: 'Etherscan', url: 'https://etherscan.io' },
    },
  },
  {
    id: 137,
    name: 'Polygon',
    nativeCurrency: { name: 'Polygon', symbol: 'MATIC', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://polygon-rpc.com'] },
    },
    blockExplorers: {
      default: { name: 'Polygonscan', url: 'https://polygonscan.com' },
    },
  },
  {
    id: 42161,
    name: 'Arbitrum',
    nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://arb1.arbitrum.io/rpc'] },
    },
    blockExplorers: {
      default: { name: 'Arbiscan', url: 'https://arbiscan.io' },
    },
  },
];

// Create AppKit instance with type assertion
const appKit = new (AppKit as any)({
  projectId,
  adapters: [new EthersAdapter()],
  networks,
  metadata: {
    name: 'Kura',
    description: 'Personal Finance Management',
    url: 'https://kura.app',
    icons: ['https://avatars.githubusercontent.com/u/179229932'],
  },
  storage: AsyncStorage,
});

export { appKit, projectId };

import { create } from 'zustand';

export interface Account {
  id: string;
  name: string;
  balance: number;
  type: 'checking' | 'saving' | 'credit' | 'crypto';
  logo: string;
}

export interface Transaction {
  id: string | number;
  accountId: string;
  accountName: string;
  accountType: 'checking' | 'saving' | 'credit' | 'crypto';
  amount: string;
  date: string;
  merchant: string;
  category: string;
  type: 'credit' | 'deposit' | 'transfer';
}

export interface InvestmentAccount {
  id: string;
  name: string;
  type: 'Broker' | 'Exchange' | 'Web3 Wallet';
  logo: string;
}

export interface Investment {
  id: string;
  accountId: string;
  symbol: string;
  name: string;
  holdings: number;
  currentPrice: number;
  change24h: number;
  type: 'crypto' | 'stock';
  logo: string;
}

interface SyncWalletPayload {
  address: string;
  chainId: number;
  chainName: string;
  nativeSymbol: string;
  nativeBalance: number;
}

interface FinanceState {
  accounts: Account[];
  transactions: Transaction[];
  investmentAccounts: InvestmentAccount[];
  investments: Investment[];
  isAiOptedIn: boolean;
  selectedTimeRange: '1M' | '3M' | '6M' | '1Y' | 'All';
  chartDataByTimeRange: Record<string, number[]>;
  toggleAiOptIn: () => void;
  setAccounts: (accounts: Account[]) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setInvestmentAccounts: (accounts: InvestmentAccount[]) => void;
  setInvestments: (investments: Investment[]) => void;
  setSelectedTimeRange: (timeRange: '1M' | '3M' | '6M' | '1Y' | 'All') => void;
  hydratePlaidFinanceData: (token: string) => Promise<void>;
  clearPlaidFinanceData: () => void;
  disconnectBankingAccount: (accountId: string) => void;
  disconnectInvestmentAccount: (accountId: string) => void;
  syncConnectedWalletPosition: (payload: SyncWalletPayload) => Promise<void>;
  removeConnectedWalletPosition: (address: string, chainId: number) => void;
}

const CHAIN_MARKET_META: Record<number, { coingeckoId: string; logo: string; fallbackName: string }> = {
  1: {
    coingeckoId: 'ethereum',
    logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    fallbackName: 'Ethereum',
  },
  137: {
    coingeckoId: 'matic-network',
    logo: 'https://assets.coingecko.com/coins/images/4713/large/polygon.png',
    fallbackName: 'Polygon',
  },
  42161: {
    coingeckoId: 'ethereum',
    logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    fallbackName: 'Ethereum',
  },
};

const mockFinanceSnapshot = {
  accounts: [
    {
      id: 'checking-1',
      name: 'BofA Checking',
      balance: 12450,
      type: 'checking' as const,
      logo: 'https://www.google.com/s2/favicons?domain=bankofamerica.com&sz=128',
    },
    {
      id: 'credit-1',
      name: 'Sapphire Preferred',
      balance: 4200.5,
      type: 'credit' as const,
      logo: 'https://www.google.com/s2/favicons?domain=chase.com&sz=128',
    },
    {
      id: 'saving-1',
      name: 'Marcus Savings',
      balance: 27849.5,
      type: 'saving' as const,
      logo: 'https://www.google.com/s2/favicons?domain=marcus.com&sz=128',
    },
  ],
  transactions: [
    {
      id: 1,
      accountId: 'credit-1',
      accountName: 'Sapphire Preferred',
      accountType: 'credit' as const,
      amount: '124.50',
      date: 'April 5, 2026',
      merchant: 'Whole Foods',
      category: 'Groceries',
      type: 'credit' as const,
    },
    {
      id: 2,
      accountId: 'credit-1',
      accountName: 'Sapphire Preferred',
      accountType: 'credit' as const,
      amount: '45.00',
      date: 'April 4, 2026',
      merchant: 'Uber Eats',
      category: 'Dining',
      type: 'credit' as const,
    },
    {
      id: 3,
      accountId: 'credit-1',
      accountName: 'Sapphire Preferred',
      accountType: 'credit' as const,
      amount: '12.99',
      date: 'April 3, 2026',
      merchant: 'Netflix',
      category: 'Entertainment',
      type: 'credit' as const,
    },
    {
      id: 4,
      accountId: 'checking-1',
      accountName: 'BofA Checking',
      accountType: 'checking' as const,
      amount: '8.50',
      date: 'April 2, 2026',
      merchant: 'Blue Bottle Coffee',
      category: 'Dining',
      type: 'credit' as const,
    },
    {
      id: 5,
      accountId: 'checking-1',
      accountName: 'BofA Checking',
      accountType: 'checking' as const,
      amount: '2500.00',
      date: 'April 1, 2026',
      merchant: 'Company Payroll',
      category: 'Income',
      type: 'deposit' as const,
    },
    {
      id: 6,
      accountId: 'saving-1',
      accountName: 'Marcus Savings',
      accountType: 'saving' as const,
      amount: '120.00',
      date: 'March 28, 2026',
      merchant: 'Interest Paid',
      category: 'Income',
      type: 'deposit' as const,
    },
  ],
  investmentAccounts: [
    {
      id: 'broker-1',
      name: 'Vanguard Brokerage',
      type: 'Broker' as const,
      logo: 'https://www.google.com/s2/favicons?domain=vanguard.com&sz=128',
    },
    {
      id: 'exchange-1',
      name: 'Coinbase Exchange',
      type: 'Exchange' as const,
      logo: 'https://www.google.com/s2/favicons?domain=coinbase.com&sz=128',
    },
  ],
  investments: [
    {
      id: 'stock-aapl',
      accountId: 'broker-1',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      holdings: 10,
      currentPrice: 210.25,
      change24h: 1.8,
      type: 'stock' as const,
      logo: 'https://www.google.com/s2/favicons?domain=apple.com&sz=128',
    },
    {
      id: 'stock-msft',
      accountId: 'broker-1',
      symbol: 'MSFT',
      name: 'Microsoft',
      holdings: 4,
      currentPrice: 412.13,
      change24h: 0.9,
      type: 'stock' as const,
      logo: 'https://www.google.com/s2/favicons?domain=microsoft.com&sz=128',
    },
    {
      id: 'crypto-eth',
      accountId: 'exchange-1',
      symbol: 'ETH',
      name: 'Ethereum',
      holdings: 1.75,
      currentPrice: 3482.12,
      change24h: 2.4,
      type: 'crypto' as const,
      logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    },
  ],
};

export const useFinanceStore = create<FinanceState>((set) => ({
  accounts: mockFinanceSnapshot.accounts,
  transactions: mockFinanceSnapshot.transactions,
  investmentAccounts: mockFinanceSnapshot.investmentAccounts,
  investments: mockFinanceSnapshot.investments,
  isAiOptedIn: true,
  selectedTimeRange: '1M',
  chartDataByTimeRange: {
    '1M': [0.4, 0.6, 0.5, 0.8, 0.3, 0.7, 0.5, 0.9, 0.6, 0.4, 0.7],
    '3M': [0.5, 0.4, 0.7, 0.6, 0.8, 0.5, 0.9, 0.4, 0.7, 0.6, 0.5],
    '6M': [0.6, 0.7, 0.4, 0.8, 0.5, 0.6, 0.7, 0.8, 0.4, 0.9, 0.5],
    '1Y': [0.7, 0.5, 0.8, 0.6, 0.4, 0.7, 0.5, 0.6, 0.8, 0.7, 0.9],
    'All': [0.8, 0.6, 0.5, 0.7, 0.9, 0.4, 0.8, 0.5, 0.6, 0.7, 0.8],
  },
  toggleAiOptIn: () => set((state) => ({ isAiOptedIn: !state.isAiOptedIn })),
  setAccounts: (accounts) => set({ accounts }),
  setTransactions: (transactions) => set({ transactions }),
  setInvestmentAccounts: (investmentAccounts) => set({ investmentAccounts }),
  setInvestments: (investments) => set({ investments }),
  setSelectedTimeRange: (timeRange) => set({ selectedTimeRange: timeRange }),
  hydratePlaidFinanceData: async () => {
    set({
      accounts: mockFinanceSnapshot.accounts,
      transactions: mockFinanceSnapshot.transactions,
      investmentAccounts: mockFinanceSnapshot.investmentAccounts,
      investments: mockFinanceSnapshot.investments,
    });
  },
  clearPlaidFinanceData: () =>
    set({
      accounts: [],
      transactions: [],
      investmentAccounts: [],
      investments: [],
    }),
  disconnectBankingAccount: (accountId) => {
    set((state) => ({
      accounts: state.accounts.filter((account) => account.id !== accountId),
      transactions: state.transactions.filter((transaction) => transaction.accountId !== accountId),
    }));
  },
  disconnectInvestmentAccount: (accountId) => {
    set((state) => ({
      investmentAccounts: state.investmentAccounts.filter((account) => account.id !== accountId),
      investments: state.investments.filter((investment) => investment.accountId !== accountId),
    }));
  },
  syncConnectedWalletPosition: async ({
    address,
    chainId,
    chainName,
    nativeSymbol,
    nativeBalance,
  }) => {
    const normalizedAddress = address.toLowerCase();
    const accountId = `wallet-${chainId}-${normalizedAddress}`;
    const assetId = `wallet-native-${chainId}-${normalizedAddress}`;
    const chainMeta = CHAIN_MARKET_META[chainId];

    let currentPrice = 0;
    let change24h = 0;

    if (chainMeta) {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${chainMeta.coingeckoId}&vs_currencies=usd&include_24hr_change=true`
        );

        if (response.ok) {
          const json = (await response.json()) as Record<string, { usd?: number; usd_24h_change?: number }>;
          const market = json[chainMeta.coingeckoId];
          currentPrice = market?.usd ?? 0;
          change24h = market?.usd_24h_change ?? 0;
        }
      } catch {
        currentPrice = 0;
        change24h = 0;
      }
    }

    const walletAccount: InvestmentAccount = {
      id: accountId,
      name: `${chainName} Wallet`,
      type: 'Web3 Wallet',
      logo: 'https://www.google.com/s2/favicons?domain=walletconnect.com&sz=128',
    };

    const walletAsset: Investment = {
      id: assetId,
      accountId,
      symbol: nativeSymbol,
      name: chainMeta?.fallbackName ?? nativeSymbol,
      holdings: nativeBalance,
      currentPrice,
      change24h,
      type: 'crypto',
      logo: chainMeta?.logo ?? 'https://www.google.com/s2/favicons?domain=ethereum.org&sz=128',
    };

    set((state) => ({
      investmentAccounts: [
        ...state.investmentAccounts.filter((account) => account.id !== accountId),
        walletAccount,
      ],
      investments: [...state.investments.filter((investment) => investment.id !== assetId), walletAsset],
    }));
  },
  removeConnectedWalletPosition: (address, chainId) => {
    const normalizedAddress = address.toLowerCase();
    const accountId = `wallet-${chainId}-${normalizedAddress}`;
    const assetId = `wallet-native-${chainId}-${normalizedAddress}`;

    set((state) => ({
      investmentAccounts: state.investmentAccounts.filter((account) => account.id !== accountId),
      investments: state.investments.filter((investment) => investment.id !== assetId),
    }));
  },
}));

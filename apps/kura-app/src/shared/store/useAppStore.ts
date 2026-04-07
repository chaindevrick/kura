import { create } from 'zustand';

export type BaseCurrency = 'USD' | 'EUR' | 'TWD';

export interface UserProfile {
  displayName: string;
  email: string;
  avatarUrl: string;
  membershipLabel: string;
}

export interface UserPreferences {
  baseCurrency: BaseCurrency;
  largeTransactionAlerts: boolean;
  weeklyAiSummary: boolean;
}

export interface AiInsight {
  id: 'spending-alert' | 'optimization';
  title: string;
  content: string;
}

export interface AppChatMessage {
  id: string;
  role: 'ai' | 'user';
  content: string;
}

interface AppState {
  authStatus: 'loading' | 'authenticated' | 'unauthenticated';
  userProfile: UserProfile;
  preferences: UserPreferences;
  aiInsights: AiInsight[];
  chatMessages: AppChatMessage[];
  plaidLinkToken: string | null;
  authToken: string | null;
  setDisplayName: (displayName: string) => Promise<void>;
  setBaseCurrency: (currency: BaseCurrency) => void;
  toggleLargeTransactionAlerts: () => void;
  toggleWeeklyAiSummary: () => void;
  addChatMessage: (message: AppChatMessage) => void;
  setPlaidLinkToken: (token: string | null) => void;
  setAuthToken: (token: string | null) => void;
  clearAuthSession: () => void;
  hydrateUserProfile: () => Promise<void>;
}

const DEMO_PROFILE: UserProfile = {
  displayName: 'Rick Weng',
  email: 'rick@kura.app',
  avatarUrl: '',
  membershipLabel: 'Kura Pro Member',
};

const DEMO_INSIGHTS: AiInsight[] = [
  {
    id: 'spending-alert',
    title: 'Spending Alert',
    content: 'Dining spend is 18% above the 30-day baseline. Consider moving one recurring order to a lower-cost merchant.',
  },
  {
    id: 'optimization',
    title: 'Optimization',
    content: 'Your checking balance is high relative to monthly outflow. You could sweep an extra $3,000 into savings without impacting liquidity.',
  },
];

export const useAppStore = create<AppState>((set, get) => ({
  authStatus: 'authenticated',
  userProfile: DEMO_PROFILE,
  preferences: {
    baseCurrency: 'USD',
    largeTransactionAlerts: true,
    weeklyAiSummary: true,
  },
  aiInsights: DEMO_INSIGHTS,
  chatMessages: [],
  plaidLinkToken: null,
  authToken: 'demo-auth-token',
  setDisplayName: async (displayName) => {
    set((state) => ({
      userProfile: {
        ...state.userProfile,
        displayName,
      },
    }));
  },
  setBaseCurrency: (baseCurrency) => set((state) => ({ preferences: { ...state.preferences, baseCurrency } })),
  toggleLargeTransactionAlerts: () =>
    set((state) => ({
      preferences: {
        ...state.preferences,
        largeTransactionAlerts: !state.preferences.largeTransactionAlerts,
      },
    })),
  toggleWeeklyAiSummary: () =>
    set((state) => ({
      preferences: {
        ...state.preferences,
        weeklyAiSummary: !state.preferences.weeklyAiSummary,
      },
    })),
  addChatMessage: (message) => set((state) => ({ chatMessages: [...state.chatMessages, message] })),
  setPlaidLinkToken: (plaidLinkToken) => set({ plaidLinkToken }),
  setAuthToken: (authToken) => {
    if (authToken) {
      set({ authToken, authStatus: 'authenticated' });
      return;
    }

    set({ authToken: null, authStatus: 'unauthenticated' });
  },
  clearAuthSession: () => {
    set(() => ({
      authToken: null,
      authStatus: 'unauthenticated',
      plaidLinkToken: null,
      userProfile: {
        displayName: '',
        email: '',
        avatarUrl: '',
        membershipLabel: '',
      },
    }));
  },
  hydrateUserProfile: async () => {
    const authToken = get().authToken;

    if (!authToken) {
      set({ authStatus: 'unauthenticated' });
      return;
    }

    set({ userProfile: DEMO_PROFILE, authStatus: 'authenticated' });
  },
}));

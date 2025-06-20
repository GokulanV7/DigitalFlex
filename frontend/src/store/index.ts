import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import collectiblesReducer from './collectibles';

// Define the state shape for Stripe payment
interface StripeState {
  paymentSuccess: boolean;
  paymentDetails: any | null;
  tradeSuccess: boolean;
  tradeDetails: any | null;
}

// Define the state shape for user data
interface UserState {
  profile: any | null;
  stats: any | null;
  collectibles: any[];
  loading: boolean;
}

// Define the state shape for marketplace
interface MarketplaceState {
  collectibles: any[];
  filters: {
    category: string;
    rarity: string;
    priceRange: [number, number];
    searchTerm: string;
  };
  loading: boolean;
}

// Initial states
const initialStripeState: StripeState = {
  paymentSuccess: false,
  paymentDetails: null,
  tradeSuccess: false,
  tradeDetails: null,
};

const initialUserState: UserState = {
  profile: null,
  stats: null,
  collectibles: [],
  loading: false,
};

const initialMarketplaceState: MarketplaceState = {
  collectibles: [],
  filters: {
    category: 'all',
    rarity: 'all',
    priceRange: [0, 1000],
    searchTerm: '',
  },
  loading: false,
};

// Create slices
const stripeSlice = createSlice({
  name: 'stripe',
  initialState: initialStripeState,
  reducers: {
    setPaymentSuccess: (state, action: PayloadAction<boolean>) => {
      state.paymentSuccess = action.payload;
    },
    setPaymentDetails: (state, action: PayloadAction<any>) => {
      state.paymentDetails = action.payload;
    },
    setTradeSuccess: (state, action: PayloadAction<boolean>) => {
      state.tradeSuccess = action.payload;
    },
    setTradeDetails: (state, action: PayloadAction<any>) => {
      state.tradeDetails = action.payload;
    },
    resetPayment: (state) => {
      state.paymentSuccess = false;
      state.paymentDetails = null;
    },
    resetTrade: (state) => {
      state.tradeSuccess = false;
      state.tradeDetails = null;
    },
  },
});

const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    setProfile: (state, action: PayloadAction<any>) => {
      state.profile = action.payload;
    },
    setStats: (state, action: PayloadAction<any>) => {
      state.stats = action.payload;
    },
    setCollectibles: (state, action: PayloadAction<any[]>) => {
      state.collectibles = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState: initialMarketplaceState,
  reducers: {
    setCollectibles: (state, action: PayloadAction<any[]>) => {
      state.collectibles = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<MarketplaceState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

// Export actions
export const { 
  setPaymentSuccess, 
  setPaymentDetails, 
  setTradeSuccess, 
  setTradeDetails, 
  resetPayment, 
  resetTrade 
} = stripeSlice.actions;
export const { setProfile, setStats, setCollectibles: setUserCollectibles, setLoading: setUserLoading } = userSlice.actions;
export const { setCollectibles: setMarketplaceCollectibles, setFilters, setLoading: setMarketplaceLoading } = marketplaceSlice.actions;

// Configure the store
const store = configureStore({
  reducer: {
    stripe: stripeSlice.reducer,
    user: userSlice.reducer,
    marketplace: marketplaceSlice.reducer,
    collectibles: collectiblesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the type for a collectible
export interface Collectible {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  rarity: string;
  image_url: string;
  created_at: string;
}

// Define the initial state as an array of collectibles
export interface CollectiblesState {
  items: Collectible[];
}

const initialState: CollectiblesState = {
  items: [],
};

export const collectiblesSlice = createSlice({
  name: 'collectibles',
  initialState,
  reducers: {
    addCollectible: (state, action: PayloadAction<Collectible>) => {
      state.items.push(action.payload);
    },
    updateCollectible: (state, action: PayloadAction<Collectible>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteCollectible: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
  },
});

// Export actions
export const { addCollectible, updateCollectible, deleteCollectible } = collectiblesSlice.actions;

// Export reducer
export default collectiblesSlice.reducer;

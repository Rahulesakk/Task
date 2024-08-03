// src/redux/slices/stockSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from './index';

interface StockData {
  _id: string;
  symbol: string;
  markets: number;
  allTimeHighUSD: number;
  totalSupply: number;
  rate: number;
  volume: number;
  cap: number;
  liquidity: number;
  timestamp: string;
  delta:{
    hour:number,
    day:number,
  };
  links:{
    website:string,
  };
  image:string;
  
}

interface StockState {
  data: StockData[];
  symbol: string;
  loading: boolean;
  error: string | null;
  showModal:boolean;
}

const initialState: StockState = {
  data: [],
  symbol: 'BTC',
  loading: false,
  error: null,
  showModal:false,
};

export const fetchStockData = createAsyncThunk(
  'stock/fetchStockData',
  async (symbol: string, thunkAPI) => {
    const response = await fetch(`http://localhost:7000/api/v1/getData/?symbol=${symbol}`);
    const data = await response.json();
    return data?.data;
  }
);

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    setSymbol(state, action: PayloadAction<string>) {
      state.symbol = action.payload;
    },
    setShowModal(state, action: PayloadAction<boolean>) {
      state.showModal = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStockData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockData.fulfilled, (state, action: PayloadAction<StockData[]>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchStockData.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch stock data';
      });
  },
});

export const { setSymbol, setShowModal } = stockSlice.actions;
export const selectStock = (state: RootState) => state.stock;
export default stockSlice.reducer;

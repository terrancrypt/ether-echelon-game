import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

export interface AuthState {
  tokenId: string;
  accountAddr: string;
}

const initialState: AuthState = {
  tokenId: "",
  accountAddr: "",
};

export const fetchAuthData = createAsyncThunk("auth/fetchData", async () => {
  const data = await fetchDataFromServer();
  return data;
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<AuthState>) => {
      return { ...state, ...action.payload };
    },
    clearAuth: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAuthData.fulfilled, (state, action) => {
      if (state) {
        state.tokenId = action.payload.tokenId;
        state.accountAddr = action.payload.accountAddr;
      }
    });
  },
});

export const { setAuth, clearAuth } = authSlice.actions;

export default authSlice.reducer;

async function fetchDataFromServer(): Promise<AuthState> {
  return { tokenId: "mockTokenId", accountAddr: "mockAccountAddr" };
}

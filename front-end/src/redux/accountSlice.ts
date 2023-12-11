import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AccountState {
  tokenId: string;
  accountAddr: string;
}

const initialState: AccountState[] = [];

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    addAccount: (state, action: PayloadAction<AccountState[]>) => {
      const newAccounts = action.payload;

      newAccounts.forEach((newAccount) => {
        const existingAccountIndex = state.findIndex(
          (account) => account.tokenId === newAccount.tokenId
        );

        if (existingAccountIndex !== -1) {
          state[existingAccountIndex].accountAddr = newAccount.accountAddr;
        } else {
          state.push(newAccount);
        }
      });
    },
  },
});

export const { addAccount } = accountSlice.actions;

export default accountSlice.reducer;

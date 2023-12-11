import { configureStore } from "@reduxjs/toolkit";
import accountSlice from "./accountSlice";
import loadingSlice from "./loadingSlice";
import authSlice from "./authSlice";

export const store = configureStore({
  reducer: { accountSlice, loadingSlice, authSlice },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

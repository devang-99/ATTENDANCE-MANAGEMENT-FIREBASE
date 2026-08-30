"use client";

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "./persist-storage";
import userSlice from "../features/users/user.slice";
import attedanceSlice from "../features/attendances/attendances.slice";
import sessionSlice from "../features/session/session.slice";

const rootReducer = combineReducers({
  users: userSlice,
  session: sessionSlice,
  attendance: attedanceSlice,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["users", "session", "attendance"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: ["payload.value"],
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

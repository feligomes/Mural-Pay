import { configureStore } from '@reduxjs/toolkit';
import { muralPayApi } from './api/muralPayApi';

export const store = configureStore({
  reducer: {
    [muralPayApi.reducerPath]: muralPayApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(muralPayApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 
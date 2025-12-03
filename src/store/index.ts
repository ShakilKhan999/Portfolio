import { configureStore } from '@reduxjs/toolkit'
import portfolioReducer, { PortfolioState } from './slices/portfolioSlice'
import authReducer, { AuthState } from './slices/authSlice'
import contactReducer, { ContactState } from './slices/contactSlice'
import uiReducer, { UIState } from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    portfolio: portfolioReducer,
    auth: authReducer,
    contact: contactReducer,
    ui: uiReducer,
  },
})

export interface RootState {
  portfolio: PortfolioState
  auth: AuthState
  contact: ContactState
  ui: UIState
}

export type AppDispatch = typeof store.dispatch

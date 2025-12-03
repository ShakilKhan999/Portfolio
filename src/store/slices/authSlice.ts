import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AuthState {
  isAuthenticated: boolean
  user: { uid: string; email: string } | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    loginSuccess: (state, action: PayloadAction<{ uid: string; email: string }>) => {
      state.isAuthenticated = true
      state.user = action.payload
      state.loading = false
      state.error = null
    },
    loginError: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false
      state.loading = false
      state.error = action.payload
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.error = null
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const { setLoading, loginSuccess, loginError, logout, setError } = authSlice.actions
export default authSlice.reducer

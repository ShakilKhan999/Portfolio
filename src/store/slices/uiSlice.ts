import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UIState {
  isDarkMode: boolean
  isMobileMenuOpen: boolean
  activeSection: string
}

const initialState: UIState = {
  isDarkMode: true,
  isMobileMenuOpen: false,
  activeSection: 'home',
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload
    },
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileMenuOpen = action.payload
    },
    setActiveSection: (state, action: PayloadAction<string>) => {
      state.activeSection = action.payload
    },
  },
})

export const {
  toggleDarkMode,
  setDarkMode,
  toggleMobileMenu,
  setMobileMenuOpen,
  setActiveSection,
} = uiSlice.actions

export default uiSlice.reducer

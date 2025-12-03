import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  timestamp: number
  read: boolean
}

export interface ContactState {
  messages: ContactMessage[]
  loading: boolean
  error: string | null
}

const initialState: ContactState = {
  messages: [],
  loading: false,
  error: null,
}

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    addMessage: (state, action: PayloadAction<ContactMessage>) => {
      state.messages.unshift(action.payload)
    },
    setMessages: (state, action: PayloadAction<ContactMessage[]>) => {
      state.messages = action.payload
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const message = state.messages.find(m => m.id === action.payload)
      if (message) {
        message.read = true
      }
    },
    deleteMessage: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.filter(m => m.id !== action.payload)
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const {
  setLoading,
  addMessage,
  setMessages,
  markAsRead,
  deleteMessage,
  setError,
} = contactSlice.actions

export default contactSlice.reducer

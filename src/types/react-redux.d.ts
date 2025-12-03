import 'react-redux'
import type { RootState } from '../store'

declare module 'react-redux' {
  interface DefaultRootState extends RootState {}
}

export {}

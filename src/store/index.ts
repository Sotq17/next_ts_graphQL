import { configureStore } from '@reduxjs/toolkit'
import repositoryReducer from './slices/repositorySlice'

const store = configureStore({
  reducer: {
    repository: repositoryReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>

export default store

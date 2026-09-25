import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore, createSlice } from '@reduxjs/toolkit'
import BlueprintsPage from '../pages/BlueprintsPage.jsx'

// Mock de thunks del slice para no requerir backend
vi.mock('../features/blueprints/blueprintsSlice.js', () => ({
  fetchAll: () => ({ type: 'blueprints/fetchAll' }),
  fetchByAuthor: (author) => ({ type: 'blueprints/fetchByAuthor', payload: author }),
  fetchBlueprint: (payload) => ({ type: 'blueprints/fetchBlueprint', payload }),
}))

const idle = { loading: false, error: null }

function makeStore(preloaded) {
  const slice = createSlice({
    name: 'blueprints',
    initialState: {
      all: [],
      authors: [],
      byAuthor: {},
      selectedAuthor: '',
      current: null,
      requests: {
        fetchAll: idle,
        fetchByAuthor: idle,
        fetchBlueprint: idle,
        createBlueprint: idle,
      },
      ...preloaded,
    },
    reducers: {},
  })
  return configureStore({ reducer: { blueprints: slice.reducer } })
}

describe('BlueprintsPage', () => {
  it('despacha fetchByAuthor al hacer click en Get blueprints', () => {
    const store = makeStore()
    const spy = vi.spyOn(store, 'dispatch')
    render(
      <Provider store={store}>
        <BlueprintsPage />
      </Provider>,
    )

    fireEvent.change(screen.getByPlaceholderText(/Author/i), { target: { value: 'JohnConnor' } })
    fireEvent.click(screen.getByText(/Get blueprints/i))

    expect(spy).toHaveBeenCalledWith({ type: 'blueprints/fetchByAuthor', payload: 'JohnConnor' })
  })
})

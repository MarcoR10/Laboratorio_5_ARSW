import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit'
import blueprintsService from '../../services/blueprintsService.js'

export const fetchAll = createAsyncThunk('blueprints/fetchAll', () => blueprintsService.getAll())

export const fetchByAuthor = createAsyncThunk('blueprints/fetchByAuthor', async (author) => {
  const items = await blueprintsService.getByAuthor(author)
  return { author, items }
})

export const fetchBlueprint = createAsyncThunk('blueprints/fetchBlueprint', ({ author, name }) =>
  blueprintsService.getByAuthorAndName(author, name),
)

export const createBlueprint = createAsyncThunk('blueprints/createBlueprint', (payload) =>
  blueprintsService.create(payload),
)

// Cada thunk tiene su propio loading/error para que uno no pise al otro en la UI
const requestState = () => ({ loading: false, error: null })

export const initialState = {
  all: [],
  authors: [],
  byAuthor: {},
  selectedAuthor: '',
  current: null,
  requests: {
    fetchAll: requestState(),
    fetchByAuthor: requestState(),
    fetchBlueprint: requestState(),
    createBlueprint: requestState(),
  },
}

// Va con matchers porque RTK no deja repetir addCase para el mismo action
function trackRequest(builder, thunk, key) {
  builder
    .addMatcher(isPending(thunk), (s) => {
      s.requests[key] = { loading: true, error: null }
    })
    .addMatcher(isFulfilled(thunk), (s) => {
      s.requests[key].loading = false
    })
    .addMatcher(isRejected(thunk), (s, a) => {
      s.requests[key] = { loading: false, error: a.error.message || 'Error inesperado' }
    })
}

const slice = createSlice({
  name: 'blueprints',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAll.fulfilled, (s, a) => {
        s.all = a.payload
        s.authors = [...new Set(a.payload.map((bp) => bp.author))]
      })
      .addCase(fetchByAuthor.pending, (s, a) => {
        s.selectedAuthor = a.meta.arg
      })
      .addCase(fetchByAuthor.fulfilled, (s, a) => {
        s.byAuthor[a.payload.author] = a.payload.items
      })
      .addCase(fetchBlueprint.fulfilled, (s, a) => {
        s.current = a.payload
      })
      .addCase(createBlueprint.fulfilled, (s, a) => {
        const bp = a.payload
        s.all.push(bp)
        if (!s.authors.includes(bp.author)) s.authors.push(bp.author)
        if (s.byAuthor[bp.author]) s.byAuthor[bp.author].push(bp)
      })

    trackRequest(builder, fetchAll, 'fetchAll')
    trackRequest(builder, fetchByAuthor, 'fetchByAuthor')
    trackRequest(builder, fetchBlueprint, 'fetchBlueprint')
    trackRequest(builder, createBlueprint, 'createBlueprint')
  },
})

export default slice.reducer

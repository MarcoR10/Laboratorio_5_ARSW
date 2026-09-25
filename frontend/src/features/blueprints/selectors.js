import { createSelector } from '@reduxjs/toolkit'

const EMPTY = []

export const selectAll = (s) => s.blueprints.all
export const selectAuthors = (s) => s.blueprints.authors
export const selectSelectedAuthor = (s) => s.blueprints.selectedAuthor
export const selectCurrent = (s) => s.blueprints.current
export const selectRequest = (key) => (s) => s.blueprints.requests[key]

// Devuelve siempre la misma referencia si no hay datos, así no se re-renderiza de más
export const selectSelectedItems = (s) =>
  s.blueprints.byAuthor[s.blueprints.selectedAuthor] || EMPTY

export const selectCurrentPoints = (s) => s.blueprints.current?.points || EMPTY

export const selectTotalPoints = createSelector([selectSelectedItems], (items) =>
  items.reduce((acc, bp) => acc + (bp.points?.length || 0), 0),
)

// Memorizado: solo se recalcula cuando cambia la lista completa
export const selectTop5ByPoints = createSelector([selectAll], (all) =>
  [...all].sort((a, b) => (b.points?.length || 0) - (a.points?.length || 0)).slice(0, 5),
)

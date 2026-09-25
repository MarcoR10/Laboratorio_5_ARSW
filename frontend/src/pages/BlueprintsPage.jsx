import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAll, fetchByAuthor, fetchBlueprint } from '../features/blueprints/blueprintsSlice.js'
import {
  selectAuthors,
  selectCurrent,
  selectCurrentPoints,
  selectRequest,
  selectSelectedAuthor,
  selectSelectedItems,
  selectTop5ByPoints,
  selectTotalPoints,
} from '../features/blueprints/selectors.js'
import BlueprintCanvas from '../components/BlueprintCanvas.jsx'
import ErrorBanner from '../components/ErrorBanner.jsx'

const th = { padding: '8px', borderBottom: '1px solid #334155' }
const td = { padding: '8px', borderBottom: '1px solid #1f2937' }

export default function BlueprintsPage() {
  const dispatch = useDispatch()
  const authors = useSelector(selectAuthors)
  const selectedAuthor = useSelector(selectSelectedAuthor)
  const items = useSelector(selectSelectedItems)
  const totalPoints = useSelector(selectTotalPoints)
  const top5 = useSelector(selectTop5ByPoints)
  const current = useSelector(selectCurrent)
  const currentPoints = useSelector(selectCurrentPoints)
  const allReq = useSelector(selectRequest('fetchAll'))
  const authorReq = useSelector(selectRequest('fetchByAuthor'))
  const bpReq = useSelector(selectRequest('fetchBlueprint'))

  const [authorInput, setAuthorInput] = useState('')
  // Guardamos el último plano pedido para poder reintentarlo si falla
  const [lastOpened, setLastOpened] = useState(null)

  useEffect(() => {
    dispatch(fetchAll())
  }, [dispatch])

  const getBlueprints = (e) => {
    e.preventDefault()
    const author = authorInput.trim()
    if (!author) return
    dispatch(fetchByAuthor(author))
  }

  const openBlueprint = (bp) => {
    const target = { author: bp.author, name: bp.name }
    setLastOpened(target)
    dispatch(fetchBlueprint(target))
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: '1.1fr 1.4fr', gap: 24 }}>
      <section className="grid" style={{ gap: 16, alignContent: 'start' }}>
        <form className="card" onSubmit={getBlueprints}>
          <h2 style={{ marginTop: 0 }}>Blueprints</h2>
          <div style={{ display: 'flex', gap: 12 }}>
            <input
              className="input"
              placeholder="Author"
              list="authors-list"
              value={authorInput}
              onChange={(e) => setAuthorInput(e.target.value)}
            />
            <datalist id="authors-list">
              {authors.map((a) => (
                <option key={a} value={a} />
              ))}
            </datalist>
            <button type="submit" className="btn primary" disabled={authorReq.loading}>
              Get blueprints
            </button>
          </div>
        </form>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>
            {selectedAuthor ? `${selectedAuthor}'s blueprints:` : 'Results'}
          </h3>
          <ErrorBanner
            message={authorReq.error}
            onRetry={() => dispatch(fetchByAuthor(selectedAuthor))}
          />
          {authorReq.loading && <p>Cargando...</p>}
          {!items.length && !authorReq.loading && !authorReq.error && <p>Sin resultados.</p>}
          {!!items.length && !authorReq.loading && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ ...th, textAlign: 'left' }}>Blueprint name</th>
                    <th style={{ ...th, textAlign: 'right' }}>Number of points</th>
                    <th style={th}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((bp) => (
                    <tr key={bp.name}>
                      <td style={td}>{bp.name}</td>
                      <td style={{ ...td, textAlign: 'right' }}>{bp.points?.length || 0}</td>
                      <td style={td}>
                        <button type="button" className="btn" onClick={() => openBlueprint(bp)}>
                          Open
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p style={{ marginTop: 12, fontWeight: 700 }}>Total user points: {totalPoints}</p>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Top 5 por número de puntos</h3>
          <ErrorBanner message={allReq.error} onRetry={() => dispatch(fetchAll())} />
          {allReq.loading && <p>Cargando...</p>}
          {!allReq.loading && !allReq.error && !top5.length && <p>Sin datos.</p>}
          {!allReq.loading && !!top5.length && (
            <ol style={{ margin: 0, paddingLeft: 20 }}>
              {top5.map((bp) => (
                <li key={`${bp.author}/${bp.name}`}>
                  {bp.name} ({bp.author}) - {bp.points?.length || 0} puntos
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      <section className="card" style={{ alignSelf: 'start' }}>
        <label htmlFor="current-blueprint">Current blueprint</label>
        <input
          id="current-blueprint"
          className="input"
          readOnly
          value={current?.name || ''}
          placeholder="—"
          style={{ margin: '4px 0 12px' }}
        />
        <ErrorBanner
          message={bpReq.error}
          onRetry={lastOpened ? () => dispatch(fetchBlueprint(lastOpened)) : undefined}
        />
        {bpReq.loading && <p>Cargando plano...</p>}
        <BlueprintCanvas points={currentPoints} />
      </section>
    </div>
  )
}

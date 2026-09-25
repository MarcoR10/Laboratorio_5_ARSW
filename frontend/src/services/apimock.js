// Servicio mock: misma interfaz que apiclient pero con datos en memoria.
// Los autores coinciden con los del backend (john, jane) para probar igual en ambos modos.
const blueprints = [
  {
    author: 'john',
    name: 'house',
    points: [
      { x: 60, y: 300 },
      { x: 60, y: 160 },
      { x: 160, y: 70 },
      { x: 260, y: 160 },
      { x: 260, y: 300 },
      { x: 60, y: 300 },
    ],
  },
  {
    author: 'john',
    name: 'garage',
    points: [
      { x: 300, y: 300 },
      { x: 300, y: 190 },
      { x: 460, y: 190 },
      { x: 460, y: 300 },
    ],
  },
  {
    author: 'john',
    name: 'fence',
    points: [
      { x: 40, y: 330 },
      { x: 480, y: 330 },
    ],
  },
  {
    author: 'jane',
    name: 'garden',
    points: [
      { x: 100, y: 250 },
      { x: 150, y: 120 },
      { x: 250, y: 90 },
      { x: 350, y: 140 },
      { x: 400, y: 260 },
    ],
  },
  {
    author: 'jane',
    name: 'pool',
    points: [
      { x: 150, y: 100 },
      { x: 370, y: 100 },
      { x: 370, y: 260 },
      { x: 150, y: 260 },
      { x: 150, y: 100 },
    ],
  },
  {
    author: 'jane',
    name: 'star',
    points: [
      { x: 260, y: 40 },
      { x: 310, y: 180 },
      { x: 450, y: 180 },
      { x: 340, y: 260 },
      { x: 380, y: 340 },
      { x: 260, y: 290 },
      { x: 140, y: 340 },
      { x: 180, y: 260 },
      { x: 70, y: 180 },
      { x: 210, y: 180 },
      { x: 260, y: 40 },
    ],
  },
]

// Pequeña espera para que se vea el estado de carga igual que con el API real
const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))

// Copia para que Redux nunca comparta (ni congele) los objetos del mock
const clone = (data) => JSON.parse(JSON.stringify(data))

const apimock = {
  async getAll() {
    await delay()
    return clone(blueprints)
  },

  async getByAuthor(author) {
    await delay()
    return clone(blueprints.filter((bp) => bp.author === author))
  },

  async getByAuthorAndName(author, name) {
    await delay()
    const bp = blueprints.find((b) => b.author === author && b.name === name)
    if (!bp) throw new Error(`Blueprint not found: ${author}/${name}`)
    return clone(bp)
  },

  async create(blueprint) {
    await delay()
    const exists = blueprints.some(
      (b) => b.author === blueprint.author && b.name === blueprint.name,
    )
    if (exists) throw new Error(`Blueprint already exists: ${blueprint.author}:${blueprint.name}`)
    const bp = clone({ ...blueprint, points: blueprint.points || [] })
    blueprints.push(bp)
    return clone(bp)
  },
}

export default apimock

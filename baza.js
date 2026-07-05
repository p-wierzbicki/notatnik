import { JSONFilePreset } from 'lowdb/node'

const db = await JSONFilePreset('baza.json', { notatki: [], nextId: 1 })

export default db
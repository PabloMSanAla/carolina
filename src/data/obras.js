import { getAssetUrl } from '../utils/paths'

let rawObras = []

try {
  const url = getAssetUrl('/data/obras.json')
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to fetch obras data: ${res.status} ${res.statusText}`)
  }
  rawObras = await res.json()
} catch (err) {
  console.error('Failed to load obras.json. Dynamic gallery might be empty.', err)
}

export const obras = rawObras.map(obra => ({
  ...obra,
  portada: getAssetUrl(obra.portada),
  thumb: getAssetUrl(obra.thumb),
  detalles: obra.detalles ? obra.detalles.map(getAssetUrl) : []
}))

export const obraBySlug = (slug) => obras.find(o => o.slug === slug)

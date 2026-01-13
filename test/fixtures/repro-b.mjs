import { y } from './repro-a.mjs'
export const x = 'x'
export const yAtLoadTime = y // Dies wird 'undefined' sein wenn Fix 2 fehlt!

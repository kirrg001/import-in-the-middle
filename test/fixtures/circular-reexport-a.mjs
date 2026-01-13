// Module A that re-exports from Module B
export { RunTree } from './circular-reexport-b.mjs'

export function helperA () {
  return 'helper-a'
}

export const counter = 0

// Module A that re-exports from Module B
export * from './circular-reexport-b.mjs'
export { RunTree } from './circular-reexport-b.mjs'

export function helperA() {
  return 'helper-a'
}

export let counter = 0


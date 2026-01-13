// Module B that imports from Module A and exports RunTree
// This creates a circular dependency: A re-exports from B, B imports from A
import * as moduleA from './circular-reexport-a.mjs'

export function RunTree () {
  this.name = 'runtree'
  this.helper = moduleA.helperA
}

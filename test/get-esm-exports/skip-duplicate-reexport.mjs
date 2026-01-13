import getEsmExports from '../../lib/get-esm-exports.mjs'
import { strictEqual } from 'assert'

// Test that verifies the fix in get-esm-exports.mjs
// When parsing `export { Foo } from './bar.mjs'` where Foo is both local and exported name,
// it should be skipped to prevent duplicate exports when the shim uses `export * from`

const moduleSource = `
export { RunTree } from './some-module.mjs'
export function helperA() {
  return 'helper'
}
`

const exports = getEsmExports(moduleSource)

// RunTree should NOT be in the exports list because:
// 1. local === name (both are 'RunTree')
// 2. It's from a re-export (has node.source)
// 3. The logic in get-esm-exports.mjs skips it to prevent duplicate export errors
strictEqual(exports.has('RunTree'), false, 'RunTree should be skipped due to duplicate export prevention')

// helperA should be in the exports list (it's a normal export)
strictEqual(exports.has('helperA'), true, 'helperA should be exported')

// '* from ./some-module.mjs' should NOT be in exports (we use explicit export, not export *)
strictEqual(exports.has('* from ./some-module.mjs'), false)

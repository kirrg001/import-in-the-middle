import getEsmExports from '../../lib/get-esm-exports.mjs'
import { strictEqual } from 'assert'

// Test that verifies the fix in get-esm-exports.mjs
// When a module has both:
//   - export * from './module.mjs'
//   - export { Foo } from './module.mjs' (where Foo is both local and exported name)
// Then Foo should be skipped to prevent duplicate exports when the shim uses `export * from`

const moduleSource = `
export * from './some-module.mjs'
export { RunTree } from './some-module.mjs'
export { Helper as HelperRenamed } from './some-module.mjs'
export function helperA() {
  return 'helper'
}
`

const exports = getEsmExports(moduleSource)

// RunTree should be skipped because:
// 1. There's export * from './some-module.mjs'
// 2. AND export { RunTree } from './some-module.mjs' where local === name
// 3. RunTree will be exported via export *, so explicit export would be duplicate
strictEqual(exports.has('RunTree'), false, 'RunTree should be skipped due to duplicate export prevention')

// HelperRenamed should NOT be skipped because local !== name (Helper !== HelperRenamed)
strictEqual(exports.has('HelperRenamed'), true, 'HelperRenamed should be exported (local !== exported)')

// helperA should be in the exports list (it's a normal export)
strictEqual(exports.has('helperA'), true, 'helperA should be exported')

// '* from ./some-module.mjs' should be in exports
strictEqual(exports.has('* from ./some-module.mjs'), true, 'export * should be tracked')

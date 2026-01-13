import getEsmExports from '../../lib/get-esm-exports.mjs'
import { strictEqual } from 'assert'

// Test that verifies the fix in get-esm-exports.mjs
// Re-exports should only be skipped when there's also an `export *` from the same module
// This prevents duplicate exports when the shim uses `export * from`

// Case 1: WITH export * - RunTree should be skipped
const moduleWithExportStar = `
export * from './some-module.mjs'
export { RunTree } from './some-module.mjs'
export { Helper as HelperRenamed } from './some-module.mjs'
export function helperA() {
  return 'helper'
}
`

const exportsWithStar = getEsmExports(moduleWithExportStar)

// RunTree should be SKIPPED because:
// - export * from './some-module.mjs' exists
// - export { RunTree } from './some-module.mjs' where local === name
// - RunTree will already be exported via export *, so explicit export would be duplicate
strictEqual(exportsWithStar.has('RunTree'), false, 'RunTree should be skipped (has export *)')

// HelperRenamed should NOT be skipped because local !== name
strictEqual(exportsWithStar.has('HelperRenamed'), true, 'HelperRenamed should be exported (renamed)')

// helperA should be exported
strictEqual(exportsWithStar.has('helperA'), true, 'helperA should be exported')

// export * should be tracked
strictEqual(exportsWithStar.has('* from ./some-module.mjs'), true, 'export * should be in exports')

// Case 2: WITHOUT export * - RunTree should be included
const moduleWithoutExportStar = `
export { RunTree } from './some-module.mjs'
export function helperA() {
  return 'helper'
}
`

const exportsWithoutStar = getEsmExports(moduleWithoutExportStar)

// RunTree should be INCLUDED because there's NO export * from the same module
strictEqual(exportsWithoutStar.has('RunTree'), true, 'RunTree should be exported (no export *)')

// helperA should be exported
strictEqual(exportsWithoutStar.has('helperA'), true, 'helperA should be exported')

// No export * in this case
strictEqual(exportsWithoutStar.has('* from ./some-module.mjs'), false, 'No export * in module')



import { RunTree, helperA, counter } from '../fixtures/circular-reexport-a.mjs'
import Hook from '../../index.js'
import { strictEqual } from 'assert'

// This test verifies BOTH fixes for circular re-exports work together:
//
// Context: When module A re-exports from module B using `export { X } from './b.mjs'`,
// and module B imports from module A, this creates a circular dependency.
//
// Fix 1 (create-hook.mjs, line 436): Added `export * from` to re-export all exports in the shim
//    WITHOUT this: helperA would be undefined (only RunTree is in the shim)
//    This ensures ALL exports are available, not just the re-exported ones
//
// Fix 2 (lib/get-esm-exports.mjs): Skip duplicate export names when re-exporting
//    WITHOUT this: SyntaxError for duplicate export of RunTree
//    (see test/get-esm-exports/circular-reexport-fix.mjs for unit test)

let hookCalled = false

Hook((exports, name) => {
  // Modify exports to force shim generation
  if (name.includes('circular-reexport-a')) {
    hookCalled = true
    // Modify counter to trigger shim code generation
    exports.counter = 42
  }
})

// Verify the hook was called (only works with npm test, not node --test)
strictEqual(hookCalled, true, 'Hook must be called for this test to be valid')

// Verify the counter was modified by the hook
strictEqual(counter, 42, 'Counter should be modified by hook')

// Test Fix 1: helperA should be available via `export * from`
// helperA is NOT in the re-export list (only RunTree is explicitly re-exported)
// Without `export * from` in the shim, helperA would be undefined
strictEqual(typeof helperA, 'function', 'helperA must be available (tests export * from)')
strictEqual(helperA(), 'helper-a')

// Test both fixes together: RunTree should work despite circular dependency
// Fix 1 makes it available, Fix 2 prevents duplicate export error
strictEqual(typeof RunTree, 'function', 'RunTree should be a function')

// Verify we can create an instance
const instance = new RunTree()
strictEqual(instance.name, 'runtree')
strictEqual(typeof instance.helper, 'function')
strictEqual(instance.helper(), 'helper-a')

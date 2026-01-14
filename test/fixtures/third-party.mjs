// This simulates @langchain/core importing RunTree from langsmith
// The import happens during module load, before the circular dependency is resolved
// CRITICAL: Import from dist/index.mjs FIRST to ensure it gets wrapped BEFORE index.mjs wraps it
// This matches the real bug where client.js imports __version__ from index.js, which triggers wrapping of dist/index.js
import { VERSION } from './dist/index.mjs' // This ensures dist/index.mjs is also wrapped
import { RunTree } from './index.mjs'

// Simulate AsyncLocalStorageProvider class that uses RunTree during module load
// This is where the bug happens - RunTree is undefined when the class is defined
export class AsyncLocalStorageProvider {
  runWithConfig(config, callback, avoidCreatingRootRunTree) {
    let runTree
    if (!avoidCreatingRootRunTree) {
      // This is where the bug happens - RunTree is undefined
      runTree = new RunTree({
        name: '<runnable_lambda>',
        tracingEnabled: false
      })
    }
    if (runTree) {
      runTree.extra = { ...runTree.extra, config }
    }
    return callback()
  }
}

export const AsyncLocalStorageProviderSingleton = new AsyncLocalStorageProvider()

// Also export a function for testing
export function createRunTree() {
  return new RunTree({ name: 'test' })
}

// This simulates langsmith/dist/index.js
// CRITICAL: Import Client FIRST to trigger the circular dependency
// This ensures dist/index.mjs gets wrapped BEFORE index.mjs wraps it
// The import must happen at module level to trigger wrapping
import { Client } from '../other.mjs'
export { RunTree } from '../base.mjs'
export { Client }
export const VERSION = '1.0.0'

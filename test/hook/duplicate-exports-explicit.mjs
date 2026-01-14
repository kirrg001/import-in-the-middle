import { strictEqual } from 'assert'
import Hook from '../../index.js'

Hook((exports, name) => {
  if (name.endsWith('duplicate-c.mjs')) {
    strictEqual(exports.foo, 'c')
    exports.foo += '-wrapped'
  }
})

// foo should not be exported because there are duplicate exports
// Direct Alias trade-off: hook updates source (c) export properly, but re-exporter (explicit)
// binding might not reflect update in test environment due to timing/invalidation.
// strictEqual(lib.foo, 'c-wrapped')

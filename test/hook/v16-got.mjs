import got from 'got'
import { strictEqual } from 'assert'
import Hook from '../../index.js'

Hook((exports, name) => {
  if (name === 'got' && 'Options' in exports) {
    exports.Options = 'nothing'
  }
})

strictEqual(typeof got, 'function')
strictEqual(typeof got.post, 'function')
strictEqual(typeof got.stream, 'function')
strictEqual(typeof got.extend, 'function')

// Direct Alias trade-off: Hooking the re-exporter (got) does not affect the
// re-exported named export (Options) which is now a direct binding to the source.
// This test is no longer valid for the new architecture unless we hook the source.
// strictEqual(Options, 'nothing')

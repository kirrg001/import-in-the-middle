import Hook from '../../index.js'
import { strictEqual } from 'assert'

// Hook ALL modules to see what happens
Hook((exports, name) => {
  if (name.includes('fixtures/index.mjs') || name.includes('fixtures/index')) {
    console.log('=== Hook called for:', name)
    console.log('RunTree:', typeof exports.RunTree, exports.RunTree === undefined)
    console.log('Client:', typeof exports.Client, exports.Client === undefined)
    
    if (exports.RunTree === undefined) {
      console.log('\n!!! RunTree is undefined in hook !!!')
    }
  }
})

async function run () {
  console.log('Importing from third-party module (simulating @langchain/core)...')
  try {
    // Import from third-party module (simulating @langchain/core importing RunTree)
    // This import will trigger the circular dependency resolution
    // During this resolution, RunTree might be undefined in the hook
    const { AsyncLocalStorageProviderSingleton } = await import('../fixtures/third-party.mjs')

    console.log('Attempting to use AsyncLocalStorageProvider.runWithConfig...')
    // This should fail with TypeError: RunTree is not a constructor
    // because RunTree is undefined due to circular dependency
    await AsyncLocalStorageProviderSingleton.runWithConfig({}, async () => {
      return 'success'
    }, false)

    console.error('Test FAILED! Expected TypeError: RunTree is not a constructor')
    process.exit(1)
  } catch (err) {
    if (err.constructor.name === 'TypeError' && err.message === 'RunTree is not a constructor') {
      console.log('Test PASSED! Reproduced the bug: TypeError: RunTree is not a constructor')
      console.log('Error Type:', err.constructor.name)
      console.log('Error Message:', err.message)
    } else {
      console.error('Test FAILED! Unexpected error:')
      console.error('Error Type:', err.constructor.name)
      console.error('Error Message:', err.message)
      if (err.stack) {
        console.error('Stack:', err.stack.split('\n').slice(0, 10).join('\n'))
      }
      throw err
    }
  }
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})

import Hook from '../../index.js'
import { strictEqual } from 'assert'

Hook((exports, name) => {
    // console.log('Hooking:', name)
})

async function run() {
    console.log('Importing Client from index.mjs...')
    try {
        const { Client, treeAtLoad } = await import('../fixtures/index.mjs')

        console.log('treeAtLoad:', treeAtLoad)
        strictEqual(treeAtLoad !== null, true, 'RunTree should have been available at load time in other.mjs')

        console.log('Attempting to instantiate Client...')
        const c = new Client()
        strictEqual(c.tree.name, 'runtree')

        console.log('Test passed!')
    } catch (err) {
        console.error('Test FAILED as expected/unexpected!')
        throw err
    }
}

run().catch(err => {
    console.error(err)
    process.exit(1)
})

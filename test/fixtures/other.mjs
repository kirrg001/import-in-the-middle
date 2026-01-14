// Import VERSION from index.mjs to create circular dependency (like client.js imports __version__ from index.js)
// This completes the cycle: index.mjs -> dist/index.mjs -> base.mjs -> other.mjs -> index.mjs
// Note: client.js imports from ./index.js (not ./dist/index.js), which re-exports from dist/index.js
import { VERSION } from './index.mjs'

export class Client {
  constructor () {
    console.log('Client constructor...')
    this.version = VERSION
  }
}

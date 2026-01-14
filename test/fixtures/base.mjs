// Import Client directly from other.mjs (like run_trees.js imports Client from client.js)
// This creates: index.mjs -> dist/index.mjs -> base.mjs -> other.mjs -> index.mjs (cycle)
import { Client } from './other.mjs'

export class RunTree {
  constructor () {
    this.name = 'runtree'
    // Reference Client to ensure the import is actually used
    this.ClientClass = Client
  }
}

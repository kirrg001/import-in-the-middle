import { RunTree } from './index.mjs'

export class Client {
    constructor() {
        console.log('Client constructor using RunTree...')
        this.tree = new RunTree()
    }
}

// Greife direkt beim Laden zu
console.log('Other module loading, RunTree is:', RunTree)
export const treeAtLoad = RunTree ? new RunTree() : null

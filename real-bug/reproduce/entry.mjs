import { Hook } from 'import-in-the-middle';

new Hook(['*'], (exports, name) => {
    console.log(`[Pure IITM] Hooked ${name}`);
    return exports;
});

await import('./reproduce.mjs');

import * as wasm from 'wasm-backend';

import './index.css';

import Engine from './engine/Engine';

async function main(): Promise<void> {
    await wasm.default();
    new Engine;
}

main().catch(err => { throw err; });

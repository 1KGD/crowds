import * as wasm from 'wasm-utils';
import Phaser from 'phaser';

import Engine from './engine/Engine';

async function main(): Promise<void> {
    await wasm.default();
    new Engine;
}

main().catch(err => { throw err; });

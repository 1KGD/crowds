import * as wasm from 'wasm-utils';
import Phaser from 'phaser';

import './index.css';

import Engine from './engine/Engine';

import "@colyseus/sdk/debug";

async function main(): Promise<void> {
    await wasm.default();
    new Engine;
}

main().catch(err => { throw err; });

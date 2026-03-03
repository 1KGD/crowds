import * as wasm from 'wasm-utils';
import Phaser from 'phaser';

await wasm.default();

new Phaser.Game({
    fee
});

wasm.greet();
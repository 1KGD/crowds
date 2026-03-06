import * as wasm from 'wasm-backend';
import * as bg from 'wasm-backend/backend_bg.wasm';

import Phaser from "phaser";

import './engine.css';
import Boot from "../scenes/Boot";
import Arena from "../scenes/Arena";
import config from "../../config";

export default class Engine extends Phaser.Game {
    public readonly backend: wasm.World;

    public constructor() {
        super({
            type: Phaser.AUTO,
            pixelArt: true,
            width: config.display.width,
            clearBeforeRender: false,
            height: config.display.height,
            parent: document.getElementById("display") as HTMLCanvasElement,
        });

        this.scene.add("Boot", new Boot);
        this.scene.add("Arena", new Arena);

        this.backend = wasm.World.new(1e3, 1e3);

        console.log(this.tileBuffer);

        this.launch();
    }

    public get tileBuffer(): Uint8Array {
        return new Uint8Array(bg.memory.buffer, this.backend.tiles(), this.backend.size());
    }

    private launch(): void {
        this.scene.start("Boot");
    }
}
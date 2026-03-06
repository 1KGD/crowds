import * as wasm from 'wasm-backend';
import * as bg from 'wasm-backend/backend_bg.wasm';

import Phaser from "phaser";

import './engine.css';
import Boot from "../scenes/Boot";
import World from "../scenes/World";
import config from "../../config";

export const enum GameScenes {
    BOOT = "Boot",
    WORLD = "World"
}

export default class Engine extends Phaser.Game {
    public constructor() {
        super({
            type: Phaser.AUTO,
            pixelArt: true,
            width: config.display.width,
            clearBeforeRender: false,
            height: config.display.height,
            parent: document.getElementById("display") as HTMLCanvasElement,
        });

        this.scene.add(GameScenes.BOOT, new Boot);
        this.scene.add(GameScenes.WORLD, new World);
        this.launch();
    };

    private launch(): void {
        this.scene.start(GameScenes.BOOT);
    }
}
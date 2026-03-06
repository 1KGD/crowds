import * as wasm from 'wasm-backend';

import Phaser from "phaser";

import './engine.css';
import Boot from "../scenes/Boot";
import Arena from "../scenes/Arena";
import config from "../../config";

export default class Engine extends Phaser.Game {
    public readonly backend: wasm.Game;

    public constructor() {
        super({
            type: Phaser.AUTO,
            pixelArt: true,
            width: config.display.width,
            height: config.display.height,
            parent: document.getElementById("display") as HTMLCanvasElement,
        });

        this.scene.add("Boot", new Boot);
        this.scene.add("Arena", new Arena);

        this.backend = wasm.Game.new();

        console.log(this.backend.world.get_name());

        this.launch();
    }

    private launch(): void {
        this.scene.start("Boot");
    }
}
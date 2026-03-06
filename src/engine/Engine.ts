import Stats from 'stats-gl';

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
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH
            },
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
        const stats = new Stats({ trackGPU: true });
        document.body.appendChild(stats.domElement);
        this.events.on("prestep", () => stats.begin());
        this.events.on("postrender", () => { stats.end(); stats.update(); });
    }
}
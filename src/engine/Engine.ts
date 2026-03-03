import Phaser from "phaser";

import './engine.css';
import Boot from "../scenes/Boot";
import Arena from "../scenes/Arena";

export default class Engine extends Phaser.Game {
    public constructor() {
        super({
            type: Phaser.AUTO,
            pixelArt: true,
            width: 256,
            height: 256,
            scene: new Boot,
            parent: document.getElementById("display") as HTMLCanvasElement,
        });

        this.scene.add("Arena", new Arena);
    }
}
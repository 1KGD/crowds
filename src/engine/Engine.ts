import Phaser from "phaser";
import Arena from "../scenes/Arena";

import './engine.css';

export default class Engine extends Phaser.Game {
    public constructor() {
        super({
            type: Phaser.AUTO,
            pixelArt: true,
            width: 256,
            height: 256,
            scene: new Arena(),
            parent: document.getElementById("display") as HTMLCanvasElement
        });
    }
}
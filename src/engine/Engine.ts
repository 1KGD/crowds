import Phaser from "phaser";

import './engine.css';
import Boot from "../scenes/Boot";
import Arena from "../scenes/Arena";
import Multiplayer from "./Multiplayer";

export default class Engine extends Phaser.Game {
    public readonly multiplayer: Multiplayer;

    public constructor() {
        super({
            type: Phaser.AUTO,
            pixelArt: true,
            width: 256,
            height: 256,
            parent: document.getElementById("display") as HTMLCanvasElement,
        });

        this.multiplayer = new Multiplayer;

        this.scene.add("Boot", new Boot);
        this.scene.add("Arena", new Arena);

        void this.launch();
    }

    private async launch(): Promise<void> {
        await this.multiplayer.connect();
        this.scene.start("Boot");
    }
}
import Phaser from "phaser";
import Arena from "../scenes/Arena";

export default class Engine extends Phaser.Game {
    public constructor() {
        super({
            type: Phaser.AUTO,
            scene: new Arena()
        });
    }
}
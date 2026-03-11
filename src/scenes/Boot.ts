import Phaser from "phaser";
import { GameScenes } from "../engine/Engine";

export default class Boot extends Phaser.Scene {
    public constructor() {
        super();
    }

    public create(): void {
        this.game.scene.start(GameScenes.WORLD);
    }
}
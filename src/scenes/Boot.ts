import Phaser, { Scenes } from "phaser";
import { GameScenes } from "../engine/Engine";

export default class Boot extends Phaser.Scene {
    public constructor() {
        super();
    }

    public create(): void {
        this.scene.start(GameScenes.WORLD);
    }
}
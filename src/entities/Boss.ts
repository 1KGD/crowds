import Phaser from "phaser";
import Arena, { ArenaAssets } from "../scenes/Arena";

export default abstract class Boss extends Phaser.GameObjects.Sprite {
    protected health: number = 0;

    public constructor(scene: Arena, x: number, y: number, spritesheet: ArenaAssets) {
        super(scene, x, y, spritesheet);
        this.loadAnims();
    }

    protected abstract loadAnims(): void
}
import Phaser from "phaser";

import { ArenaAssets } from "./scenes/Arena";

export default class Player extends Phaser.GameObjects.Sprite {
    public constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, ArenaAssets.PLAYER_SPRITESHEET);
        this.addToUpdateList();

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers(ArenaAssets.PLAYER_SPRITESHEET, {start:0,end:3}),
            frameRate: 10,
            repeat: -1
        })
        this.anims.play('left');
    }
}
import Phaser from "phaser";

import { ArenaAssets } from "./scenes/Arena";

const enum PlayerAnimations {
    WALK_DOWN = "walkDown"
}

export default class Player extends Phaser.GameObjects.Sprite {
    public constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, ArenaAssets.PLAYER_SPRITESHEET);
        this.addToUpdateList();

        this.setupAnims();

        this.anims.play(PlayerAnimations.WALK_DOWN);
    }

    private setupAnims(): void {
        const walkAnim = (key: string, range: Phaser.Types.Animations.GenerateFrameNumbers): void => {
            this.anims.create({
                key,
                frames: this.anims.generateFrameNumbers(ArenaAssets.PLAYER_SPRITESHEET, range),
                frameRate: 10,
                repeat: -1
            });
        };;

        walkAnim(PlayerAnimations.WALK_DOWN, { start: 0, end: 3 });
    }
}
import Phaser from "phaser";

import { ArenaAssets } from "./scenes/Arena";

const enum PlayerAnimations {
    WALK_DOWN = "walkDown",
    WALK_UP = 'walkUp',
    WALK_LEFT = 'walkLeft',
    WALK_RIGHT = 'walkRight',
}

const enum PlayerControls {
    DOWN = 'down',
    UP = 'up',
    LEFT = 'left',
    RIGHT = 'right',
}

export default class Player extends Phaser.GameObjects.Sprite {
    private readonly keys: { [key in PlayerControls]: Phaser.Input.Keyboard.Key };

    public constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, ArenaAssets.PLAYER_SPRITESHEET);
        this.addToUpdateList();

        this.setupAnims();
        this.keys = this.setupControls();
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
        walkAnim(PlayerAnimations.WALK_UP, { start: 34, end: 37 });
        walkAnim(PlayerAnimations.WALK_LEFT, { start: 51, end: 54 });
        walkAnim(PlayerAnimations.WALK_RIGHT, { start: 17, end: 20 });
    }

    private setupControls(): { [key in PlayerControls]: Phaser.Input.Keyboard.Key } {
        const controlMap: { [key in PlayerControls]: number } = {
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
        };

        const keys = this.scene.input.keyboard?.addKeys(controlMap) as { [key in PlayerControls]: Phaser.Input.Keyboard.Key };

        return keys;
    }

    public override preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);
        const dir = { x: 0, y: 0 };

        if (this.keys.down.isDown) dir.y += 1;
        if (this.keys.up.isDown) dir.y -= 1;
        if (this.keys.left.isDown) dir.x -= 1;
        if (this.keys.right.isDown) dir.x += 1;

        const dist = Math.sqrt(dir.x ** 2 + dir.y ** 2);
        if (dist > 0) {
            const normalized = { x: dir.x / dist, y: dir.y / dist };
            this.x += normalized.x * delta * 0.1;
            this.y += normalized.y * delta * 0.1;

            let anim;
            if (dir.x !== 0) anim = dir.x < 0 ? PlayerAnimations.WALK_LEFT : PlayerAnimations.WALK_RIGHT;
            else anim = dir.y < 0 ? PlayerAnimations.WALK_UP : PlayerAnimations.WALK_DOWN;

            if (this.anims.getName() !== anim) this.anims.play(anim);
        } else if (this.anims.isPlaying) {
            this.anims.restart();
            this.anims.stop();
        }
    }
}
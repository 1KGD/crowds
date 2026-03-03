import Phaser from "phaser";

import { ArenaAssets } from "./scenes/Arena";

const enum PlayerAnimations {
    WALK_DOWN = "walkDown",
    WALK_UP = 'walkUp',
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
        walkAnim(PlayerAnimations.WALK_UP, {start: 34, end: 37});
    }

    private setupControls(): { [key in PlayerControls]: Phaser.Input.Keyboard.Key } {
        const controlMap: { [key in PlayerControls]: number } = {
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
        };

        const keys = this.scene.input.keyboard?.addKeys(controlMap) as { [key in PlayerControls]: Phaser.Input.Keyboard.Key };

        keys.down.on("down", () => this.anims.play(PlayerAnimations.WALK_DOWN));
        keys.up.on("down", () => this.anims.play(PlayerAnimations.WALK_UP));

        return keys;
    }

    public override preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);

        if (this.keys.down.isDown) this.y += delta * 0.1;
        else if (this.keys.up.isDown) this.y -= delta * 0.1;
        else if (this.keys.left.isDown) this.x -= delta * 0.1;
        else if (this.keys.right.isDown) this.x += delta * 0.1;
    }
}
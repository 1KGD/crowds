import Phaser from "phaser";
import * as Colyseus from '@colyseus/sdk';

import Arena, { ArenaAssets } from "../scenes/Arena";
import Message from "../schema/messages";
import { PlayerState } from "../schema/Arena";
import CommonPlayer, { PlayerAnimations } from "./CommonPlayer";

const enum PlayerControls {
    DOWN = 'down',
    UP = 'up',
    LEFT = 'left',
    RIGHT = 'right',
}

export default class Player extends CommonPlayer {
    private readonly keys: { [key in PlayerControls]: Phaser.Input.Keyboard.Key };
    private get networkData(): PlayerState {
        return this.scene.game.multiplayer.room.state.players.get(this.scene.game.multiplayer.room.sessionId);
    }

    protected get sessionId(): string {
        return this.scene.game.multiplayer.room.sessionId;
    }

    public constructor(scene: Arena, x: number, y: number) {
        super(scene, x, y);
        this.keys = this.setupControls();
        this.setupNetworkCallbacks();
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

            this.x = Phaser.Math.Clamp(this.x, this.width / 2, this.scene.scale.width - this.width / 2);
            this.y = Phaser.Math.Clamp(this.y, this.height / 3, this.scene.scale.height - this.height / 3);

            let anim;
            if (dir.x !== 0) anim = dir.x < 0 ? PlayerAnimations.WALK_LEFT : PlayerAnimations.WALK_RIGHT;
            else anim = dir.y < 0 ? PlayerAnimations.WALK_UP : PlayerAnimations.WALK_DOWN;

            if (this.anims.getName() !== anim || !this.anims.isPlaying) this.play(anim);
        } else if (this.anims.isPlaying) {
            this.anims.restart();
            this.stop();
        }

        if (dir.x !== this.networkData.controlsState.x || dir.y !== this.networkData.controlsState.y) this.scene.game.multiplayer.room?.send(Message.CONTROLS_UPDATE, dir);
    }

    protected override onPosUpdate(pos: { x: number; y: number; }): void {
        if (Math.abs(this.x - pos.x) > 5) this.x = pos.x;
        if (Math.abs(this.y - pos.y) > 5) this.y = pos.y;
    }
}
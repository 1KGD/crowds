import Phaser from 'phaser';
import * as Colyseus from '@colyseus/sdk';

import Arena, { ArenaAssets } from '../scenes/Arena';
import { PlayerState } from '../schema/Arena';

export const enum PlayerAnimations {
    WALK_DOWN = "walkDown",
    WALK_UP = 'walkUp',
    WALK_LEFT = 'walkLeft',
    WALK_RIGHT = 'walkRight',
}

export default abstract class CommonPlayer extends Phaser.GameObjects.Sprite {
    public override scene: Arena;

    protected abstract get sessionId(): string;

    protected get syncedState(): PlayerState {
        return this.scene.game.multiplayer.room.state.players.get(this.sessionId);
    }

    public constructor(scene: Arena, x: number, y: number) {
        super(scene, x, y, ArenaAssets.PLAYER_SPRITESHEET);

        this.setupAnims();
    }
    protected setupNetworkCallbacks(): void {
        const callbacks = Colyseus.Callbacks.get(this.scene.game.multiplayer.room);
        callbacks.onChange(this.syncedState.pos, () => this.onPosUpdate(this.syncedState.pos))
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

    protected abstract onPosUpdate(pos: { x: number, y: number }): void;
}
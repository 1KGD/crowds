import Phaser from "phaser";
import * as Colyseus from '@colyseus/sdk';

import Arena, { ArenaAssets } from "../scenes/Arena";
import { BossState } from "../schema/Arena";

export default abstract class Boss<S extends BossState> extends Phaser.GameObjects.Sprite {
    public override scene: Arena;

    protected health: number = 0;

    protected get syncedState(): S {
        return this.scene.game.multiplayer.room.state.boss as S;
    }

    public constructor(scene: Arena, x: number, y: number, spritesheet: ArenaAssets) {
        super(scene, x, y, spritesheet);
        this.loadAnims();

        const callbacks = Colyseus.Callbacks.get(this.scene.game.multiplayer.room);
        callbacks.onChange(this.syncedState.pos, () => { this.x = this.syncedState.pos.x; });
    }

    protected abstract loadAnims(): void
}
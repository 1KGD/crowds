import Phaser from "phaser";
import Player from '../entities/Player';
import * as Colyseus from '@colyseus/sdk';

import playerSpritesheetUrl from '../assets/player.png?url';
import Engine from "../engine/Engine";
import NetwokPlayer from "../entities/NetworkPlayer";

export const enum ArenaAssets {
    PLAYER_SPRITESHEET = "player_spritesheet"
}

export default class Arena extends Phaser.Scene {
    public player: Player | null = null;

    public override game: Engine;

    public constructor() {
        super({
            physics: {
                default: 'arcade',
                arcade: {
                    // debug: true
                }
            }
        });
    }

    public create(): void {
        this.player = new Player(this, 0, 0);
        this.add.existing(this.player);

        const roomCallbacks = Colyseus.Callbacks.get(this.game.multiplayer.room);
        roomCallbacks.onAdd("players", (player, sessionId) => {
            console.log(sessionId);
            if (sessionId === this.game.multiplayer.room.sessionId) return;
            console.log(player);
            this.add.existing(new NetwokPlayer(this, player.pos.x, player.pos.y, sessionId));
        });
    }

    public preload(): void {
        this.load.spritesheet(ArenaAssets.PLAYER_SPRITESHEET, playerSpritesheetUrl, {
            frameWidth: 16,
            frameHeight: 32
        });
    }
}
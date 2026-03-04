import Phaser from "phaser";
import Player from '../Player';

import playerSpritesheetUrl from '../assets/player.png?url';
import Engine from "../engine/Engine";

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
    }

    public preload(): void {
        this.load.spritesheet(ArenaAssets.PLAYER_SPRITESHEET, playerSpritesheetUrl, {
            frameWidth: 16,
            frameHeight: 32
        });
    }
}
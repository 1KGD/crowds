import Phaser from "phaser";
import Player from '../entities/Player';

import Engine from "../engine/Engine";

import playerSpritesheetUrl from '../assets/player.png?url';
import testDummySpritesheetUrl from '../assets/dummy.png?url';

export const enum ArenaAssets {
    PLAYER_SPRITESHEET = "player_spritesheet",
    TEST_DUMMY_SPRITESHEET = "test_dummy_spritesheet",
}

export default class Arena extends Phaser.Scene {
    public player: Player;

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
        this.load.spritesheet(ArenaAssets.TEST_DUMMY_SPRITESHEET, testDummySpritesheetUrl, {
            frameWidth: 32,
            frameHeight: 32
        });
    }
}
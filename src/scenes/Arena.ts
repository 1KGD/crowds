import Phaser from "phaser";
import Player from '../Player';

import playerSpritesheetUrl from '../assets/player.png?url';

export const enum ArenaAssets {
    PLAYER_SPRITESHEET = "player_spritesheet"
}

export default class Arena extends Phaser.Scene {
    public player: Player | null = null;

    public constructor() {
        super({});
    }

    public create() {
        this.player = new Player(this, 50, 50);
        this.add.existing(this.player);
        console.log(this.player);
    }

    public preload() {
        this.load.spritesheet(ArenaAssets.PLAYER_SPRITESHEET, playerSpritesheetUrl,{
            frameWidth: 16,
            frameHeight: 32
        })
    }
}
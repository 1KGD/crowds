import Phaser from "phaser";
import Player from '../entities/Player';
import * as Colyseus from '@colyseus/sdk';

import Engine from "../engine/Engine";
import NetwokPlayer from "../entities/NetworkPlayer";
import Boss from "../entities/Boss";
import TestDummy from "../entities/TestDummy";

import playerSpritesheetUrl from '../assets/player.png?url';
import testDummySpritesheetUrl from '../assets/dummy.png?url';
import testDummyMusicUrl from '../assets/dummy.mp3?url';

export const enum ArenaAssets {
    PLAYER_SPRITESHEET = "player_spritesheet",
    TEST_DUMMY_SPRITESHEET = "test_dummy_spritesheet",
    TEST_DUMMY_MUSIC = 'test_dummy_music',
}

export default class Arena extends Phaser.Scene {
    public player: Player;
    public boss: Boss;

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

        this.boss = new TestDummy(this, this.scale.width/2, this.scale.height/2);
        this.add.existing(this.boss);

        const roomCallbacks = Colyseus.Callbacks.get(this.game.multiplayer.room);
        roomCallbacks.onAdd("players", (player, sessionId) => {
            if (sessionId === this.game.multiplayer.room.sessionId) return;
            this.add.existing(new NetwokPlayer(this, player.pos.x, player.pos.y, sessionId).setName(sessionId));
        });

        roomCallbacks.onRemove("players", (player, sessionId) => {
            this.children.remove(this.children.getByName(sessionId));
        });
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
        this.load.audio(ArenaAssets.TEST_DUMMY_MUSIC, testDummyMusicUrl);
    }
}
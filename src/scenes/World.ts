import * as wasm from 'wasm-backend';
import * as wasmBG from 'wasm-backend/backend_bg.wasm';

import Phaser from "phaser";
import Player from '../entities/Player';

import Engine from "../engine/Engine";

import playerSpritesheetUrl from '../assets/player.png?url';
import testDummySpritesheetUrl from '../assets/dummy.png?url';
import tilemapUrl from '../assets/tilemap.png?url';
import config from '../../config';
import MapObject from '../engine/MapObject';
import CreatureManager from '../engine/CreatureManager';

export const enum WorldAssets {
    PLAYER_SPRITESHEET = "player_spritesheet",
    TEST_DUMMY_SPRITESHEET = "test_dummy_spritesheet",
    TILEMAP = "tilemap"
}

export default class World extends Phaser.Scene {
    public override game: Engine;

    public player: Player;
    public backend: wasm.World;
    public map: MapObject;
    public creatures: CreatureManager;

    public constructor() {
        super({
            physics: {
                default: 'arcade',
            },
        });
    }

    public create(): void {
        this.game.loadingStatus("WASM");
        this.backend = new wasm.World(config.world.width, config.world.height);

        this.map = new MapObject(this);
        this.add.existing(this.map);

        this.creatures = new CreatureManager(this);
        this.add.existing(this.creatures);

        this.player = new Player(this, this.map.pixelWidth / 2, this.map.pixelHeight / 2);
        this.add.existing(this.player);

        this.events.on('prerender', () => {
            this.map.prerender();
            this.creatures.prerender();
        });
        this.game.finishLoading();
    }

    public preload(): void {
        this.game.loadingStatus("Assets");
        this.load.spritesheet(WorldAssets.PLAYER_SPRITESHEET, playerSpritesheetUrl, {
            frameWidth: 16,
            frameHeight: 32
        });
        this.load.spritesheet(WorldAssets.TEST_DUMMY_SPRITESHEET, testDummySpritesheetUrl, {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet(WorldAssets.TILEMAP, tilemapUrl, {
            frameWidth: 16,
            frameHeight: 16
        });
    }
}
import * as wasm from 'wasm-backend';

import { t } from 'i18next';

import Phaser from "phaser";

import playerSpritesheetUrl from '../assets/player.png?url';
import testDummySpritesheetUrl from '../assets/dummy.png?url';
import tilemapUrl from '../assets/tilemap.png?url';
import fontImgUrl from '../assets/font/pixel.png?url';
import fontBinUrl from '../assets/font/pixel.fnt?url';

import config from '../../config';

import Engine from "../engine/Engine";
import Player from '../entities/Player';
import MapRenderer from '../engine/MapRenderer';
import CreatureRenderer from '../engine/CreatureRenderer';

export const enum WorldAssets {
    PLAYER_SPRITESHEET = "player_spritesheet",
    TEST_DUMMY_SPRITESHEET = "test_dummy_spritesheet",
    TILEMAP = "tilemap",
    FONT = 'font'
}

export default class World extends Phaser.Scene {
    public override game: Engine;

    public player: Player;
    public backend: wasm.World;
    public map: MapRenderer;
    public creatures: CreatureRenderer;

    public constructor() {
        super({
            physics: {
                default: 'arcade',
            },
        });
    }

    public create(): void {
        this.game.loadingStatus(t("loading.wasm"));
        this.backend = new wasm.World(config.world.width, config.world.height);

        this.map = new MapRenderer(this);
        this.add.existing(this.map);

        this.creatures = new CreatureRenderer(this);
        this.add.existing(this.creatures);

        this.player = new Player(this, 0, 0);
        this.add.existing(this.player);

        this.events.on('prerender', () => {
            this.map.prerender();
            this.creatures.prerender();
        });
        this.game.finishLoading();

        console.log(this.backend.civ);
    }

    public preload(): void {
        this.game.loadingStatus(t("loading.assets"));
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
        this.load.bitmapFont(WorldAssets.FONT, fontImgUrl, fontBinUrl);
    }
}
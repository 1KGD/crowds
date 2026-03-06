import * as wasm from 'wasm-backend';
import * as wasmBG from 'wasm-backend/backend_bg.wasm';

import Phaser from "phaser";
import Player from '../entities/Player';

import Engine from "../engine/Engine";

import playerSpritesheetUrl from '../assets/player.png?url';
import testDummySpritesheetUrl from '../assets/dummy.png?url';
import tilemapUrl from '../assets/tilemap.png?url';

export const enum WorldAssets {
    PLAYER_SPRITESHEET = "player_spritesheet",
    TEST_DUMMY_SPRITESHEET = "test_dummy_spritesheet",
    TILEMAP = "tilemap"
}

export default class World extends Phaser.Scene {
    public override game: Engine;

    public player: Player;
    public backend: wasm.World;
    private rtx: Phaser.GameObjects.RenderTexture;
    private tileImage: Phaser.GameObjects.Image;

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
        this.backend = new wasm.World(256, 256);

        this.rtx = new Phaser.GameObjects.RenderTexture(this, 0, 0, this.scale.width, this.scale.height, true);
        this.rtx.setOrigin(0, 0).setScrollFactor(0, 0);
        this.add.existing(this.rtx);

        this.player = new Player(this, 0, 0);
        this.add.existing(this.player);

        this.tileImage = this.make.image({ key: WorldAssets.TILEMAP, origin: 0 });
        
        this.cameras.main.dirty = true;
        this.events.on('prerender', () => this.prerender());
    }

    public preload(): void {
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

    private get tileBuffer(): Uint8Array {
        return new Uint8Array(wasmBG.memory.buffer, this.backend.tilesPtr, this.backend.width * this.backend.height);
    }

    /* Kudos to https://phaser.io/sandbox/iueb1Von for this */
    public prerender(): void {
        if (this.cameras.main.dirty) {
            this.drawMap();
        }
    }

    private drawMap(): void {
        this.cameras.main.preRender();
        const width = this.backend.width;
        const height = this.backend.height;
        const tileBuffer = this.tileBuffer;
        const tilewidth = 16;
        const tileheight = 16;

        const { scrollX, scrollY, worldView } = this.cameras.main;
        const xMin = Math.max(0, Math.floor(worldView.left / tilewidth));
        const xMax = Math.min(width - 1, Math.ceil(worldView.right / tilewidth));
        const yMin = Math.max(0, Math.floor(worldView.top / tileheight));
        const yMax = Math.min(height - 1, Math.ceil(worldView.bottom / tileheight));

        let tilesDrawn = 0;

        this.rtx.camera.setScroll(scrollX, scrollY);

        this.rtx.clear().beginDraw();

        for (let x = xMin; x <= xMax; x++) {
            for (let y = yMin; y <= yMax; y++) {
                const tile = tileBuffer[y * width + x];

                if (!tile || tile < 1) continue;

                this.tileImage.x = x * tilewidth;
                this.tileImage.y = y * tileheight;
                this.tileImage.setFrame(tile, false, false);

                this.rtx.batchDraw(this.tileImage);

                tilesDrawn++;
            }
        }

        document.getElementById("debug").innerText = `frame ${this.game.loop.frame} | ${tilesDrawn}/${tileBuffer.length} tiles | view x=${worldView.x} y=${worldView.y} w=${worldView.width} h=${worldView.height} | bounds min=(${xMin} ${yMin}) max=(${xMax} ${yMax}) size=(${xMax - xMin + 1} ${yMax - yMin + 1})`;

        this.rtx.endDraw();
    }
}
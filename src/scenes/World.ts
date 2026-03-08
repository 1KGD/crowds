import * as wasm from 'wasm-backend';
import * as wasmBG from 'wasm-backend/backend_bg.wasm';

import Phaser from "phaser";
import Player from '../entities/Player';

import Engine from "../engine/Engine";

import playerSpritesheetUrl from '../assets/player.png?url';
import testDummySpritesheetUrl from '../assets/dummy.png?url';
import tilemapUrl from '../assets/tilemap.png?url';
import config from '../../config';
import tileSubstitution from './tileSubstitution';

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
        this.backend = new wasm.World(config.world.width, config.world.height);

        this.rtx = new Phaser.GameObjects.RenderTexture(this, 0, 0, this.scale.width, this.scale.height, true);
        this.rtx.setOrigin(0, 0).setScrollFactor(0, 0);
        this.add.existing(this.rtx);

        this.player = new Player(this, this.pixelWidth / 2, this.pixelHeight / 2);
        this.add.existing(this.player);

        this.tileImage = this.make.image({ key: WorldAssets.TILEMAP, origin: 0, visible: false });

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

    private get surfaceBuffer(): Uint16Array {
        return new Uint16Array(wasmBG.memory.buffer, this.backend.surfacePtr, this.backend.width * this.backend.height);
    }

    private get terrainBuffer(): Uint16Array {
        return new Uint16Array(wasmBG.memory.buffer, this.backend.terrainPtr, this.backend.width * this.backend.height);
    }

    public get pixelWidth(): number {
        return config.tileset.tileWidth * this.backend.width;
    }

    public get pixelHeight(): number {
        return config.tileset.tileHeight * this.backend.height;
    }

    public prerender(): void {
        this.drawMap();
    }

    /* Kudos to https://phaser.io/sandbox/iueb1Von for this */
    private drawMap(): void {
        this.cameras.main.preRender();
        const width = this.backend.width;
        const height = this.backend.height;
        const layers = [this.surfaceBuffer, this.terrainBuffer];

        const { scrollX, scrollY, worldView } = this.cameras.main;
        const xMin = Math.max(0, Math.floor(worldView.left / config.tileset.tileWidth));
        const xMax = Math.min(width - 1, Math.ceil(worldView.right / config.tileset.tileWidth));
        const yMin = Math.max(0, Math.floor(worldView.top / config.tileset.tileHeight));
        const yMax = Math.min(height - 1, Math.ceil(worldView.bottom / config.tileset.tileHeight));

        this.rtx.camera.setScroll(scrollX, scrollY);

        this.rtx.clear().beginDraw();

        for (const layer of layers) {
            for (let x = xMin; x <= xMax; x++) {
                for (let y = yMin; y <= yMax; y++) {
                    let tile = layer[y * width + x];

                    if (!tile || tile < 1) continue;

                    tile = this.subTile(tile, layer, width, x, y);

                    if (tile in tileSubstitution.animated) {
                        const anim = tileSubstitution.animated[tile];
                        tile = anim.frames[Math.floor(this.game.loop.frame / this.game.loop.targetFps * anim.speed) % anim.frames.length];
                    };

                    this.tileImage.x = x * config.tileset.tileWidth;
                    this.tileImage.y = y * config.tileset.tileHeight;
                    this.tileImage.setFrame(tile - 1, false, false);
                    this.rtx.batchDraw(this.tileImage);
                }
            }
        }

        document.getElementById("debug").innerText = `frame ${this.game.loop.frame} view x=${worldView.x} y=${worldView.y} w=${worldView.width} h=${worldView.height} | bounds min=(${xMin} ${yMin}) max=(${xMax} ${yMax}) size=(${xMax - xMin + 1} ${yMax - yMin + 1})`;

        this.rtx.endDraw();
    }

    private subTile(tile: number, layer: Uint16Array, width: number, x: number, y: number): number {
        if (tile in tileSubstitution.corner) {
            for (const sub of tileSubstitution.corner[tile]) {
                if (layer[(y - 1) * width + x] === sub.condition && layer[y * width + x - 1] === sub.condition) return sub.topLeft;
                if (layer[(y - 1) * width + x] === sub.condition && layer[y * width + x + 1] === sub.condition) return sub.topRight;
                if (layer[(y + 1) * width + x] === sub.condition && layer[y * width + x - 1] === sub.condition) return sub.bottomLeft;
                if (layer[(y + 1) * width + x] === sub.condition && layer[y * width + x + 1] === sub.condition) return sub.bottomRight;
            }
        }

        if (tile in tileSubstitution.edge) {
            for (const sub of tileSubstitution.edge[tile]) {
                if (layer[(y - 1) * width + x] === sub.condition) return sub.top;
                if (layer[(y + 1) * width + x] === sub.condition) return sub.bottom;
                if (layer[y * width + x - 1] === sub.condition) return sub.left;
                if (layer[y * width + x + 1] === sub.condition) return sub.right;
            }
        }

        if (tile in tileSubstitution.corner) {
            for (const sub of tileSubstitution.corner[tile]) {
                if (layer[(y - 1) * width + x - 1] === sub.condition && layer[(y - 1) * width + x] === tile && layer[y * width + x - 1] === tile) return sub.innerBottomRight;
                if (layer[(y - 1) * width + x + 1] === sub.condition && layer[(y - 1) * width + x] === tile && layer[y * width + x + 1] === tile) return sub.innerBottomLeft;
                if (layer[(y + 1) * width + x - 1] === sub.condition && layer[(y + 1) * width + x] === tile && layer[y * width + x - 1] === tile) return sub.innerTopRight;
                if (layer[(y + 1) * width + x + 1] === sub.condition && layer[(y + 1) * width + x] === tile && layer[y * width + x + 1] === tile) return sub.innerTopLeft;
            }
        }

        return tile;
    }
}
import * as wasmBG from 'wasm-backend/backend_bg.wasm';

import Phaser from "phaser";
import World, { WorldAssets } from '../scenes/World';
import config from '../../config';
import tileSubstitution from '../scenes/tileSubstitution';

export default class MapObject extends Phaser.GameObjects.RenderTexture {
    public override scene: World;

    private readonly tileImage: Phaser.GameObjects.Image;

    public constructor(scene: World) {
        super(scene, 0, 0, scene.scale.width, scene.scale.height, true);

        this.tileImage = this.scene.make.image({ key: WorldAssets.TILEMAP, origin: 0, visible: false });
        this.setOrigin(0, 0);
        this.setScrollFactor(0, 0);
    }

    private get surfaceBuffer(): Uint16Array {
        return new Uint16Array(wasmBG.memory.buffer, this.scene.backend.surfacePtr, this.scene.backend.width * this.scene.backend.height);
    }

    private get terrainBuffer(): Uint16Array {
        return new Uint16Array(wasmBG.memory.buffer, this.scene.backend.terrainPtr, this.scene.backend.width * this.scene.backend.height);
    }

    public get pixelWidth(): number {
        return config.tileset.tileWidth * this.scene.backend.width;
    }

    public get pixelHeight(): number {
        return config.tileset.tileHeight * this.scene.backend.height;
    }

    public prerender(): void {
        this.drawMap();
    }

    /* Kudos to https://phaser.io/sandbox/iueb1Von for this */
    private drawMap(): void {
        this.scene.cameras.main.preRender();
        const width = this.scene.backend.width;
        const height = this.scene.backend.height;
        const layers = [this.surfaceBuffer, this.terrainBuffer];

        const { scrollX, scrollY, worldView } = this.scene.cameras.main;
        const xMin = Math.max(0, Math.floor(worldView.left / config.tileset.tileWidth));
        const xMax = Math.min(width - 1, Math.ceil(worldView.right / config.tileset.tileWidth));
        const yMin = Math.max(0, Math.floor(worldView.top / config.tileset.tileHeight));
        const yMax = Math.min(height - 1, Math.ceil(worldView.bottom / config.tileset.tileHeight));

        this.camera.setScroll(scrollX, scrollY);

        this.clear().beginDraw();

        for (const layer of layers) {
            for (let x = xMin; x <= xMax; x++) {
                for (let y = yMin; y <= yMax; y++) {
                    let tile = layer[y * width + x];

                    if (!tile || tile < 1) continue;

                    tile = this.subTile(tile, layer, width, x, y);

                    if (tile in tileSubstitution.animated) {
                        const anim = tileSubstitution.animated[tile];
                        tile = anim.frames[Math.floor(this.scene.game.loop.frame / this.scene.game.loop.targetFps * anim.speed) % anim.frames.length];
                    };

                    this.tileImage.x = x * config.tileset.tileWidth;
                    this.tileImage.y = y * config.tileset.tileHeight;
                    this.tileImage.setFrame(tile - 1, false, false);
                    this.batchDraw(this.tileImage);
                }
            }
        }

        this.endDraw();
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
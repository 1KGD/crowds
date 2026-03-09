import Phaser from "phaser";
import World, { WorldAssets } from "../scenes/World";
import config from "../../config";

export default class CreatureManager extends Phaser.GameObjects.RenderTexture {
    public override scene: World;

    private readonly spriteImage: Phaser.GameObjects.Image;

    public constructor(scene: World) {
        super(scene, 0, 0, scene.scale.width, scene.scale.height, true);

        this.spriteImage = this.scene.make.image({ key: WorldAssets.TEST_DUMMY_SPRITESHEET, origin: 0, visible: true });
        this.setOrigin(0, 0);
        this.setScrollFactor(0, 0);
    }

    public prerender(): void {
        this.scene.cameras.main.preRender();
        const width = this.scene.backend.width;
        const height = this.scene.backend.height;

        const { scrollX, scrollY, worldView } = this.scene.cameras.main;

        this.camera.setScroll(scrollX, scrollY);

        this.clear().beginDraw();

        for (const creature of this.scene.backend.creatures) {
            this.spriteImage.x = creature.pos.x * config.tileset.tileWidth;
            this.spriteImage.y = creature.pos.y * config.tileset.tileHeight;
            this.spriteImage.setFrame(2, false, false);
            this.batchDraw(this.spriteImage);
        }

        this.endDraw();
    }
}
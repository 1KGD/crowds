import Phaser from "phaser";
import World, { WorldAssets } from "../scenes/World";
import config from "../../config";

export default class CreatureManager extends Phaser.GameObjects.RenderTexture {
    public override scene: World;

    private readonly spriteImage: Phaser.GameObjects.Image;
    private readonly text: Phaser.GameObjects.BitmapText;

    public constructor(scene: World) {
        super(scene, 0, 0, scene.scale.width, scene.scale.height, true);
        this.addToUpdateList();

        this.spriteImage = this.scene.make.image({ key: WorldAssets.TEST_DUMMY_SPRITESHEET, visible: false });
        this.text = this.scene.add.bitmapText(0, 0, WorldAssets.FONT);
        this.text.visible = false;

        this.setOrigin(0, 0);
        this.setScrollFactor(0, 0);
    }

    public preUpdate(_time: number, delta: number): void {
        this.scene.backend.tick(delta / 1000);
    }

    public prerender(): void {
        this.scene.cameras.main.preRender();
        const { scrollX, scrollY, worldView } = this.scene.cameras.main;

        this.camera.setScroll(scrollX, scrollY);

        this.clear().beginDraw();

        const creatures = this.scene.backend.creatures;

        for (const creature of creatures) {
            const pos = creature.pos;
            const anim = creature.anim;
            creature.free();
            const [x, y] = [pos.x * config.tileset.tileWidth, pos.y * config.tileset.tileHeight];
            pos.free();
            if (x + this.spriteImage.width / 2 < worldView.left || x - this.spriteImage.width / 2 > worldView.right || y + this.spriteImage.height / 2 < worldView.top || y - this.spriteImage.height / 2 > worldView.bottom) continue;

            this.spriteImage.setPosition(x, y);
            this.spriteImage.setFrame(Math.floor(anim / 2) * 6 + Math.floor(this.scene.game.loop.frame / 10) % 4, false, false);
            this.batchDraw(this.spriteImage);

            this.text.text = `${anim}`;
            this.text.setPosition(x - Math.floor(this.text.width / 2), y - Math.floor(this.text.height / 2 + this.spriteImage.height / 2));
            this.batchDraw(this.text);
        }

        this.endDraw();
    }
}
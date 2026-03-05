import Arena, { ArenaAssets } from "../scenes/Arena";
import Boss from "./Boss";

const enum TestDummyAnims {
    WALK_DOWN = 'walk_down',

    SLEEP = "sleep",
}

export default class TestDummy extends Boss {
    public constructor(scene: Arena, x: number, y: number) {
        super(scene, x, y, ArenaAssets.TEST_DUMMY_SPRITESHEET);

        this.anims.play(TestDummyAnims.SLEEP);
    }

    protected override loadAnims(): void {
        const walkAnim = (key: TestDummyAnims, range: Phaser.Types.Animations.GenerateFrameNumbers): void => {
            this.anims.create({
                key,
                frames: this.anims.generateFrameNumbers(ArenaAssets.TEST_DUMMY_SPRITESHEET, range),
                frameRate: 10,
                repeat: -1
            });
        };

        walkAnim(TestDummyAnims.WALK_DOWN, { start: 0, end: 3 });

        this.anims.create({
            key: TestDummyAnims.SLEEP,
            frames: this.anims.generateFrameNumbers(ArenaAssets.TEST_DUMMY_SPRITESHEET, { frames: [4, 10, 16, 22] }),
            frameRate: 5,
            repeat: -1
        });
    }
}
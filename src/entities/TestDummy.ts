import Arena, { ArenaAssets } from "../scenes/Arena";
import { TestDummyState } from "../schema/Arena";
import Boss from "./Boss";

const enum TestDummyAnims {
    WALK_DOWN = 'walk_down',

    SLEEP = "sleep",
}

export default class TestDummy extends Boss<TestDummyState> {
    public constructor(scene: Arena) {
        super(scene, 0, 0, ArenaAssets.TEST_DUMMY_SPRITESHEET);

        this.anims.play(TestDummyAnims.SLEEP);

        this.scene.sound.play(ArenaAssets.TEST_DUMMY_MUSIC);
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

    public override onPosUpdate(pos: { x: number; y: number; }): void {
        this.x = pos.x;
        this.y = pos.y;
    }
}
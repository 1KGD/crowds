import Phaser from "phaser";

export default class Boot extends Phaser.Scene {
    public constructor() {
        super();
    }

    public create(): void {
        this.scene.start("Arena");
    }
}
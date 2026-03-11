import Phaser from 'phaser';
import Engine, { GameScenes } from '../engine/Engine';
import { t } from 'i18next';

import fontImgUrl from '../assets/font/pixel.png?url';
import fontBinUrl from '../assets/font/pixel.fnt?url';

export const enum MainMenuAssets {
    FONT = "main_menu_font"
}

export default class MainMenu extends Phaser.Scene {
    public override game: Engine;

    private titleText: Phaser.GameObjects.BitmapText;

    public create(): void {
        this.titleText = new Phaser.GameObjects.BitmapText(this, this.scale.width / 2, this.scale.height / 4, MainMenuAssets.FONT, t("menu.title"), 20, 1);
        this.titleText.x -= this.titleText.width / 2;
        this.titleText.setInteractive();
        this.add.existing(this.titleText);

        this.input.on("gameobjectover", () => this.scene.start(GameScenes.WORLD));
    }

    public preload(): void {
        this.load.bitmapFont(MainMenuAssets.FONT, fontImgUrl, fontBinUrl);
    }
}
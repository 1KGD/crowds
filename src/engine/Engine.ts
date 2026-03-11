import Stats from 'stats-gl';

import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import Phaser from "phaser";

import './engine.css';
import Boot from "../scenes/Boot";
import World from "../scenes/World";
import config from "../../config";

import enTranslations from '../assets/lang/en.json';
import MainMenu from '../scenes/MainMenu';

export const enum GameScenes {
    BOOT = "Boot",
    MAIN_MENU = "Main Menu",
    WORLD = "World"
}

export default class Engine extends Phaser.Game {
    public constructor() {
        super({
            type: Phaser.AUTO,
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH
            },
            pixelArt: true,
            width: config.display.width,
            clearBeforeRender: false,
            height: config.display.height,
            parent: document.getElementById("display") as HTMLCanvasElement,

            input: {
                activePointers: 1
            }
        });

        this.scene.add(GameScenes.BOOT, new Boot);
        this.scene.add(GameScenes.MAIN_MENU, new MainMenu);
        this.scene.add(GameScenes.WORLD, new World);

        this.launch().catch(err => { throw err; });
    };

    public loadingStatus(status: string): void {

    }

    public finishLoading(): void {
        document.getElementById("loading").hidden = true;
    }

    private async launch(): Promise<void> {
        this.scene.start(GameScenes.BOOT);
        await i18next.use(LanguageDetector).init({
            debug: config.dev,
            supportedLngs: ["dev", "en"],
            resources: {
                en: {
                    translation: enTranslations
                }
            },
        });
        if (config.dev) {
            const stats = new Stats({ trackGPU: true, trackCPT: true });
            document.body.appendChild(stats.domElement);
            this.events.on("prestep", () => stats.begin());
            this.events.on("postrender", () => { stats.end(); stats.update(); });
        }
    }
}
import CommonPlayer from "./CommonPlayer";
import Arena from "../scenes/Arena";

export default class NetwokPlayer extends CommonPlayer {
    private readonly id: string;

    protected override get sessionId(): string {
        return this.id;
    }

    public constructor(scene: Arena, x: number, y: number, id: string) {
        super(scene, x, y);
        this.id = id;
        this.setupNetworkCallbacks();
    }

    public override onPosUpdate(pos: { x: number, y: number }): void {
        this.x = pos.x;
        this.y = pos.y;
    }
}
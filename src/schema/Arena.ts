import * as $ from '@colyseus/schema';
import config from '../../config';

class Vec2State extends $.Schema {
    @$.type('number') public x: number;
    @$.type('number') public y: number;

    public constructor(x: number, y: number) {
        super();
        this.set(x, y);
    }

    public set(x: number, y: number): this {
        this.x = x;
        this.y = y;
        return this;
    }
}

export class PlayerState extends $.Schema {
    @$.type(Vec2State) public readonly pos: Vec2State;
    @$.view() @$.type(Vec2State) public readonly controlsState: Vec2State;

    public constructor() {
        super();
        this.pos = new Vec2State(0, 0);
        this.controlsState = new Vec2State(0, 0);
    }

    public update(delta: number): void {
        const dist = Math.sqrt(this.controlsState.x ** 2 + this.controlsState.y ** 2);
        if (dist > 0) {
            this.pos.x += this.controlsState.x / dist * delta * 0.1;
            this.pos.y += this.controlsState.y / dist * delta * 0.1;

            this.pos.x = Math.max(0, Math.min(this.pos.x, config.gameplay.arena.width));
            this.pos.y = Math.max(0, Math.min(this.pos.y, config.gameplay.arena.height));
        }
    }
}

export abstract class BossState extends $.Schema {
    @$.type(Vec2State) public readonly pos: Vec2State;
    @$.type("number") public health: number;
    @$.type("number") public maxHealth: number;
    @$.type("string") public anim: string;

    protected constructor(maxHealth: number) {
        super();
        this.maxHealth = maxHealth;
        this.health = this.maxHealth;
        this.pos = new Vec2State(0, 0);
        this.anim = "";
    }

    public abstract serverUpdate(delta: number): void
}

export @$.entity class TestDummyState extends BossState {\
    private time: number = 0;

    public constructor() {
        super(100)
    }

    public override serverUpdate(delta: number): void {
        this.pos.set(
            Math.sin(this.time) * 20 + config.gameplay.arena.width/2,
            Math.cos(this.time) * 20 + config.gameplay.arena.height/2
        );

        this.time += delta;
    }
}

export default class ArenaState<B extends BossState> extends $.Schema {
    @$.type({ map: PlayerState }) public readonly players = new $.MapSchema<PlayerState>;
    @$.type(BossState) public readonly boss: B;

    public constructor(boss: B) {
        super();
        this.boss = boss;
    }
}
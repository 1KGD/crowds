import * as $ from '@colyseus/schema';

class Vec2State extends $.Schema {
    @$.type('number') public x: number;
    @$.type('number') public y: number;

    public constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
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

            this.pos.x = Math.max(0, Math.min(this.pos.x, 256));
            this.pos.y = Math.max(0, Math.min(this.pos.y, 256));
        }
    }
}

export abstract class BossState extends $.Schema {
    @$.type(Vec2State) public readonly pos: Vec2State;
    @$.type("number") public health: number;
    @$.type("number") public readonly maxHealth: number;

    public constructor() {
        super();
        this.health = this.maxHealth;
        this.pos = new Vec2State(0, 0);
    }
}

export class TestDummyState extends BossState {
    public override maxHealth: number = 100;
}

export default class ArenaState<B extends BossState> extends $.Schema {
    @$.type({ map: PlayerState }) public readonly players = new $.MapSchema<PlayerState>;
    @$.type(BossState) public readonly boss: B;

    public constructor(boss: B) {
        super();
        this.boss = boss;
    }
}
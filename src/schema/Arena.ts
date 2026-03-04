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
    @$.type(Vec2State) public pos: Vec2State;

    public constructor() {
        super();
        this.pos = new Vec2State(0, 0);
    }
}

export default class ArenaState extends $.Schema {
    @$.type({ map: PlayerState }) public players = new $.MapSchema<PlayerState>();
}
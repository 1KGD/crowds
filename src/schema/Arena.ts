import * as $ from '@colyseus/schema';

class Vec2State extends $.Schema {
    @$.type('number') public x: number;
    @$.type('number') public y: number;
}

export class PlayerState extends $.Schema {
    @$.type(Vec2State) public pos: Vec2State;
}

export default class ArenaState extends $.Schema {
    @$.type({ map: PlayerState }) public players = new $.MapSchema<PlayerState>();
}
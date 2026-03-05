import * as Colyseus from "@colyseus/sdk";
import config from "../../config";
import Rooms from "../schema/rooms";
import ArenaState, { BossState } from "../schema/Arena";
import Arena from "../scenes/Arena";

export default class Multiplayer {
    private readonly client: Colyseus.Client;
    public room: Colyseus.Room<ArenaState<BossState>>;

    public constructor() {
        this.client = new Colyseus.Client("/api/");
    }

    public async connect(): Promise<void> {
        this.room = await this.client.joinOrCreate(Rooms.ARENA, {}, ArenaState) as unknown as Colyseus.Room<ArenaState<BossState>>;
    }
}
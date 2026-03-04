import * as Colyseus from "@colyseus/sdk";
import config from "../../config";
import Rooms from "../schema/rooms";
import ArenaState from "../schema/Arena";

export default class Multiplayer {
    private readonly client: Colyseus.Client;
    public room: Colyseus.Room<ArenaState>;

    public constructor() {
        this.client = new Colyseus.Client("/api/");
    }

    public async connect(): Promise<void> {
        this.room = await this.client.joinOrCreate(Rooms.ARENA, {}, ArenaState);
    }
}
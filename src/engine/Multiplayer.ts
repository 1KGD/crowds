import * as Colyseus from "@colyseus/sdk";
import config from "../config";
import Rooms from "../schema/rooms";
import ArenaState from "../schema/Arena";

export default class Multiplayer {
    private readonly client: Colyseus.Client;

    public constructor() {
        this.client = new Colyseus.Client("/api/");
        this.client.joinOrCreate(Rooms.LOBBY, {}, ArenaState);
    }
}
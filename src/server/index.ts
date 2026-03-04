import express from "express";
import { LobbyRoom, Server, WebSocketTransport } from 'colyseus';
import { playground } from '@colyseus/playground';

import Rooms from "../schema/rooms";
import config from '../../config';
import ArenaRoom from "./ArenaRoom";

class GameServer extends Server {
    private expressApp: express.Application;

    public constructor() {
        super({
            greet: false,
            express: (app: express.Application) => { this.expressApp = app; this.setupRoutes(); },
            transport: new WebSocketTransport()
        });

        this.define(Rooms.LOBBY, LobbyRoom).enableRealtimeListing();
        this.define(Rooms.ARENA, ArenaRoom);
    }

    private setupRoutes(): void {
        this.expressApp.use("/playground", playground());
    }
}

const server = new GameServer;
server.listen(config.multiplayer.port).catch(err => { throw err; });
import * as Colyseus from 'colyseus';
import ArenaState, { PlayerState, TestDummyState } from '../schema/Arena';
import { StateView } from '@colyseus/schema';

type Client = Colyseus.Client<{
    messages: {
        0: { x: number, y: number }
    }
}>

export default class ArenaRoom extends Colyseus.Room<{ state: ArenaState<TestDummyState>, client: Client }> {
    public override state = new ArenaState<TestDummyState>(new TestDummyState);

    private playerIntervals: { [key: string]: Colyseus.Delayed };

    public override messages: Colyseus.Messages<this> = {
        0: (client: Client, payload: { x: number, y: number }) => {
            const constrolsState = this.state.players.get(client.sessionId).controlsState;
            constrolsState.x = payload.x !== 0 ? payload.x / Math.abs(payload.x) : 0;
            constrolsState.y = payload.y !== 0 ? payload.y / Math.abs(payload.y) : 0;
        }
    };

    public override onCreate(options: {}): void {
        this.playerIntervals = {};

        this.clock.setInterval(() => {
            this.state.boss.serverUpdate(1 / 20);
        }, 1 / 20);
    }

    public override onJoin(client: Client, options?: {}, auth?: {}): void {
        const player = new PlayerState;
        client.view = new StateView;
        this.state.players.set(client.sessionId, player);
        client.view.add(player);
        this.playerIntervals[client.sessionId] = this.clock.setInterval(() => player.update(1000 / 20), 1 / 20);
    }

    public override onLeave(client: Client, code?: number): void {
        this.state.players.delete(client.sessionId);
        this.playerIntervals[client.sessionId].clear();
        delete this.playerIntervals[client.sessionId];
    }
}
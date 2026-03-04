import * as Colyseus from 'colyseus';
import ArenaState, { PlayerState } from '../schema/Arena';
import { StateView } from '@colyseus/schema';

type Client = Colyseus.Client<{
    messages: {
        0: { x: number, y: number }
    }
}>

export default class ArenaRoom extends Colyseus.Room<{ state: ArenaState, client: Client }> {
    public override state = new ArenaState();

    // IMPORTANT: Receiving updates 60 times a second, therefore delta will not work!

    public override messages: Colyseus.Messages<this> = {
        0: (client: Client, payload: { x: number, y: number }) => {
            const constrolsState = this.state.players.get(client.sessionId).controlsState;
            constrolsState.x = payload.x !== 0 ? payload.x / Math.abs(payload.x) : 0;
            constrolsState.y = payload.y !== 0 ? payload.y / Math.abs(payload.y) : 0;
        }
    };

    public override onJoin(client: Client, options?: {}, auth?: {}): void {
        const player = new PlayerState;
        client.view = new StateView;
        this.state.players.set(client.sessionId, player);
        client.view.add(player);
        this.clock.setInterval(() => player.update(1000 / 20), 1 / 20);
    }
}
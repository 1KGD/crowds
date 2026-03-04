import * as Colyseus from 'colyseus';
import ArenaState, { PlayerState } from '../schema/Arena';

type Client = Colyseus.Client<{
    messages: {
        0: { x: number, y: number }
    }
}>

export default class ArenaRoom extends Colyseus.Room<{ state: ArenaState, client: Client }> {
    public override state = new ArenaState();

    private get delta(): number {
        return this.clock.deltaTime / 1000;
    }

    public override messages: Colyseus.Messages<this> = {
        0: (client: Client, payload: { x: number, y: number }) => {
            const pos = this.state.players.get(client.sessionId).pos;

            if (payload.x !== 0) payload.x = payload.x / Math.abs(payload.x);
            if (payload.y !== 0) payload.y = payload.y / Math.abs(payload.y);

            const dist = Math.sqrt(payload.x ** 2 + payload.y ** 2);
            if (dist > 0) {
                pos.x += payload.x / dist * this.delta * 40;
                pos.y += payload.y / dist * this.delta * 40;

                pos.x = Math.max(0, Math.min(pos.x, 256));
                pos.y = Math.max(0, Math.min(pos.y, 256));
            }
        }
    };

    public override onJoin(client: Client, options?: {}, auth?: {}): void {
        this.state.players.set(client.sessionId, new PlayerState());
    }
}
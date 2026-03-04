import * as Colyseus from 'colyseus';
import ArenaState from '../schema/Arena';

export default class ArenaRoom extends Colyseus.Room<{ state: ArenaState }> {
    public override state = new ArenaState();
}
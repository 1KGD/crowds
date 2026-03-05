export interface ISyncedPos {
    onPosUpdate(pos: { x: number, y: number }): void;
}
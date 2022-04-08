import { IntitiativeTrack, TrackItem } from '../models/initiative';

let state: IntitiativeTrack = {
    current: null,
    track: [],
};

export const getInitiativeState = (): IntitiativeTrack => state;

export const setInitiativeState = (newState: IntitiativeTrack): IntitiativeTrack => {
    state = newState;
    return state;
};

export const addItem = (item: TrackItem): IntitiativeTrack => {
    state.track.push(item);
    return state;
};

export const setCurrentPlayer = (id: string): void => {
    state.current = id;
};

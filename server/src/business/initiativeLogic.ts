import * as InitiativeDAL from '../data/initiativeDAL';
import { IntitiativeTrack, TrackItem } from '../models/initiative';
import { v4 as uuidv4 } from 'uuid';

export const getInitiative = (): IntitiativeTrack => InitiativeDAL.getInitiativeState();

export const setInitiative = (state: IntitiativeTrack): IntitiativeTrack => InitiativeDAL.setInitiativeState(state);

export const addItem = (item: { name: string; value: number }): void => {
    const id = uuidv4();

    const newItem: TrackItem = {
        id,
        name: item.name || 'Unknown',
        value: item.value || 0,
    };

    var currentState = InitiativeDAL.addItem(newItem);
    if (!currentState.current) InitiativeDAL.setCurrentPlayer(newItem.id);
};

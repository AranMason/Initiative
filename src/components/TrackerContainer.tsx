import React from 'react';
import useInitiativeTracker from '../hooks/useInititativeTracker';
import AddItemForm from './AddIItemForm';
import InitiativeItem from './InitiativeItem';
import ItemListener from './ItemListener';

const TrackerContainer: React.FC = () => {
    const { nextTurn, removeItem, sort, clear } = useInitiativeTracker();

    return (
        <React.Fragment>
            <div className="tracker-container layout-flex-column flex-gap-m">
                <ItemListener>
                    {tracker => {
                        if ((tracker?.track?.length || 0) === 0) return 'Empty';

                        return tracker.track.map(item => {
                            return (
                                <InitiativeItem
                                    key={item.id}
                                    name={item.name}
                                    initiative={item.value}
                                    isCurrentTurn={item.id === tracker.current}
                                    onDelete={() => removeItem(item.id)}
                                ></InitiativeItem>
                            );
                        });
                    }}
                </ItemListener>
            </div>

            <AddItemForm />

            <div className="layout-flex-row flex-gap-m">
                <button
                    type="button"
                    onClick={() => {
                        nextTurn();
                    }}
                >
                    Next
                </button>
                <button type="button" placeholder="Name" onClick={() => sort()}>
                    Sort
                </button>
                <button type="button" placeholder="Initiative" onClick={() => clear()}>
                    Clear
                </button>
            </div>
        </React.Fragment>
    );
};

export default TrackerContainer;

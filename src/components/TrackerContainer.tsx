import React from 'react';
import useInitiativeTracker from '../hooks/useInititativeTracker';
import AddItemForm from './AddIItemForm';
import ItemListener from './ItemListener';

const TrackerContainer: React.FC = () => {
  const { nextTurn, removeItem, sort, clear } = useInitiativeTracker();

  return (
    <React.Fragment>
      <ItemListener>
        {tracker => {
          if ((tracker?.track?.length || 0) === 0) return <div>No Items found</div>;

          return (
            <ul>
              {tracker.track.map(item => {
                return (
                  <li key={item.id}>
                    {item.name} - {item.value} {item.id === tracker.current ? ' - CURRENT TURN' : ''}
                    <button type="button" onClick={() => removeItem(item.id)}>
                      Delete
                    </button>
                  </li>
                );
              })}
            </ul>
          );
        }}
      </ItemListener>
      <AddItemForm></AddItemForm>
      <button
        type="button"
        onClick={() => {
          nextTurn();
        }}
      >
        Next
      </button>
      <button type="button" onClick={() => sort()}>
        Sort
      </button>
      <button type="button" onClick={() => clear()}>
        Clear
      </button>
    </React.Fragment>
  );
};

export default TrackerContainer;

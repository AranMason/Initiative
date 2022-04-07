let state = {
    current: null,
    track: [],
};

const getInitiativeState = () => state;

const setInitiativeState = newState => {
    state = newState;
    return state;
};

const addItem = item => {
    state.track.push(item);

    if (!state.current) state.current === item.id;
};

module.exports = {
    getInitiativeState,
    setInitiativeState,
    addItem,
};

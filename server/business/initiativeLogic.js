const _dal = require('../data/initiativeDAL');
const { v4: uuidv4 } = require('uuid');

const getInitiative = () => _dal.getInitiativeState();

const setInitiative = state => _dal.setInitiativeState(state);

const addItem = item => {
    const id = uuidv4();

    const newItem = {
        id,
        name: item.name || 'Unknown',
        value: item.value || 0,
    };

    _dal.addItem(newItem);
};

module.exports = {
    getInitiative,
    setInitiative,
    addItem,
};

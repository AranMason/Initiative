const { v4: uuidv4 } = require('uuid');
const _logic = require('../business/initiativeLogic');
var express = require('express'),
    router = express.Router();

let clients = [];

function sendEventsToAll() {
    clients.forEach(client => client.response.write(`data: ${JSON.stringify(_logic.getInitiative())}\n\n`));
}

// ---------------------
function eventsHandler(request, response, next) {
    const headers = {
        'Content-Type': 'text/event-stream',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache',
    };
    response.writeHead(200, headers);

    const data = `data: ${JSON.stringify(_logic.getInitiative())}\n\n`;

    response.write(data);

    const clientId = request.session?.id || uuidv4();

    const newClient = {
        id: clientId,
        response,
    };

    request.session.id = clientId;

    clients.push(newClient);

    request.on('close', () => {
        clients = clients.filter(client => client.id !== clientId);
    });
}

async function addItem(request, respsonse, next) {
    const newItem = _logic.addItem({
        name: request.body.name,
        value: request.body.value,
    });

    respsonse
        .json(newItem)
        .status(200)
        .end();
    return sendEventsToAll();
}

async function removeItem(request, response, next) {
    let initiative = _logic.getInitiative();
    const itemIndex = initiative.track.findIndex(i => i.id === request.body.id);
    const item = initiative.track[itemIndex];
    if (!item) response.status(500);
    else {
        if (item.id === initiative.current) {
            const newCurrentIndex = (itemIndex + 1) % initiative.track.length;
            initiative.current = initiative.track[newCurrentIndex]?.id || null;
        }

        initiative.track = initiative.track.filter(i => i.id !== item.id);

        if (initiative.track.length === 0) {
            initiative.current = null;
        }
        _logic.setInitiative(initiative);
        response.json(item).end();
        return sendEventsToAll();
    }
}

async function nextTurn(request, response, next) {
    let initiative = _logic.getInitiative();
    if (initiative.track.length <= 0) {
        initiative.current = null;
    } else {
        const currentTurn = initiative.track.findIndex(i => i.id === initiative.current);
        const nextTurn = (currentTurn + 1) % initiative.track.length;

        initiative.current = initiative.track[nextTurn].id;
    }

    _logic.setInitiative(initiative);
    response.status(200).end();
    return sendEventsToAll();
}

async function sortItems(request, response, next) {
    let initiative = _logic.getInitiative();
    function getValue(item) {
        return item.value + (item.isPlayer ? 0.1 : 0);
    }

    if (initiative.track.length === 0) {
        response.status(200);
        return;
    }

    initiative.track = initiative.track.sort((a, b) => {
        return getValue(b) - getValue(a);
    });

    initiative.current = initiative.track[0]?.id || null;

    _logic.setInitiative(initiative);
    response.status(200).end();
    return sendEventsToAll();
}

async function clear(request, response, next) {
    _logic.setInitiative({ current: null, track: [] });
    response.status(200).end();
    return sendEventsToAll();
}

router.get('/listener', eventsHandler);

router.post('/', addItem);

router.delete('/', removeItem);

router.patch('/next', nextTurn);

router.post('/sort', sortItems);

router.delete('/clear', clear);

//

module.exports = router;
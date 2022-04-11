import { v4 as uuidv4 } from 'uuid';
import * as InitiativeLogic from '../business/initiativeLogic';
import { RequestHandler, Router } from 'express';

const router = Router();

declare global {
    namespace Express {
        interface Session {
            data: {
                id: string;
            };
        }
    }
}

let clients = [];

function sendEventsToAll() {
    const initiativeState = InitiativeLogic.getInitiative();

    clients.forEach(client => client.response.write(`data: ${JSON.stringify(initiativeState)}\n\n`));
}

// ---------------------
const eventsHandler: RequestHandler = async (request, response, next) => {
    const headers = {
        'Content-Type': 'text/event-stream',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache',
    };
    response.writeHead(200, headers);

    const data = `data: ${JSON.stringify(InitiativeLogic.getInitiative())}\n\n`;

    response.write(data);

    const clientId = request.session?.id || uuidv4();

    const newClient = {
        id: clientId,
        response,
    };

    request.session.data.id = clientId;

    clients.push(newClient);

    request.on('close', () => {
        clients = clients.filter(client => client.id !== clientId);
    });
};

const addItem: RequestHandler = async (request, respsonse, next) => {
    const newItem = InitiativeLogic.addItem({
        name: request.body.name,
        value: request.body.value,
    });

    respsonse
        .json(newItem)
        .status(200)
        .end();
    return sendEventsToAll();
};

const removeItem: RequestHandler = async (request, response, next) => {
    let initiative = InitiativeLogic.getInitiative();
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
        InitiativeLogic.setInitiative(initiative);
        response.json(item).end();
        return sendEventsToAll();
    }
};

const nextTurn: RequestHandler = async (request, response, next) => {
    let initiative = InitiativeLogic.getInitiative();
    if (initiative.track.length <= 0) {
        initiative.current = null;
    } else {
        const currentTurn = initiative.track.findIndex(i => i.id === initiative.current);
        const nextTurn = (currentTurn + 1) % initiative.track.length;

        initiative.current = initiative.track[nextTurn].id;
    }

    InitiativeLogic.setInitiative(initiative);
    response.status(200).end();
    return sendEventsToAll();
};

const sortItems: RequestHandler = async (request, response, next) => {
    let initiative = InitiativeLogic.getInitiative();
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

    InitiativeLogic.setInitiative(initiative);
    response.status(200).end();
    return sendEventsToAll();
};

const clear: RequestHandler = (request, response, next) => {
    InitiativeLogic.setInitiative({ current: null, track: [] });
    response.status(200).end();
    return sendEventsToAll();
};

router.get('/listener', eventsHandler);

router.post('/', addItem);

router.delete('/', removeItem);

router.patch('/next', nextTurn);

router.post('/sort', sortItems);

router.delete('/clear', clear);

//

export default router;

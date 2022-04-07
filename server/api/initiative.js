const { v4: uuidv4 } = require('uuid');
var express = require('express'),
  router = express.Router();

const initialState = {
  current: null,
  track: [],
};

let clients = [];
let initiative = { ...initialState };

function sendEventsToAll(list) {
  // console.log('Got Fact: ', newFact);
  clients.forEach(client => client.response.write(`data: ${JSON.stringify(initiative)}\n\n`));
}

// ---------------------
function eventsHandler(request, response, next) {
  const headers = {
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache',
  };
  response.writeHead(200, headers);

  const data = `data: ${JSON.stringify(initiative)}\n\n`;

  response.write(data);

  const clientId = request.session?.id || uuidv4();

  const newClient = {
    id: clientId,
    response,
  };

  request.session.id = clientId;

  clients.push(newClient);

  request.on('close', () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter(client => client.id !== clientId);
  });
}

async function addItem(request, respsonse, next) {
  const id = uuidv4();

  const newItem = {
    id,
    name: request.body.name || 'Unknown',
    value: request.body.value || 0,
  };

  if (!initiative.current) {
    initiative.current = id;
  }

  initiative.track.push(newItem);
  respsonse.json(newItem);
  return sendEventsToAll(initiative);
}

async function removeItem(request, response, next) {
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
    response.json(item).end();
    return sendEventsToAll(initiative);
  }
}

async function nextTurn(request, response, next) {
  if (initiative.track.length <= 0) {
    initiative.current = null;
  } else {
    const currentTurn = initiative.track.findIndex(i => i.id === initiative.current);
    const nextTurn = (currentTurn + 1) % initiative.track.length;

    initiative.current = initiative.track[nextTurn].id;
  }

  response.status(200).end();

  return sendEventsToAll(initiative);
}

async function sortItems(request, response, next) {
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

  response.status(200).end();
  return sendEventsToAll(initiative);
}

async function clear(request, response, next) {
  initiative = { current: null, track: [] };
  response.json({
    isSuccessful: true,
  });
  return sendEventsToAll(initiative);
}

router.get('/listener', eventsHandler);

router.post('/', addItem);

router.delete('/', removeItem);

router.patch('/next', nextTurn);

router.post('/sort', sortItems);

router.delete('/clear', clear);

//

module.exports = router;

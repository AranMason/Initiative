const { v4: uuidv4 } = require('uuid');
var express = require('express'),
  router = express.Router();

let clients = [];
let initiative = {
  current: null,
  track: [],
};

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

  const clientId = uuidv4();

  const newClient = {
    id: clientId,
    response,
  };

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

  console.log('Added item: ', newItem);

  if (!initiative.current) {
    initiative.current = id;
  }

  initiative.track.push(newItem);
  respsonse.json(newItem);
  return sendEventsToAll(initiative);
}

async function removeItem(request, response, next) {
  const item = initiative.track.find(i => i.id === request.body.id);
  if (!item) response.status(500);
  else {
    console.log('Removed Item: ', item);
    initiative.track = initiative.track.filter(i => i.id !== item.id);
    response.json(item);
    return sendEventsToAll(initiative);
  }
}

async function nextTurn(request, response, next) {
  if (initiative.track.length <= 0) {
    initiative.current = null;
  } else {
    const currentTurn = initiative.track.findIndex(i => i.id === initiative.current);
    const nextTurn = (currentTurn + 1) % initiative.track.length;

    console.log('New Turn: ', currentTurn, nextTurn);

    initiative.current = initiative.track[nextTurn].id;
  }

  response.json({
    isSuccessful: true,
  });

  return sendEventsToAll(initiative);
}

router.get('/listener', eventsHandler);

router.post('/item', addItem);

router.delete('/item', removeItem);

router.patch('/next', nextTurn);

//

module.exports = router;

const { v4: uuidv4 } = require('uuid');
var express = require('express'),
  router = express.Router();

const clients = [];
const initiativeTrack = [];

function sendEventsToAll(list) {
  // console.log('Got Fact: ', newFact);
  clients.forEach(client => client.response.write(`data: ${JSON.stringify(initiativeTrack)}\n\n`));
}

// ---------------------
function eventsHandler(request, response, next) {
  const headers = {
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache',
  };
  response.writeHead(200, headers);

  const data = `data: ${JSON.stringify(initiativeTrack)}\n\n`;

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

  initiativeTrack.push(newItem);
  respsonse.json(newItem);
  return sendEventsToAll(initiativeTrack);
}

async function removeItem(request, response, next) {
  const item = initiativeTrack.find(i => i.id === request.body.id);
  if (!item) response.status(500);
  else {
    console.log('Removed Item: ', item);
    initiativeTrack = initiativeTrack.filter(i => i.id !== item.id);
    response.json(item);
    return sendEventsToAll(initiativeTrack);
  }
}

router.get('/listener', eventsHandler);

router.post('/item', addItem);

router.delete('/item', removeItem);
//

module.exports = router;

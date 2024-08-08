const dgram = require('dgram');
const WebSocket = require('ws');

const server = dgram.createSocket('udp4');
const wss = new WebSocket.Server({ port: 8080 }); // WebSocket server on port 8080

const PORT = 12345; 
const HOST = '127.0.0.1'; 

server.on('listening', () => {
  const address = server.address();
  console.log(`UDP Server listening on ${address.address}:${address.port}`);
});

server.on('message', (message, remote) => {
  const messageString = message.toString();
  const entry = messageString.substring(24, 28).trim(); 
  const riderName = messageString.substring(28, 48).trim(); 
  const horseName = messageString.substring(48, 91).trim();
  const timeAllowed = messageString.substring(91, 97).trim();
  const ttb = messageString.substring(97, 102).trim(); 
  const timeTaken = messageString.substring(110, 121).trim(); 
  const jumpFaults = messageString.substring(121, 126).trim(); 
  const timeFaults = messageString.substring(126, 131).trim(); 
  const totalFaults = messageString.substring(131, 137).trim(); 
  const rank = messageString.substring(137, 145).trim(); 

  const data = {
    entry,
    riderName,
    horseName,
    timeAllowed,
    ttb,
    timeTaken,
    jumpFaults,
    timeFaults,
    totalFaults,
    rank
  };

  console.log(data);

  // Envoyer les données à tous les clients WebSocket connectés
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
});

server.bind(PORT, HOST);

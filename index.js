'use strict';

const http = require('http');
const net = require('net');
const path = require('path');

const { PORT = 8080, TCP_PORT = 4040 } = process.env;

// Keep track of the chat clients
const clients = [];

// Start a TCP Server
net.createServer((socket) => {

  // Identify this client
  socket.name = socket.remoteAddress + ':' + socket.remotePort;

  // Put this new client in the list
  clients.push(socket);

  // Send a nice welcome message and announce
  socket.write('Welcome ' + socket.name + '\n');
  broadcast(socket.name + ' joined the chat\n', socket);

  // Handle incoming messages from clients.
  socket.on('data', (data) => {
    console.log(data);
    broadcast(socket.name + '> ' + data, socket);
  });

  // Remove the client from the list when it leaves
  socket.on('end', () => {
    clients.splice(clients.indexOf(socket), 1);
    broadcast(socket.name + ' left the chat.\n');
  });

  // Send a message to all clients
  function broadcast (message, sender) {
    clients.forEach((client) => {
      // Don't want to send it to sender
      if (client === sender) {
        return;
      }
      client.write(message);
    });
    // Log it to the server output too
    process.stdout.write(message);
  }

}).listen(TCP_PORT);

// Put a friendly message on the terminal of the server.
console.log(`TCP chat server running at port ${TCP_PORT}`);

// HTTP
const pkg = require(path.resolve(__dirname, 'package.json'));

// dummy server for environments who need something listening on port 8080
const server = http.createServer((req, res) => {
  res.end(`${pkg.name}@${pkg.version}`);
});

server.listen(PORT);
console.log(`HTTP server running at port ${PORT}`);

import net from 'net';
import { TcpChat } from './tcp-chat.js';

export function startTcpServer ({ port }) {

  const chat = new TcpChat();

  // Start a TCP Server
  net.createServer((socket) => {

    const client = {
      write: (text) => socket.write(text),
    };

    chat.addClient(client);

    socket.on('data', (textBuffer) => chat.processMessage(textBuffer.toString(), client));

    // TODO, what do we do?
    socket.on('error', (error) => console.error(error));

    socket.on('end', () => chat.removeClient(client));

  }).listen(port);

  console.log(`TCP server running at port ${port}`);
}

import { TcpChat } from './tcp-chat.js';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

// Deno uses an async iterators to receive TCP connections and TCP messages
// It's not the best fit for a "push" stream so
// moving those iterations in async functions allows us to continue the function execution

async function listenToConnections (tcpServer, chat) {
  for await (const conn of tcpServer) {

    const client = {
      write: (text) => conn.write(encoder.encode(text)),
    };

    chat.addClient(client);

    listenToMessages(chat, conn, client);
  }
}

async function listenToMessages (chat, conn, client) {
  for await (const textArray of Deno.iter(conn)) {
    const text = decoder.decode(textArray);
    chat.processMessage(text, client);
  }
  chat.removeClient(client);
}

export function startTcpServer ({ port }) {

  const chat = new TcpChat();

  // Start a TCP Server
  const tcpServer = Deno.listen({ port });

  listenToConnections(tcpServer, chat);

  console.log(`TCP server running at port ${port}`);
}

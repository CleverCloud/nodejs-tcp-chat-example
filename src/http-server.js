import { serve } from 'https://deno.land/std@0.50.0/http/server.ts';

async function listenToRequests (httpServer, publicTcpPort) {
  for await (const req of httpServer) {
    const { hostname } = new URL('http://' + req.headers.get('host'));
    req.respond({
      // language=HTML
      body: `
        <title>TCP Chat demo</title>
        <h1>TCP Chat demo</h1>
        <p>Try me with a TCP client like "telnet" or "nc":</p>
        <pre>nc ${hostname} ${publicTcpPort}</pre>
      `,
    });
  }
}

export function startHttpServer ({ port, publicTcpPort }) {

  const httpServer = serve({ port });

  // Deno uses an async iterator to receive HTTP connections
  // It's not the best fit for a "push" stream so
  // moving this iteration in an async function allows us to continue the function execution
  listenToRequests(httpServer, publicTcpPort);

  console.log(`HTTP server running at port ${port}`);
}

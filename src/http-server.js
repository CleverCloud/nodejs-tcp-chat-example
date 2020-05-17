import http from 'http';

export function startHttpServer ({ port, publicTcpPort }) {

  const server = http.createServer((req, res) => {
    const { hostname } = new URL('http://' + req.headers.host);
    // language=HTML
    res.end(`
      <title>TCP Chat demo</title>
      <h1>TCP Chat demo</h1>
      <p>Try me with a TCP client like "telnet" or "nc":</p>
      <pre>nc ${hostname} ${publicTcpPort}</pre>
    `);
  });

  server.listen(port);

  console.log(`HTTP server running at port ${port}`);
}

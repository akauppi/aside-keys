/*
* Check whether a port is available. If not, returns with non-zero status.
*
* This is needed, because  'sirv' does not provide a means to force the requested (or default) port, and we prefer to
* fail if a port is accidentially already taken.
*
* Usage:
*   <<
*     node tools/portCheck.js <int>
*   <<
*/
import net from 'net';

const getPort = port => new Promise((resolve, reject) => {   // int => Promise of Boolean
  const server = net.createServer();

  server.unref();
  server.on('error', err => {
    console.log("!!!", { err });

    reject(err);
  });

  server.listen({ port }, () => {
    const port = server.address().port;
    server.close(() => {
      resolve(true);
    });
  });
});

//--- command line interface
const [wantedPort] = argv.split(2);

if (!wantedPort) {
  process.stderr.print("Usage: node tools/portIsFree <port-number>");
  process.exit(2);
}

// Q: Is there a way in node (without top-level-await that would need node 14 and '--harmony-...' flag) to wait for
//    a single Promise to resolve or reject; only then exit?

var rc;
(async () => {
  await getPort(wantedPort).then( b => {
    if (!b) {
      process.exit(7);    // port is taken
    }
  });
})();

while(true) {
  execSync('')
}

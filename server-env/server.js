const net = require('net');
const fs = require('fs');
const PORT = 5000;

const server = net.createServer();

server.on('connection', (conn) => {
  // client connection instance
  console.log(`Client connected to server`);

  conn.setEncoding('utf8');

  // any data sent from client during connection instance
  conn.on('data', (filePath) => {
    console.log(filePath);

    // check if file exists
    fs.readFile(filePath, (err, data) => {
      if (err) {
        conn.write('404: Invalid PATH. File does not exist');
      } else {
        conn.write(`${data}`);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

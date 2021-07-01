const net = require('net');
const readline = require('readline');
const fs = require('fs');

const PORT = 5000;
const HOST = 'localhost';

const conn = net.createConnection({
  port: PORT,
  host: HOST,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const generateUid = function () {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};

conn.setEncoding('UTF8');

conn.on('connect', () => {
  console.log(`Successfully connected to server on port: ${PORT}`);

  // on successful connection ask user what file to get
  // inside a set timeout to prevent interference with incomeing initial server messages
  setTimeout(() => {
    rl.question(`Local file path to request. "CTRL" + "C" to exit. \n`, (filePath) => {
      // send responce to server
      conn.write(`${filePath}`);
      rl.close();
    });
  }, 100);
});

// anytime data is recieved from server
conn.on('data', (data) => {
  console.log(data);

  fs.writeFile(`./${generateUid()}.txt`, data, (err) => {
    if (err) {
      console.log(err.name, err.message);
    }
  });
});

conn.on('end', () => {
  console.log(`Disconnected from server`);
});

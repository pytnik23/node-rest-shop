const http = require('http');
const app = require('./app');
const port = require('./constants').PORT;
const baseUrl = require('./constants').BASE_URL;

const server = http.createServer(app);

server.listen(port, () => console.log(`Server running on ${baseUrl}`));

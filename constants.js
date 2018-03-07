const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'http://localhost';
const BASE_URL = `${HOST}:${PORT}`;

module.exports = { PORT, HOST, BASE_URL };

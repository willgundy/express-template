const http = require('node:http');
const app = require('./lib/app');
const sequelize = require('./lib/utils/sequelize.js');

const PORT = process.env.PORT || 7890;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log('🚀 Server running', server.address());
});

process.on('exit', () => {
  console.log('👋  Goodbye!');
  sequelize.close();
});

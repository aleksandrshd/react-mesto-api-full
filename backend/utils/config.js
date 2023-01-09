const { PORT = 3000 } = process.env;

const { MONGO_IP = '127.0.0.1', MONGO_PORT = 27017 } = process.env;

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = {
  PORT, MONGO_IP, MONGO_PORT, NODE_ENV, JWT_SECRET,
};

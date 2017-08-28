module.exports = {
  url: process.env.MONGO_URL,
  debug: true,
  options: {
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS,
    poolSize: 5,
    autoReconnect: true,
    connectTimeoutMS: 30000, // Driver default, connection timeout after 30 seconds
    keepAlive: 1000,         // Send a keepalive packet every second
    ha: true,
    readPreference: 'nearest',
  },
};

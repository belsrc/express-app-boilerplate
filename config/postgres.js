module.exports = {
  url: '',
  config: {
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASS,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    timezone: '+00:00',  // UTC time
    logging: true,       // Query logging
    retry: { max: 5 },   // Query retry count
  },
};

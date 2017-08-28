module.exports = {
  server: process.env.MAIL_SERVER,
  port: process.env.MAIL_PORT,
  user: process.env.MAIL_USER,
  pass: process.env.MAIL_PASS,
  mailingList: {
    errors: { name: '', address: '' },
  },
  sendList: {
    error: 'Error@something.com',
  },
  subjectList: {
    error: 'Application Error',
  },
};

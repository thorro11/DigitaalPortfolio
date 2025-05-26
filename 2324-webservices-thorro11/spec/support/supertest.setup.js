const supertest = require('supertest'); // 👈 4
const createServer = require('../../src/createServer'); // 👈 3
const { getKnex, tables } = require('../../src/data'); // 👈 4
const setup = require('./global.setup');
const teardown = require('./global.teardown');

const login = async (supertest) => {
  const response = await supertest.post('/api/users/login').send({
    email: 'test.user@gmail.com',
    password: '12345678',
  });

  if (response.statusCode !== 200) {
    throw new Error(response.body.message || 'Unknown error occured');
  }

  return `Bearer ${response.body.token}`;
};

const loginAdmin = async (supertest) => {
  const response = await supertest.post('/api/users/login').send({
    email: 'test.admin@student.hogent.be',
    password: '12345678',
  });

  if (response.statusCode !== 200) {
    throw new Error(response.body.message || 'Unknown error occured');
  }

  return `Bearer ${response.body.token}`;
};

const withServer = (setter) => {
  let server;

  beforeAll(async () => {
    server = await createServer();

    setter({
      knex: getKnex(),
      supertest: supertest(server.getApp().callback()),
    });
    await setup();
  });

  afterAll(async () => {
    await teardown();
    await server.stop();
  });
};

module.exports = {
  login,
  loginAdmin,
  withServer,
};

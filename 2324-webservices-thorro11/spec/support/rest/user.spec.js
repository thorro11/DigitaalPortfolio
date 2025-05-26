const { tables } = require('../../../src/data');
const Role = require('../../../src/core/roles');
const { withServer, login, loginAdmin } = require('../supertest.setup');
const { testAuthHeader } = require('../common/auth');

const data = {
  users: [
    {
      id: 3,
      voornaam: 'User',
      achternaam: 'One',
      telefoonnummer: '1',
      email: 'one@user.be',
      geboortedatum: new Date('1967-04-21'),
      straat: 'Haanhoutstraat',
      huisnummer: 52,
      postcode: 9080,
      plaats: 'Lochristi',
      land: 'België',
      password_hash: 'doesntmatter',
      roles: JSON.stringify([Role.USER]),
    },
    {
      id: 4,
      voornaam: 'User',
      achternaam: 'Two',
      telefoonnummer: '2',
      email: 'two@user.be',
      geboortedatum: new Date('1967-04-21'),
      straat: 'Haanhoutstraat',
      huisnummer: 52,
      postcode: 9080,
      plaats: 'Lochristi',
      land: 'België',
      password_hash: 'doesntmatter',
      roles: JSON.stringify([Role.USER]),
    },
    {
      id: 5,
      voornaam: 'User',
      achternaam: 'Three',
      telefoonnummer: '3',
      email: 'three@user.be',
      geboortedatum: new Date('1967-04-21'),
      straat: 'Haanhoutstraat',
      huisnummer: 52,
      postcode: 9080,
      plaats: 'Lochristi',
      land: 'België',
      password_hash: 'doesntmatter',
      roles: JSON.stringify([Role.USER]),
    },
  ],
};

const dataToDelete = {
  users: [3, 4, 5],
};

describe('Users', () => {
  let request, knex, authHeader, adminAuthHeader;

  withServer(({ supertest, knex: k }) => {
    request = supertest;
    knex = k;
  });

  beforeAll(async () => {
    authHeader = await login(request);
    adminAuthHeader = await loginAdmin(request);
  });

  const url = '/api/users';

  describe('GET /api/users', () => {
    beforeAll(async () => {
      await knex(tables.user).insert(data.users);
    });

    afterAll(async () => {
      await knex(tables.user).whereIn('id', dataToDelete.users).delete();
    });

    it('should 200 and return all users', async () => {
      const response = await request
        .get(url)
        .set('Authorization', adminAuthHeader);
      expect(response.status).toBe(200);
      expect(response.body.aantal).toBeGreaterThan(3);
      expect(response.body.users).toContain({
        id: 4,
        voornaam: 'User',
        achternaam: 'Two',
        telefoonnummer: '2',
        email: 'two@user.be',
        geboortedatum: new Date('1967-04-21').toISOString(),
        straat: 'Haanhoutstraat',
        huisnummer: 52,
        postcode: 9080,
        plaats: 'Lochristi',
        land: 'België',
        roles: [Role.USER],
      });
      expect(response.body.users).toContain({
        id: 5,
        voornaam: 'User',
        achternaam: 'Three',
        telefoonnummer: '3',
        email: 'three@user.be',
        geboortedatum: new Date('1967-04-21').toISOString(),
        straat: 'Haanhoutstraat',
        huisnummer: 52,
        postcode: 9080,
        plaats: 'Lochristi',
        land: 'België',
        roles: [Role.USER],
      });
      expect(response.body.users).toContain({
        id: 3,
        voornaam: 'User',
        achternaam: 'One',
        telefoonnummer: '1',
        email: 'one@user.be',
        geboortedatum: new Date('1967-04-21').toISOString(),
        straat: 'Haanhoutstraat',
        huisnummer: 52,
        postcode: 9080,
        plaats: 'Lochristi',
        land: 'België',
        roles: [Role.USER],
      });
    });

    it('should 400 when given an argument', async () => {
      const response = await request
        .get(`${url}?invalid=true`)
        .set('Authorization', adminAuthHeader);
      //console.log(expect().toBeString);
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');

      //expect(response.body.details.query).toHaveObject('invalid');
    });

    testAuthHeader(() => request.get(url));
  });

  describe('GET /api/user/:id', () => {
    beforeAll(async () => {
      await knex(tables.user).insert(data.users[0]);
    });

    afterAll(async () => {
      await knex(tables.user).whereIn('id', dataToDelete.users).delete();
    });

    it('should 200 and return the requested user', async () => {
      const response = await request
        .get(`${url}/2`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 2,
        voornaam: 'Test',
        achternaam: 'User',
        telefoonnummer: '0470346152',
        email: 'test.user@gmail.com',
        geboortedatum: new Date('1967-04-21').toISOString(),
        straat: 'Haanhoutstraat',
        huisnummer: 52,
        postcode: 9080,
        plaats: 'Lochristi',
        land: 'België',
        roles: [Role.USER],
      });
    });

    it('should 400 with invalid user id', async () => {
      const response = await request
        .get(`${url}/invalid`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      //expect(response.body.details.params).toHaveProperty('id');
    });

    testAuthHeader(() => request.get(`${url}/2`));
  });

  describe('POST /api/users/register', () => {
    afterAll(async () => {
      // Delete the created user
      await knex(tables.user)
        .where('id', '>', 2) // test user id = 1, admin id = 2
        .delete();
    });

    it('should 200 and return the created user', async () => {
      const response = await request.post(`${url}/register`).send({
        voornaam: 'New',
        achternaam: 'User',
        telefoonnummer: '123',
        email: 'new@user.be',
        geboortedatum: new Date('1967-04-21'),
        straat: 'Haanhoutstraat',
        huisnummer: 52,
        postcode: 9080,
        plaats: 'Lochristi',
        land: 'België',
        password: '12345678',
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.token).toBeTruthy();
      expect(response.body.user.voornaam).toBe('New');
      expect(response.body.user.achternaam).toBe('User');
      expect(response.body.user.email).toBe('new@user.be');
      expect(response.body.user.passwordHash).toBeUndefined();
    });

    it('should 400 with duplicate telefoonnummer', async () => {
      const response = await request.post(`${url}/register`).send({
        voornaam: 'Bestaande',
        achternaam: 'Gebruiker',
        telefoonnummer: '0470346152',
        email: 'bestaande.gebruiker@gmail.com',
        geboortedatum: new Date('1980-01-01'),
        straat: 'Bestaandestraat',
        huisnummer: 1,
        postcode: 1234,
        plaats: 'Voorbeeldstad',
        land: 'Nederland',
        password: '12345678',
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    it('should 400 with duplicate email', async () => {
      const response = await request.post(`${url}/register`).send({
        voornaam: 'Bestaande',
        achternaam: 'Gebruiker',
        telefoonnummer: '0612345678',
        email: 'bestaande.gebruiker@gmail.com',
        geboortedatum: new Date('1980-01-01'),
        straat: 'Bestaandestraat',
        huisnummer: 1,
        postcode: '1234AB',
        plaats: 'Voorbeeldstad',
        land: 'Nederland',
        password: '12345678',
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    it('should 400 when missing voornaam', async () => {
      const response = await request.post(`${url}/register`).send({
        achternaam: 'Vermeers',
        telefoonnummer: '0470346152',
        email: 'jos.vermeers@gmail.com',
        geboortedatum: new Date('1967-04-21'),
        straat: 'Haanhoutstraat',
        huisnummer: 52,
        postcode: '9080',
        plaats: 'Lochristi',
        land: 'België',
        password: '12345678',
      });
      expect(response.status).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    it('should 400 when missing achternaam', async () => {
      const response = await request.post(`${url}/register`).send({
        voornaam: 'Jos',
        telefoonnummer: '0470346152',
        email: 'jos.vermeers@gmail.com',
        geboortedatum: new Date('1967-04-21'),
        straat: 'Haanhoutstraat',
        huisnummer: 52,
        postcode: '9080',
        plaats: 'Lochristi',
        land: 'België',
        password: '12345678',
      });
      expect(response.status).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    it('should 400 when missing telefoonnummer', async () => {
      const response = await request.post(`${url}/register`).send({
        voornaam: 'Jos',
        achternaam: 'Vermeers',
        email: 'jos.vermeers@gmail.com',
        geboortedatum: new Date('1967-04-21'),
        straat: 'Haanhoutstraat',
        huisnummer: 52,
        postcode: '9080',
        plaats: 'Lochristi',
        land: 'België',
        password: '12345678',
      });
      expect(response.status).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    it('should 400 when missing email', async () => {
      const response = await request.post(`${url}/register`).send({
        voornaam: 'Jos',
        achternaam: 'Vermeers',
        telefoonnummer: '0470346152',
        geboortedatum: new Date('1967-04-21'),
        straat: 'Haanhoutstraat',
        huisnummer: 52,
        postcode: '9080',
        plaats: 'Lochristi',
        land: 'België',
        password: '12345678',
      });
      expect(response.status).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    it('should 400 when missing geboortedatum', async () => {
      const response = await request.post(`${url}/register`).send({
        voornaam: 'Jos',
        achternaam: 'Vermeers',
        telefoonnummer: '0470346152',
        email: 'jos.vermeers@gmail.com',
        straat: 'Haanhoutstraat',
        huisnummer: 52,
        postcode: '9080',
        plaats: 'Lochristi',
        land: 'België',
        password: '12345678',
      });
      expect(response.status).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    it('should 400 when missing straat', async () => {
      const response = await request.post(`${url}/register`).send({
        voornaam: 'Jos',
        achternaam: 'Vermeers',
        telefoonnummer: '0470346152',
        email: 'jos.vermeers@gmail.com',
        geboortedatum: new Date('1967-04-21'),
        huisnummer: 52,
        postcode: '9080',
        plaats: 'Lochristi',
        land: 'België',
        password: '12345678',
      });
      expect(response.status).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    it('should 400 when missing huisnummer', async () => {
      const response = await request.post(`${url}/register`).send({
        voornaam: 'Jos',
        achternaam: 'Vermeers',
        telefoonnummer: '0470346152',
        email: 'jos.vermeers@gmail.com',
        geboortedatum: new Date('1967-04-21'),
        straat: 'Haanhoutstraat',
        postcode: '9080',
        plaats: 'Lochristi',
        land: 'België',
        password: '12345678',
      });
      expect(response.status).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    it('should 400 when missing postcode', async () => {
      const response = await request.post(`${url}/register`).send({
        voornaam: 'Jos',
        achternaam: 'Vermeers',
        telefoonnummer: '0470346152',
        email: 'jos.vermeers@gmail.com',
        geboortedatum: new Date('1967-04-21'),
        straat: 'Haanhoutstraat',
        huisnummer: 52,
        plaats: 'Lochristi',
        land: 'België',
        password: '12345678',
      });
      expect(response.status).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    it('should 400 when missing plaats', async () => {
      const response = await request.post(`${url}/register`).send({
        voornaam: 'Jos',
        achternaam: 'Vermeers',
        telefoonnummer: '0470346152',
        email: 'jos.vermeers@gmail.com',
        geboortedatum: new Date('1967-04-21'),
        straat: 'Haanhoutstraat',
        huisnummer: 52,
        postcode: '9080',
        land: 'België',
        password: '12345678',
      });
      expect(response.status).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    it('should 400 when missing land', async () => {
      const response = await request.post(`${url}/register`).send({
        voornaam: 'Jos',
        achternaam: 'Vermeers',
        telefoonnummer: '0470346152',
        email: 'jos.vermeers@gmail.com',
        geboortedatum: new Date('1967-04-21'),
        straat: 'Haanhoutstraat',
        huisnummer: 52,
        postcode: '9080',
        plaats: 'Lochristi',
        password: '12345678',
      });
      expect(response.status).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });
  });

  describe('PUT /api/users/:id', () => {
    beforeAll(async () => {
      await knex(tables.user).insert(data.users[0]);
    });

    afterAll(async () => {
      await knex(tables.user).whereIn('id', dataToDelete.users).delete();
    });

    it('should 200 and return the updated user', async () => {
      const response = await request
        .put(`${url}/3`)
        .set('Authorization', adminAuthHeader)
        .send({
          voornaam: 'bewerkt',
          achternaam: 'bewerkt',
          telefoonnummer: '123',
          email: 'bewerkt@gmail.com',
          straat: 'bewerkt',
          huisnummer: 52,
          postcode: 9080,
          plaats: 'bewerkt',
          land: 'bewerkt',
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 3,
        voornaam: 'User',
        achternaam: 'One',
        email: 'bewerkt@gmail.com',
        telefoonnummer: '123',
        geboortedatum: '1967-04-21T00:00:00.000Z',
        straat: 'bewerkt',
        huisnummer: 52,
        postcode: 9080,
        plaats: 'bewerkt',
        land: 'bewerkt',
        roles: ['user'],
      });
    });

    it('should 404 when updating not existing user', async () => {
      const response = await request
        .put(`${url}/7`)
        .set('Authorization', adminAuthHeader)
        .send({
          voornaam: 'test',
          achternaam: 'test',
          telefoonnummer: '0470346152',
          email: 'jos123.vermeers@gmail.com',
          straat: 'Haanhoutstraat',
          huisnummer: 52,
          postcode: 9080,
          plaats: 'Lochristi',
          land: 'België',
        });
      expect(response.statusCode).toBe(404);
      expect(response.body.code).toEqual('NOT_FOUND');
      expect(response.body.message).toEqual('No user with id 7 exists');
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 when missing voornaam', async () => {
      const response = await request
        .put(`${url}/3`)
        .set('Authorization', adminAuthHeader)
        .send({
          achternaam: 'test',
          telefoonnummer: '0470346152',
          email: 'jos.vermeers@gmail.com',
          huisnummer: 52,
          postcode: 9080,
          plaats: 'Lochristi',
          land: 'België',
        });
      expect(response.status).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    it('should 400 when missing achternaam', async () => {
      const response = await request
        .put(`${url}/3`)
        .set('Authorization', adminAuthHeader)
        .send({
          voornaam: 'test',
          telefoonnummer: '0470346152',
          email: 'jos.vermeers@gmail.com',
          huisnummer: 52,
          postcode: 9080,
          plaats: 'Lochristi',
          land: 'België',
        });
      expect(response.status).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    it('should 400 when missing straat', async () => {
      const response = await request
        .put(`${url}/3`)
        .set('Authorization', adminAuthHeader)
        .send({
          voornaam: 'test',
          achternaam: 'test',
          telefoonnummer: '0470346152',
          email: 'jos.vermeers@gmail.com',
          huisnummer: 52,
          postcode: 9080,
          plaats: 'Lochristi',
          land: 'België',
        });
      expect(response.status).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    it('should 400 when missing huisnummer', async () => {
      const response = await request
        .put(`${url}/3`)
        .set('Authorization', adminAuthHeader)
        .send({
          voornaam: 'Jos',
          achternaam: 'Vermeers',
          telefoonnummer: '0470346152',
          email: 'jos.vermeers@gmail.com',
          straat: 'Haanhoutstraat',
          postcode: 9080,
          plaats: 'Lochristi',
          land: 'België',
        });
      expect(response.status).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    it('should 400 when missing postcode', async () => {
      const response = await request
        .put(`${url}/3`)
        .set('Authorization', adminAuthHeader)
        .send({
          voornaam: 'Jos',
          achternaam: 'Vermeers',
          telefoonnummer: '0470346152',
          email: 'jos.vermeers@gmail.com',
          straat: 'Haanhoutstraat',
          huisnummer: 52,
          plaats: 'Lochristi',
          land: 'België',
        });
      expect(response.status).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    it('should 400 when missing plaats', async () => {
      const response = await request
        .put(`${url}/3`)
        .set('Authorization', adminAuthHeader)
        .send({
          voornaam: 'Jos',
          achternaam: 'Vermeers',
          telefoonnummer: '0470346152',
          email: 'jos.vermeers@gmail.com',
          straat: 'Haanhoutstraat',
          huisnummer: 52,
          postcode: '9080',
          land: 'België',
        });
      expect(response.status).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    it('should 400 when missing land', async () => {
      const response = await request
        .put(`${url}/3`)
        .set('Authorization', adminAuthHeader)
        .send({
          voornaam: 'Jos',
          achternaam: 'Vermeers',
          telefoonnummer: '0470346152',
          email: 'jos.vermeers@gmail.com',
          straat: 'Haanhoutstraat',
          huisnummer: 52,
          postcode: '9080',
          plaats: 'Lochristi',
        });
      expect(response.status).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    it('should 400 when missing telefoonnummer', async () => {
      const response = await request
        .put(`${url}/3`)
        .set('Authorization', adminAuthHeader)
        .send({
          voornaam: 'Jos',
          achternaam: 'Vermeers',
          email: 'jos.vermeers@gmail.com',
          straat: 'Haanhoutstraat',
          huisnummer: 52,
          postcode: '9080',
          plaats: 'Lochristi',
          land: 'België',
        });
      expect(response.status).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    it('should 400 when missing email', async () => {
      const response = await request
        .put(`${url}/3`)
        .set('Authorization', adminAuthHeader)
        .send({
          voornaam: 'Jos',
          achternaam: 'Vermeers',
          telefoonnummer: '0470346152',
          straat: 'Haanhoutstraat',
          huisnummer: 52,
          postcode: '9080',
          plaats: 'Lochristi',
          land: 'België',
        });
      expect(response.status).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    it('should 403 when not admin', async () => {
      const response = await request
        .put(`${url}/3`)
        .set('Authorization', authHeader)
        .send({
          voornaam: 'Jos',
          achternaam: 'Vermeers',
          email: 'joske@gmail.com',
          telefoonnummer: '0470346152',
          straat: 'Haanhoutstraat',
          huisnummer: 52,
          postcode: 9080,
          plaats: 'Lochristi',
          land: 'België',
        });
      expect(response.statusCode).toBe(403);
      expect(response.body.stack).toBeTruthy();
      expect(response.body.code).toEqual('FORBIDDEN');
      expect(response.body.message).toEqual(
        "You are not allowed to view this user's information"
      );
    });

    testAuthHeader(() => request.put(`${url}/1`));
  });

  describe('DELETE /api/users/:id', () => {
    beforeAll(async () => {
      await knex(tables.user).insert(data.users[0]);
    });

    it('should 204 and return nothing', async () => {
      const response = await request
        .delete(`${url}/3`)
        .set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should 400 with invalid user id', async () => {
      const response = await request
        .get(`${url}/invalid`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    it('should 404 with not existing user', async () => {
      const response = await request
        .delete(`${url}/123`)
        .set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body.code).toEqual('NOT_FOUND');
      expect(response.body.message).toEqual('No user with id 123 exists');
      expect(response.body.stack).toBeTruthy();
    });

    it('should 403 when not admin', async () => {
      const response = await request
        .delete(`${url}/3`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(403);
      expect(response.body.code).toEqual('FORBIDDEN');
      expect(response.body.message).toEqual(
        "You are not allowed to view this user's information"
      );
      expect(response.body.stack).toBeTruthy();
    });

    testAuthHeader(() => request.delete(`${url}/1`));
  });
});

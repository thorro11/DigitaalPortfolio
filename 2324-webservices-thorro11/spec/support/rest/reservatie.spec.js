const { tables } = require('../../../src/data');
const Role = require('../../../src/core/roles');
const { withServer, login, loginAdmin } = require('../supertest.setup');
const { testAuthHeader } = require('../common/auth');

const data = {
  reservaties: [
    {
      id: 1,
      begindatum: new Date('2024-07-11'),
      einddatum: new Date('2024-07-21'),
      datum: new Date('2023-10-14'),
      aantalPersonen: 6,
      status: 'onbetaald',
      user_id: 2,
      accommodatie_id: 1,
    },
    {
      id: 2,
      begindatum: new Date('2024-03-01'),
      einddatum: new Date('2024-03-06'),
      datum: new Date('2023-11-30'),
      aantalPersonen: 6,
      status: 'onbetaald',
      user_id: 4,
      accommodatie_id: 1,
    },
    {
      id: 3,
      begindatum: new Date('2024-12-11'),
      einddatum: new Date('2024-12-21'),
      datum: new Date('2023-12-17'),
      aantalPersonen: 6,
      status: 'betaald',
      user_id: 2,
      accommodatie_id: 1,
    },
  ],
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
  ],
  accommodaties: [
    {
      id: 1,
      prijsPerNacht: 60.0,
      aantalPersonen: 6,
      oppervlakte: '280 m2',
      straat: 'Boskuiter',
      huisnummer: 22,
      postcode: 9690,
      plaats: 'Kluisbergen',
      land: 'België',
    },
  ],
};

const dataToDelete = {
  reservaties: [1, 2, 3],
  users: [3, 4],
  accommodaties: [1],
};

describe('Reservaties', () => {
  let request, knex, authHeader, adminAuthHeader;

  withServer(({ supertest, knex: k }) => {
    request = supertest;
    knex = k;
  });

  beforeAll(async () => {
    authHeader = await login(request);
    adminAuthHeader = await loginAdmin(request);
  });

  const url = '/api/reservaties';

  describe('GET /api/reservaties', () => {
    beforeAll(async () => {
      await knex(tables.user).insert(data.users);
      await knex(tables.accommodatie).insert(data.accommodaties);
      await knex(tables.reservatie).insert(data.reservaties);
    });

    afterAll(async () => {
      await knex(tables.reservatie)
        .whereIn('id', dataToDelete.reservaties)
        .delete();

      await knex(tables.user).whereIn('id', dataToDelete.users).delete();

      await knex(tables.accommodatie)
        .whereIn('id', dataToDelete.accommodaties)
        .delete();
    });

    it('should 200 and return all resrvations', async () => {
      const response = await request.get(url).set('Authorization', authHeader);
      expect(response.status).toBe(200);
      expect(response.body.reservaties.length).toBe(2);
      expect(response.body.reservaties[0]).toEqual({
        id: 1,
        begindatum: new Date('2024-07-11').toJSON(),
        einddatum: new Date('2024-07-21').toJSON(),
        datum: new Date('2023-10-14').toJSON(),
        aantalPersonen: 6,
        status: 'onbetaald',
        user_id: 2,
        accommodatie_id: 1,
      });
    });

    it('should 400 when given an argument', async () => {
      const response = await request
        .get(`${url}?invalid=true`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    testAuthHeader(() => request.get(url));
  });

  describe('GET /api/reservaties/:id', () => {
    beforeAll(async () => {
      await knex(tables.user).insert(data.users);
      await knex(tables.accommodatie).insert(data.accommodaties);
      await knex(tables.reservatie).insert(data.reservaties);
    });

    afterAll(async () => {
      await knex(tables.reservatie)
        .whereIn('id', dataToDelete.reservaties)
        .delete();

      await knex(tables.user).whereIn('id', dataToDelete.users).delete();

      await knex(tables.accommodatie)
        .whereIn('id', dataToDelete.accommodaties)
        .delete();
    });

    it('should 200 and return the requested reservation', async () => {
      const response = await request
        .get(`${url}/1`)
        .set('Authorization', authHeader);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        begindatum: new Date('2024-07-11').toJSON(),
        einddatum: new Date('2024-07-21').toJSON(),
        datum: new Date('2023-10-14').toJSON(),
        aantalPersonen: 6,
        status: 'onbetaald',
        user_id: 2,
        accommodatie_id: 1,
      });
    });

    it('should 404 when requesting not existing reservation', async () => {
      const response = await request
        .get(`${url}/5`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body.code).toEqual('NOT_FOUND');
      expect(response.body.message).toEqual('No reservation with id 5 exists');
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid reservation id', async () => {
      const response = await request
        .get(`${url}/invalid`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    testAuthHeader(() => request.get(`${url}/1`));
  });

  describe('POST /api/reservaties', () => {
    const reservatiesToDelete = [];

    beforeAll(async () => {
      await knex(tables.accommodatie).insert(data.accommodaties);
      await knex(tables.user).insert(data.users);
      await knex(tables.reservatie).insert(data.reservaties[0]);
    });

    afterAll(async () => {
      await knex(tables.reservatie).where('id', 1).delete();
      await knex(tables.reservatie).whereIn('id', reservatiesToDelete).delete();
      await knex(tables.accommodatie)
        .whereIn('id', dataToDelete.accommodaties)
        .delete();
      await knex(tables.user).whereIn('id', dataToDelete.users).delete();
    });

    it('should 201 and return the created reservation', async () => {
      const response = await request
        .post('/api/reservaties')
        .set('Authorization', authHeader)
        .send({
          begindatum: new Date('2024-03-01'),
          einddatum: new Date('2024-03-06'),
          aantalPersonen: 6,
          accommodatie_id: 1,
        });
      reservatiesToDelete.push(response.body.id);
      expect(response.status).toBe(201);
      expect(response.body.aantalPersonen).toBe(6);
      expect(response.body.begindatum).toBe('2024-03-01T00:00:00.000Z');
      expect(response.body.einddatum).toBe('2024-03-06T00:00:00.000Z');
      expect(response.body.user_id).toBe(2);
      expect(response.body.accommodatie_id).toBe(1);
    });

    it('should 404 when accommodation does not exist', async () => {
      const response = await request
        .post('/api/reservaties')
        .set('Authorization', authHeader)
        .send({
          begindatum: new Date('2024-10-11'),
          einddatum: new Date('2024-10-21'),
          aantalPersonen: 6,
          accommodatie_id: 5,
        });

      expect(response.statusCode).toBe(404);
      expect(response.body.code).toEqual('NOT_FOUND');
      expect(response.body.message).toEqual(
        'No accommodation with id 5 exists'
      );
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 when missing begindatum', async () => {
      const response = await request
        .post('/api/reservaties')
        .set('Authorization', authHeader)
        .send({
          einddatum: new Date('2024-10-21'),
          aantalPersonen: 6,
          accommodatie_id: 5,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    it('should 400 when missing einddatum', async () => {
      const response = await request
        .post('/api/reservaties')
        .set('Authorization', authHeader)
        .send({
          begindatum: new Date('2024-10-21'),
          aantalPersonen: 6,
          accommodatie_id: 5,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    it('should 400 when missing aantal personen', async () => {
      const response = await request
        .post('/api/reservaties')
        .set('Authorization', authHeader)
        .send({
          begindatum: new Date('2024-10-11'),
          einddatum: new Date('2024-10-21'),
          accommodatie_id: 5,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    it('should 400 when missing accommodatie id', async () => {
      const response = await request
        .post('/api/reservaties')
        .set('Authorization', authHeader)
        .send({
          begindatum: new Date('2024-10-11'),
          einddatum: new Date('2024-10-21'),
          aantalPersonen: 6,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    it('should 400 when begindatum is already taken', async () => {
      const response = await request
        .post('/api/reservaties')
        .set('Authorization', authHeader)
        .send({
          begindatum: new Date('2024-07-11'),
          einddatum: new Date('2024-07-15'),
          aantalPersonen: 6,
          accommodatie_id: 1,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.message).toBe(
        'There is already a reservation on this datum'
      );
    });

    it('should 400 when einddatum is already taken', async () => {
      const response = await request
        .post('/api/reservaties')
        .set('Authorization', authHeader)
        .send({
          begindatum: new Date('2024-07-13'),
          einddatum: new Date('2024-07-21'),
          aantalPersonen: 6,
          accommodatie_id: 1,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.message).toBe(
        'There is already a reservation on this datum'
      );
    });

    it('should 400 when begindatum is in the past', async () => {
      const response = await request
        .post('/api/reservaties')
        .set('Authorization', authHeader)
        .send({
          begindatum: new Date('2023-07-13'),
          einddatum: new Date('2024-07-21'),
          aantalPersonen: 6,
          accommodatie_id: 1,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    it('should 400 when einddatum is in the past', async () => {
      const response = await request
        .post('/api/reservaties')
        .set('Authorization', authHeader)
        .send({
          begindatum: new Date('2024-07-13'),
          einddatum: new Date('2023-07-21'),
          aantalPersonen: 6,
          accommodatie_id: 1,
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    it('should 400 when begindatum is greater than einddatum', async () => {
      const response = await request
        .post('/api/reservaties')
        .set('Authorization', authHeader)
        .send({
          begindatum: new Date('2024-07-13'),
          einddatum: new Date('2023-07-09'),
          aantalPersonen: 6,
          accommodatie_id: 1,
        });
      expect(response.statusCode).toBe(400);
    });

    testAuthHeader(() => request.post(url));
  });

  describe('PUT /api/reservaties/:id', () => {
    beforeAll(async () => {
      await knex(tables.user).insert(data.users);
      await knex(tables.accommodatie).insert(data.accommodaties);
      await knex(tables.reservatie).insert(data.reservaties);
    });

    afterAll(async () => {
      await knex(tables.reservatie)
        .whereIn('id', dataToDelete.reservaties)
        .delete();
      await knex(tables.accommodatie)
        .whereIn('id', dataToDelete.accommodaties)
        .delete();
      await knex(tables.user).whereIn('id', dataToDelete.users).delete();
    });

    it('should 200 and return the updated reservation', async () => {
      const response = await request
        .put(`${url}/1`)
        .set('Authorization', authHeader)
        .send({
          begindatum: new Date('2024-07-11'),
          einddatum: new Date('2024-07-21'),
          aantalPersonen: 5,
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBeTruthy();
      expect(response.body.aantalPersonen).toBe(5);
    });

    it('should 404 when updating not existing reservation', async () => {
      const response = await request
        .put(`${url}/7`)
        .set('Authorization', authHeader)
        .send({
          begindatum: new Date('2024-07-11'),
          einddatum: new Date('2024-07-21'),
          aantalPersonen: 5,
        });

      expect(response.body.code).toEqual('NOT_FOUND');
      expect(response.body.message).toEqual('No reservation with id 7 exists');
      expect(response.statusCode).toBe(404);
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 when missing begindatum', async () => {
      const response = await request
        .put(`${url}/1`)
        .set('Authorization', authHeader)
        .send({
          einddatum: new Date('2024-10-21'),
          aantalPersonen: 6,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    it('should 400 when missing einddatum', async () => {
      const response = await request
        .put(`${url}/1`)
        .set('Authorization', authHeader)
        .send({
          begindatum: new Date('2024-10-21'),
          aantalPersonen: 6,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    it('should 400 when missing aantal personen', async () => {
      const response = await request
        .put(`${url}/1`)
        .set('Authorization', authHeader)
        .send({
          begindatum: new Date('2024-10-11'),
          einddatum: new Date('2024-10-21'),
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    it('should 400 with invalid reservation id', async () => {
      const response = await request
        .put(`${url}/invalid`)
        .set('Authorization', authHeader);
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    it('should 400 when begindatum is in the past', async () => {
      const response = await request
        .put(`${url}/1`)
        .set('Authorization', authHeader)
        .send({
          begindatum: new Date('2023-07-13'),
          einddatum: new Date('2024-07-21'),
          aantalPersonen: 6,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    it('should 400 when einddatum is in the past', async () => {
      const response = await request
        .put(`${url}/1`)
        .set('Authorization', authHeader)
        .send({
          begindatum: new Date('2024-07-13'),
          einddatum: new Date('2023-07-21'),
          aantalPersonen: 6,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    it('should 400 when begindatum is greater than einddatum', async () => {
      const response = await request
        .put(`${url}/1`)
        .set('Authorization', authHeader)
        .send({
          begindatum: new Date('2024-07-13'),
          einddatum: new Date('2023-07-09'),
          aantalPersonen: 6,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });
  });

  describe('DELETE /api/reservaties/:rId', () => {
    beforeAll(async () => {
      await knex(tables.user).insert(data.users);
      await knex(tables.accommodatie).insert(data.accommodaties);
      await knex(tables.reservatie).insert(data.reservaties);
    });

    afterAll(async () => {
      await knex(tables.reservatie)
        .whereIn('id', dataToDelete.reservaties)
        .delete();
      await knex(tables.accommodatie)
        .whereIn('id', dataToDelete.accommodaties)
        .delete();
      await knex(tables.user).whereIn('id', dataToDelete.users).delete();
    });

    it('should 204 and return nothing', async () => {
      const response = await request
        .delete(`${url}/1`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should 404 with not existing reservation', async () => {
      const response = await request
        .delete(`${url}/4`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body.code).toEqual('NOT_FOUND');
      expect(response.body.message).toEqual('No reservation with id 4 exists');
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid reservation id', async () => {
      const response = await request
        .delete(`${url}/invalid`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });
  });
});

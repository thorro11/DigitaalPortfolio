const { tables } = require('../../../src/data');
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
      status: 'betaald',
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
      user_id: 2,
      accommodatie_id: 1,
    },
    {
      id: 3,
      begindatum: new Date('2024-02-01'),
      einddatum: new Date('2024-02-06'),
      datum: new Date('2023-12-18'),
      aantalPersonen: 3,
      status: 'onbetaald',
      user_id: 2,
      accommodatie_id: 1,
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
  betalingen: [
    { id: 1, bedrag: 600.0, betaalmethode: 'paypal', reservatie_id: 1 },
  ],
};

const dataToDelete = {
  reservaties: [1, 2],
  accommodaties: [1],
  betalingen: [1],
};

describe('Betalingen', () => {
  let request, knex, authHeader, adminAuthHeader;

  withServer(({ supertest, knex: k }) => {
    request = supertest;
    knex = k;
  });

  beforeAll(async () => {
    authHeader = await login(request);
    adminAuthHeader = await loginAdmin(request);
  });

  const url = '/api/betalingen';

  describe('GET /api/betalingen', () => {
    beforeAll(async () => {
      await knex(tables.accommodatie).insert(data.accommodaties);
      await knex(tables.reservatie).insert(data.reservaties);
      await knex(tables.betaling).insert(data.betalingen);
    });

    afterAll(async () => {
      await knex(tables.reservatie)
        .whereIn('id', dataToDelete.reservaties)
        .delete();
      await knex(tables.accommodatie)
        .whereIn('id', dataToDelete.accommodaties)
        .delete();
      await knex(tables.betaling)
        .whereIn('id', dataToDelete.betalingen)
        .delete();
    });

    it('should 200 and return all payments', async () => {
      const response = await request.get(url).set('Authorization', authHeader);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          id: 1,
          betaalmethode: 'paypal',
          bedrag: '600.00',
          reservatie_id: 1,
        },
      ]);
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

  describe('POST /api/betalingen', () => {
    const betalingenToDelete = [];

    beforeAll(async () => {
      await knex(tables.accommodatie).insert(data.accommodaties);
      await knex(tables.reservatie).insert(data.reservaties);
      await knex(tables.betaling).insert(data.betalingen);
    });

    afterAll(async () => {
      await knex(tables.reservatie)
        .whereIn('id', dataToDelete.reservaties)
        .delete();
      await knex(tables.accommodatie)
        .whereIn('id', dataToDelete.accommodaties)
        .delete();
      await knex(tables.betaling).whereIn('id', betalingenToDelete).delete();
    });

    it('should 201 and return the created payment', async () => {
      const response = await request
        .post(url)
        .set('Authorization', authHeader)
        .send({
          bedrag: 300.0,
          betaalmethode: 'bancontact',
          reservatie_id: 2,
        });
      betalingenToDelete.push(response.body.id);
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        id: 2,
        bedrag: '300.00',
        betaalmethode: 'bancontact',
        reservatie_id: 2,
      });
    });

    it('should 404 when reservation does not exist', async () => {
      const response = await request
        .post(url)
        .set('Authorization', authHeader)
        .send({
          bedrag: 300.0,
          betaalmethode: 'bancontact',
          reservatie_id: 123,
        });

      expect(response.statusCode).toBe(404);
      expect(response.body.code).toEqual('NOT_FOUND');
      expect(response.body.message).toEqual(
        'There is no reservation with id 123.'
      );
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 when missing amount', async () => {
      const response = await request
        .post(url)
        .set('Authorization', authHeader)
        .send({
          betaalmethode: 'bancontact',
          reservatie_id: 2,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    it('should 400 when bedrag is not equal to price ', async () => {
      const response = await request
        .post(url)
        .set('Authorization', authHeader)
        .send({
          bedrag: 23,
          betaalmethode: 'bancontact',
          reservatie_id: 3,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.message).toBe(
        'Het ingegeven bedrag €23 is niet gelijk aan de prijs €300'
      );
    });

    it('should 400 when missing payment method', async () => {
      const response = await request
        .post(url)
        .set('Authorization', authHeader)
        .send({
          bedrag: 300.0,
          reservatie_id: 123,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    it('should 400 when missing reservationId', async () => {
      const response = await request
        .post(url)
        .set('Authorization', authHeader)
        .send({
          bedrag: 300.0,
          betaalmethode: 'bancontact',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    it('should 400 when reservation is already paid', async () => {
      const response = await request
        .post(url)
        .set('Authorization', authHeader)
        .send({
          bedrag: 300.0,
          betaalmethode: 'bancontact',
          reservatie_id: 1,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.message).toBe('This reservation was already paid');
    });
  });
});

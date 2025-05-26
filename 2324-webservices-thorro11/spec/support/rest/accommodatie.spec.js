const { tables } = require('../../../src/data');
const Role = require('../../../src/core/roles');
const { withServer, login, loginAdmin } = require('../supertest.setup');
const { testAuthHeader } = require('../common/auth');

const data = {
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
    {
      id: 2,
      prijsPerNacht: 10.0,
      aantalPersonen: 3,
      oppervlakte: '100 m2',
      straat: 'a',
      huisnummer: 22,
      postcode: 9690,
      plaats: 'b',
      land: 'België',
    },
  ],
  kamers: [
    {
      id: 1,
      aantalBedden: 2,
      oppervlakte: '12 m2',
      accommodatie_id: 1,
    },
    {
      id: 2,
      aantalBedden: 2,
      oppervlakte: '14 m2',
      accommodatie_id: 1,
    },
    {
      id: 3,
      aantalBedden: 2,
      oppervlakte: '15 m2',
      accommodatie_id: 1,
    },
    {
      id: 4,
      aantalBedden: 2,
      oppervlakte: '15 m2',
      accommodatie_id: 2,
    },
  ],
  badkamers: [
    {
      id: 1,
      douche: 1,
      bad: 1,
      toilet: 0,
      oppervlakte: '10 m2',
      accommodatie_id: 1,
    },
    {
      id: 2,
      douche: 1,
      bad: 0,
      toilet: 0,
      oppervlakte: '7 m2',
      accommodatie_id: 2,
    },
  ],
  accommodatieVoorzieningen: [
    {
      id: 1,
      accommodatie_id: 1,
      voorziening: 'WIFI',
    },
    { id: 2, accommodatie_id: 1, voorziening: 'Wasmachine' },
    { id: 3, accommodatie_id: 1, voorziening: 'Vaatwas' },
    { id: 4, accommodatie_id: 1, voorziening: 'Airco' },
    { id: 5, accommodatie_id: 1, voorziening: 'Droogkast' },
    {
      id: 6,
      accommodatie_id: 2,
      voorziening: 'WIFI',
    },
    { id: 7, accommodatie_id: 2, voorziening: 'Wasmachine' },
  ],
  voorzieningen: [
    {
      soort: 'WIFI',
    },
    {
      soort: 'Wasmachine',
    },
    {
      soort: 'Vaatwas',
    },
    {
      soort: 'Airco',
    },
    {
      soort: 'Droogkast',
    },
  ],
};

const dataToDelete = {
  accommodaties: [1, 2],
  kamers: [1, 2, 3, 4],
  badkamers: [1, 2],
  accommodatieVoorzieningen: [1, 2, 3, 4, 5, 6, 7],
};

describe('Accommodaties', () => {
  let request, knex, authHeader, adminAuthHeader;

  withServer(({ supertest, knex: k }) => {
    request = supertest;
    knex = k;
  });

  beforeAll(async () => {
    authHeader = await login(request);
    adminAuthHeader = await loginAdmin(request);
  });

  afterAll(async () => {});

  const url = '/api/accommodaties';

  describe('GET /api/accommodaties', () => {
    beforeAll(async () => {
      await knex(tables.voorziening).insert(data.voorzieningen);
      await knex(tables.accommodatie).insert(data.accommodaties);
      await knex(tables.kamer).insert(data.kamers);
      await knex(tables.badkamer).insert(data.badkamers);
      await knex(tables.accommodatieVoorziening).insert(
        data.accommodatieVoorzieningen
      );
    });

    afterAll(async () => {
      await knex(tables.accommodatie)
        .whereIn('id', dataToDelete.accommodaties)
        .delete();
      await knex(tables.kamer).whereIn('id', dataToDelete.kamers).delete();
      await knex(tables.badkamer)
        .whereIn('id', dataToDelete.badkamers)
        .delete();
      await knex(tables.accommodatieVoorziening)
        .whereIn('id', dataToDelete.accommodatieVoorzieningen)
        .delete();
      await knex(tables.voorziening).delete();
    });

    it('should 200 and return all accommodations', async () => {
      const response = await request.get(url);
      expect(response.status).toBe(200);
      expect(response.body.aantal).toBe(2);
      expect(response.body.accommodaties[1].id).toBe(2);
      expect(response.body.accommodaties[1].kamers).toEqual([
        { id: 4, aantalBedden: 2, oppervlakte: '15 m2' },
      ]);
      expect(response.body.accommodaties[1].badkamers).toEqual([
        { id: 2, douche: 1, bad: 0, toilet: 0, oppervlakte: '7 m2' },
      ]);
      expect(response.body.accommodaties[1].voorzieningen).toEqual([
        { id: 6, voorziening: 'WIFI' },
        { id: 7, voorziening: 'Wasmachine' },
      ]);
    });
  });

  describe('GET /api/accommodaties/:id', () => {
    beforeAll(async () => {
      await knex(tables.voorziening).insert(data.voorzieningen);
      await knex(tables.accommodatie).insert(data.accommodaties);
      await knex(tables.kamer).insert(data.kamers);
      await knex(tables.badkamer).insert(data.badkamers);
      await knex(tables.accommodatieVoorziening).insert(
        data.accommodatieVoorzieningen
      );
    });

    afterAll(async () => {
      await knex(tables.accommodatie)
        .whereIn('id', dataToDelete.accommodaties)
        .delete();
      await knex(tables.kamer).whereIn('id', dataToDelete.kamers).delete();
      await knex(tables.badkamer)
        .whereIn('id', dataToDelete.badkamers)
        .delete();
      await knex(tables.accommodatieVoorziening)
        .whereIn('id', dataToDelete.accommodatieVoorzieningen)
        .delete();
      await knex(tables.voorziening).delete();
    });

    it('should 200 and return the requested accommodation', async () => {
      const response = await request.get(`${url}/1`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        prijsPerNacht: '60.00',
        aantalPersonen: 6,
        oppervlakte: '280 m2',
        straat: 'Boskuiter',
        huisnummer: 22,
        postcode: 9690,
        plaats: 'Kluisbergen',
        land: 'België',
        kamers: [
          { id: 1, aantalBedden: 2, oppervlakte: '12 m2' },
          { id: 2, aantalBedden: 2, oppervlakte: '14 m2' },
          { id: 3, aantalBedden: 2, oppervlakte: '15 m2' },
        ],
        badkamers: [
          { id: 1, douche: 1, bad: 1, toilet: 0, oppervlakte: '10 m2' },
        ],
        voorzieningen: [
          { id: 1, voorziening: 'WIFI' },
          { id: 2, voorziening: 'Wasmachine' },
          { id: 3, voorziening: 'Vaatwas' },
          { id: 4, voorziening: 'Airco' },
          { id: 5, voorziening: 'Droogkast' },
        ],
      });
    });

    it('should 404 when requesting not existing accommodation', async () => {
      const response = await request.get(`${url}/8`);
      expect(response.statusCode).toBe(404);
      expect(response.body.code).toBe('NOT_FOUND');
      expect(response.body.message).toBe('No accommodation with id 8 exists');
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid accommodation', async () => {
      const response = await request.get(`${url}/invalid`);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });
  });

  describe('POST /api/accommodaties', () => {
    const accommodatiesToDelete = [];
    const kamersToDelete = [];
    const badkamersToDelete = [];
    const voorzieningenToDelete = [];
    beforeAll(async () => {
      await knex(tables.voorziening).insert(data.voorzieningen);
    });

    afterAll(async () => {
      await knex(tables.accommodatie)
        .whereIn('id', accommodatiesToDelete)
        .delete();
      await knex(tables.kamer).whereIn('id', kamersToDelete).delete();
      await knex(tables.badkamer).whereIn('id', badkamersToDelete).delete();
      await knex(tables.accommodatieVoorziening)
        .whereIn('id', voorzieningenToDelete)
        .delete();
      await knex(tables.voorziening).delete();
    });

    it('should 201 and return the created accommodation', async () => {
      const response = await request
        .post(url)
        .set('Authorization', adminAuthHeader)
        .send({
          prijsPerNacht: 10.0,
          aantalPersonen: 3,
          oppervlakte: '100 m2',
          straat: 'a',
          huisnummer: 22,
          postcode: 9690,
          plaats: 'b',
          land: 'België',
          kamers: [
            {
              aantalBedden: 2,
              oppervlakte: '12 m2',
            },
            {
              aantalBedden: 2,
              oppervlakte: '14 m2',
            },
          ],
          badkamers: [
            {
              douche: 1,
              bad: 1,
              toilet: 0,
              oppervlakte: '10 m2',
            },
          ],
          voorzieningen: [
            {
              soort: 'WIFI',
            },
            {
              soort: 'Wasmachine',
            },
          ],
        });
      accommodatiesToDelete.push(response.body.id);
      response.body.kamers.forEach(({ id }) => kamersToDelete.push(id));
      response.body.badkamers.forEach(({ id }) => badkamersToDelete.push(id));
      response.body.voorzieningen.forEach(({ id }) =>
        voorzieningenToDelete.push(id)
      );
      expect(response.body.aantalPersonen).toBe(3);
      expect(response.body.kamers).toEqual([
        { id: 1, aantalBedden: 2, oppervlakte: '12 m2' },
        { id: 2, aantalBedden: 2, oppervlakte: '14 m2' },
      ]);
      expect(response.body.badkamers).toEqual([
        { id: 1, douche: 1, bad: 1, toilet: 0, oppervlakte: '10 m2' },
      ]);
      expect(response.body.voorzieningen).toEqual([
        { id: 1, voorziening: 'WIFI' },
        { id: 2, voorziening: 'Wasmachine' },
      ]);
    });

    testAuthHeader(() => request.post(url));
  });

  describe('DELETE /api/accommodaties/:rId', () => {
    beforeAll(async () => {
      await knex(tables.voorziening).insert(data.voorzieningen);
      await knex(tables.accommodatie).insert(data.accommodaties);
      await knex(tables.kamer).insert(data.kamers);
      await knex(tables.badkamer).insert(data.badkamers);
      await knex(tables.accommodatieVoorziening).insert(
        data.accommodatieVoorzieningen
      );
    });

    afterAll(async () => {
      await knex(tables.accommodatie)
        .whereIn('id', dataToDelete.accommodaties)
        .delete();
      await knex(tables.kamer).whereIn('id', dataToDelete.kamers).delete();
      await knex(tables.badkamer)
        .whereIn('id', dataToDelete.badkamers)
        .delete();
      await knex(tables.accommodatieVoorziening)
        .whereIn('id', dataToDelete.accommodatieVoorzieningen)
        .delete();
      await knex(tables.voorziening).delete();
    });

    it('should 204 and return nothing', async () => {
      const response = await request
        .delete(`${url}/1`)
        .set('Authorization', adminAuthHeader);
      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should 404 with not existing accommodation', async () => {
      const response = await request
        .delete(`${url}/4`)
        .set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body.code).toEqual('NOT_FOUND');
      expect(response.body.message).toEqual(
        'No accommodation with id 4 exists'
      );
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid accommodation id', async () => {
      const response = await request
        .delete(`${url}/invalid`)
        .set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    testAuthHeader(() => request.delete(`${url}/1`));
  });
});

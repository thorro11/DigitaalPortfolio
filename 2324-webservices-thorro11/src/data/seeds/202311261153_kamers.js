const { tables } = require('..');

module.exports = {
  seed: async (knex) => {
    await knex(tables.kamer).delete(); // 👈 2

    await knex(tables.kamer).insert([
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
    ]);
  },
};

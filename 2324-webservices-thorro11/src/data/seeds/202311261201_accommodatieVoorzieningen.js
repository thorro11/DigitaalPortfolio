const { tables } = require('..');

module.exports = {
  seed: async (knex) => {
    await knex(tables.accommodatieVoorziening).delete(); // 👈 2

    await knex(tables.accommodatieVoorziening).insert([
      {
        id: 1,
        accommodatie_id: 1,
        voorziening: 'WIFI',
      },
      { id: 2, accommodatie_id: 1, voorziening: 'Wasmachine' },
      { id: 3, accommodatie_id: 1, voorziening: 'Vaatwas' },
      { id: 4, accommodatie_id: 1, voorziening: 'Airco' },
      { id: 5, accommodatie_id: 1, voorziening: 'Droogkast' },
    ]);
  },
};

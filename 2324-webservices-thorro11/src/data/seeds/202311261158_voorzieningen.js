const { tables } = require('..');

module.exports = {
  seed: async (knex) => {
    await knex(tables.voorziening).delete(); // 👈 2

    await knex(tables.voorziening).insert([
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
    ]);
  },
};

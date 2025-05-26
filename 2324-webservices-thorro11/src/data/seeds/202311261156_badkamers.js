const { tables } = require('..');

module.exports = {
  seed: async (knex) => {
    await knex(tables.badkamer).delete(); // 👈 2

    await knex(tables.badkamer).insert([
      {
        id: 1,
        douche: 1,
        bad: 1,
        toilet: 0,
        oppervlakte: '10 m2',
        accommodatie_id: 1,
      },
    ]);
  },
};

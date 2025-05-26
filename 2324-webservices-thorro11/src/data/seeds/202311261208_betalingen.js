const { tables } = require('..');

module.exports = {
  seed: async (knex) => {
    await knex(tables.betaling).delete(); // 👈 2

    await knex(tables.betaling).insert([
      { id: 1, bedrag: 600.0, betaalmethode: 'paypal',reservatie_id:1 },
    ]);
  },
};

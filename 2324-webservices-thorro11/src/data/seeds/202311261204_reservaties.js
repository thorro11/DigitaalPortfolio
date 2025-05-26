const { tables } = require('..');

module.exports = {
  seed: async (knex) => {
    await knex(tables.reservatie).delete(); // 👈 2

    await knex(tables.reservatie).insert([
      {
        id: 1,
        begindatum: new Date('2024-07-11'),
        einddatum: new Date('2024-07-21'),
        datum: new Date(),
        aantalPersonen: 6,
        status:'onbetaald',
        user_id: 1,
        accommodatie_id:1
      },
    ]);
  },
};

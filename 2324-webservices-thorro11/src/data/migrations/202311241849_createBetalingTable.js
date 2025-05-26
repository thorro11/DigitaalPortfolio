const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.betaling, (table) => {
      table.increments('id'); // 👈 1
      table.decimal('bedrag',10,2).notNullable();
      table.string('betaalmethode',255).notNullable();
      table.integer('reservatie_id').unsigned().notNullable();
      
      table
        .foreign('reservatie_id', 'fk_reservatie_betaling')
        .references('id')
        .inTable(tables.reservatie)
        .onDelete('CASCADE');
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.betaling);
  },
};

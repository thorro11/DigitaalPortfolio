const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.kamer, (table) => {
      table.increments('id'); // 👈 1
      table.integer('aantalBedden').notNullable();
      table.string('oppervlakte', 10).notNullable();
      table.integer('accommodatie_id').unsigned().notNullable();

      table
        .foreign('accommodatie_id', 'fk_accommodatie_kamer')
        .references('id')
        .inTable(tables.accommodatie)
        .onDelete('CASCADE');
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.kamer);
  },
};




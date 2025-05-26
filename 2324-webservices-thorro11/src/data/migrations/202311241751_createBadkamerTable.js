const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.badkamer, (table) => {
      table.increments('id'); // 👈 1
      table.integer('douche');
      table.integer('bad');
            table.integer('toilet');
      table.string('oppervlakte',10).notNullable();
      table.integer('accommodatie_id').unsigned().notNullable();
      
      table
        .foreign('accommodatie_id', 'fk_accommodatie_badkamer')
        .references('id')
        .inTable(tables.accommodatie)
        .onDelete('CASCADE');
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.badkamer);
  },
};

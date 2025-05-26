const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.reservatie, (table) => {
      table.increments('id'); // 👈 1
      table.dateTime('begindatum').notNullable();
      table.dateTime('einddatum').notNullable();
      table.dateTime('datum');
      table.integer('aantalPersonen').notNullable();
      table.string('status', 20).notNullable();
      table.integer('user_id').unsigned().notNullable();
      table.integer('accommodatie_id').unsigned().notNullable();

      table.unique('begindatum', 'idx_reservatie_begindatum_unique');
      table.unique('einddatum', 'idx_reservatie_einddatum_unique');

      table
        .foreign('user_id', 'fk_user_reservatie')
        .references('id')
        .inTable(tables.user)
        .onDelete('CASCADE');
      table
        .foreign('accommodatie_id', 'fk_accommodatie_reservatie')
        .references('id')
        .inTable(tables.accommodatie)
        .onDelete('CASCADE');
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.reservatie);
  },
};

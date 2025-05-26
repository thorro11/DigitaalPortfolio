const knex = require('knex'); // 👈 4
const { getLogger } = require('../core/logging'); // 👈 8
const { join } = require('path');

// 👇 1 - start config
const config = require('config');

const NODE_ENV = config.get('env');
const isDevelopment = NODE_ENV === 'development';

const DATABASE_CLIENT = config.get('database.client');
const DATABASE_NAME = config.get('database.name');
const DATABASE_HOST = config.get('database.host');
const DATABASE_PORT = config.get('database.port');
const DATABASE_USERNAME = config.get('database.username');
const DATABASE_PASSWORD = config.get('database.password');
// 👆 1 einde config

let knexInstance; // 👈 5

// 👇 2
async function initializeData() {
  const logger = getLogger(); // 👈 9
  logger.info('Initializing connection to the database'); // 👈 9

  const knexOptions = {
    client: DATABASE_CLIENT,
    connection: {
      host: DATABASE_HOST,
      port: DATABASE_PORT,
      //database: DATABASE_NAME,
      user: DATABASE_USERNAME,
      password: DATABASE_PASSWORD,
      insecureAuth: isDevelopment,
    },
    debug: isDevelopment,
    migrations: {
      tableName: 'knex_meta',
      directory: join('src', 'data', 'migrations'),
    },
    seeds: {
      directory: join('src', 'data', 'seeds'),
    },
  };
  knexInstance = knex(knexOptions); // 👈 7

  try {
    await knexInstance.raw('SELECT 1+1 AS result');
    await knexInstance.raw(`CREATE DATABASE IF NOT EXISTS ${DATABASE_NAME}`); // 👈 3
    await knexInstance.destroy(); // 👈 4

    knexOptions.connection.database = DATABASE_NAME; // 👈 5
    knexInstance = knex(knexOptions); // 👈 6
    await knexInstance.raw('SELECT 1+1 AS result'); // 👈 7
  } catch (error) {
    logger.error(error.message, { error });
    console.log(error);
    throw new Error('Could not initialize the data layer');
  }

  try {
    await knexInstance.migrate.latest();
  } catch (error) {
    logger.error('Error while migrating the database', {
      error,
    });

    // No point in starting the server when migrations failed
    throw new Error('Migrations failed, check the logs');
  }

  if (isDevelopment) {
    try {
      await knexInstance.seed.run();
    } catch (error) {
      logger.error('Error while seeding database', {
        error,
      });
    }
  }

  logger.info('Successfully initialized connection to the database'); // 👈 9

  return knexInstance; // 👈 7
}

// 👇 11
function getKnex() {
  if (!knexInstance)
    throw new Error(
      'Please initialize the data layer before getting the Knex instance'
    );
  return knexInstance;
}

// 👇 12
const tables = Object.freeze({
  reservatie: 'reservaties',
  user: 'users',
  accommodatie: 'accommodaties',
  kamer: 'kamers',
  badkamer: 'badkamers',
  voorziening: 'voorzieningen',
  accommodatieVoorziening: 'accommodatieVoorzieningen',
  betaling: 'betaling',
});

async function shutdownData() {
  const logger = getLogger();

  logger.info('Shutting down database connection');
  await knexInstance.destroy();
  knexInstance = null;

  logger.info('Database connection closed');
}

module.exports = {
  initializeData, // 👈 3
  getKnex, // 👈 11
  tables,
  shutdownData, // 👈 12
};

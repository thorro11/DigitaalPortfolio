const { shutdownData, getKnex, tables } = require('../../src/data');

module.exports = async () => {
  // Remove any leftover data
  await getKnex()(tables.betaling).delete();
  await getKnex()(tables.reservatie).delete();
  await getKnex()(tables.user).delete();
  await getKnex()(tables.accommodatie).delete();

  // Close database connection
  //await shutdownData();
};

const { errorMonitor } = require('koa');
const accommodatieRepository = require('../repository/accommodatie');
const { getLogger } = require('../core/logging');
const ServiceError = require('../core/serviceError');
const handleDBError = require('./_handleDBError');

const getAll = async () => {
  const accommodaties = await accommodatieRepository.findAll();
  return { accommodaties, aantal: accommodaties.length };
};

const getAccommodatie = async (id) => {
  const accommodatie = await accommodatieRepository.findById(id);
  return accommodatie;
};

const create = async ({
  prijsPerNacht,
  aantalPersonen,
  oppervlakte,
  straat,
  huisnummer,
  postcode,
  plaats,
  land,
  kamers,
  badkamers,
  voorzieningen,
}) => {
  const accommodaties = (await getAll()).accommodaties;
  let maxId;
  if (accommodaties.length === 0) {
    maxId = 0;
  } else {
    maxId = Math.max(...accommodaties.map(({ id }) => id));
  }

  const nieuweAccommodatie = {
    id: maxId + 1,
    prijsPerNacht,
    aantalPersonen,
    oppervlakte,
    straat,
    huisnummer,
    postcode,
    plaats,
    land,
  };

  const allKamers = await accommodatieRepository.getAllKamers();
  if (allKamers.length === 0) {
    maxId = 0;
  } else {
    maxId = Math.max(...allKamers.map(({ id }) => id));
  }
  const nieuweKamers = [];
  for (let index = 0; index < kamers.length; index++) {
    const nieuweKamer = {
      id: maxId + index + 1,
      aantalBedden: kamers[index].aantalBedden,
      oppervlakte: kamers[index].oppervlakte,
      accommodatie_id: nieuweAccommodatie.id,
    };
    nieuweKamers.push(nieuweKamer);
  }

  const allBadkamers = await accommodatieRepository.getAllBadkamers();
  if (allBadkamers.length === 0) {
    maxId = 0;
  } else {
    maxId = Math.max(...allBadkamers.map(({ id }) => id));
  }
  const nieuweBadkamers = [];
  for (let index = 0; index < badkamers.length; index++) {
    const nieuweBadkamer = {
      id: maxId + index + 1,
      douche: badkamers[index].douche,
      bad: badkamers[index].bad,
      toilet: badkamers[index].toilet,
      oppervlakte: badkamers[index].oppervlakte,
      accommodatie_id: nieuweAccommodatie.id,
    };
    nieuweBadkamers.push(nieuweBadkamer);
  }

  const allVoorzieningen =
    await accommodatieRepository.getAllAccommodatievoorzieningen();
  if (allVoorzieningen.length === 0) {
    maxId = 0;
  } else {
    maxId = Math.max(...allVoorzieningen.map(({ id }) => id));
  }
  const nieuweVoorzieningen = [];
  for (let index = 0; index < voorzieningen.length; index++) {
    const nieuweVoorziening = {
      id: maxId + index + 1,
      accommodatie_id: nieuweAccommodatie.id,
      voorziening: voorzieningen[index].soort,
    };
    nieuweVoorzieningen.push(nieuweVoorziening);
  }

  try {
    const id = await accommodatieRepository.create(
      nieuweAccommodatie,
      nieuweKamers,
      nieuweBadkamers,
      nieuweVoorzieningen
    );
    return await getAccommodatie(id);
  } catch (error) {
    throw handleDBError(error);
  }
};

const deleteById = async (id) => {
  const kamersToDelete = [];
  const badkamersToDelete = [];
  const voorzieningenToDelete = [];

  try {
    const accommodatie = await getAccommodatie(id);

    accommodatie.kamers.forEach(({ id }) => kamersToDelete.push(id));
    accommodatie.badkamers.forEach(({ id }) => badkamersToDelete.push(id));
    accommodatie.voorzieningen.forEach(({ id }) =>
      voorzieningenToDelete.push(id)
    );

    await accommodatieRepository.deleteById(
      id,
      kamersToDelete,
      badkamersToDelete,
      voorzieningenToDelete
    );
  } catch (error) {
    throw handleDBError(error);
  }
};

module.exports = {
  getAll,
  getAccommodatie,
  create,
  deleteById,
};

const { errorMonitor } = require('koa');
const betalingRepository = require('../repository/betaling');
const reservatieRepository = require('../repository/reservatie');
const accommodatieRepository = require('../repository/accommodatie');
const { getLogger } = require('../core/logging');
const { error } = require('winston');
const handleDBError = require('./_handleDBError');
const serviceError = require('../core/serviceError');

const getAll = async (userId) => {
  return await betalingRepository.findAll(userId);
};

const create = async ({ bedrag, betaalmethode, reservatie_id, user_id }) => {
  const reservatie = await reservatieRepository.findById(reservatie_id);
  const id = reservatie_id;
  if (!reservatie || reservatie.user_id !== user_id) {
    throw serviceError.notFound(`There is no reservation with id ${id}.`, {
      id,
    });
  }

  if (reservatie.status === 'betaald') {
    throw serviceError.validationFailed('This reservation was already paid');
  }

  const prijs = await berekenPrijs(reservatie);
  if (bedrag != prijs) {
    throw serviceError.validationFailed(
      `Het ingegeven bedrag €${bedrag} is niet gelijk aan de prijs €${prijs}`
    );
  }

  const betalingen = await betalingRepository.findAllAdmin();
  let maxId;
  if (betalingen.length === 0) {
    maxId = 0;
  } else {
    maxId = Math.max(betalingen.map(({ id }) => id));
  }
  const nieuweBetaling = {
    id: maxId + 1,
    bedrag,
    betaalmethode,
    reservatie_id,
  };
  try {
    const b = (await betalingRepository.create(nieuweBetaling))[0];
    return b;
  } catch (error) {
    throw handleDBError(error);
  }
};

const berekenPrijs = async (reservatie) => {
  const aantalOvernachtingen =
    (reservatie.einddatum - reservatie.begindatum) / (1000 * 60 * 60 * 24);
  const prijs =
    (await accommodatieRepository.findById(reservatie.accommodatie_id))
      .prijsPerNacht * aantalOvernachtingen;
  return prijs;
};

module.exports = {
  getAll,
  create,
};

const Router = require('@koa/router'); // 👈 1
const reservatieService = require('../service/reservatie');
const validate = require('../core/validation');
const Joi = require('joi');
const { requireAuthentication, makeRequireRole } = require('../core/auth');
const Role = require('../core/roles');

const getAllReservaties = async (ctx) => {
  const { userId } = ctx.state.session;
  ctx.body = await reservatieService.getAll(userId);
};

getAllReservaties.validationScheme = null;

const getReservatiePerId = async (ctx) => {
  const { userId } = ctx.state.session;
  ctx.body = await reservatieService.getReservatie(
    Number(ctx.params.id),
    userId
  );
};

getReservatiePerId.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};

const reserveer = async (ctx) => {
  const nieuweReservatie = await reservatieService.create({
    ...ctx.request.body,
    begindatum: new Date(ctx.request.body.begindatum),
    einddatum: new Date(ctx.request.body.einddatum),
    aantalPersonen: ctx.request.body.aantalPersonen,
    uId: ctx.state.session.userId,
    aId: Number(ctx.request.body.accommodatie_id),
  });
  ctx.status = 201;
  ctx.body = nieuweReservatie;
};

reserveer.validationScheme = {
  body: {
    begindatum: Joi.date().iso().min(new Date()),
    einddatum: Joi.date().iso().min(new Date()),
    aantalPersonen: Joi.number().integer().positive(),
    accommodatie_id: Joi.number().integer().positive(),
  },
};

const wijzigReservatie = async (ctx) => {
  const gewijzigdeReservatie = await reservatieService.wijzig({
    ...ctx.request.body,
    id: Number(ctx.params.id),
    begindatum: new Date(ctx.request.body.begindatum),
    einddatum: new Date(ctx.request.body.einddatum),
    aantalPersonen: Number(ctx.request.body.aantalPersonen),
    user_id: ctx.state.session.userId,
  });
  ctx.body = gewijzigdeReservatie;
};

wijzigReservatie.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
  body: {
    begindatum: Joi.date().iso().min(new Date()),
    einddatum: Joi.date().iso().min(new Date()),
    aantalPersonen: Joi.number().integer().positive(),
  },
};

const annuleerReservatie = async (ctx) => {
  await reservatieService.annuleer(
    Number(ctx.params.rId),
    ctx.state.session.userId
  );
  ctx.status = 204;
};

annuleerReservatie.validationScheme = {
  params: Joi.object({
    rId: Joi.number().integer().positive(),
  }),
};

module.exports = (app) => {
  const router = new Router({ prefix: '/reservaties' });

  router.use(requireAuthentication);

  router.get(
    '/',
    validate(getAllReservaties.validationScheme),
    getAllReservaties
  );
  router.get(
    '/:id',
    validate(getReservatiePerId.validationScheme),
    getReservatiePerId
  );
  router.post('/', validate(reserveer.validationScheme), reserveer);
  router.put(
    '/:id',
    validate(wijzigReservatie.validationScheme),
    wijzigReservatie
  );
  router.delete(
    '/:rId',
    validate(annuleerReservatie.validationScheme),
    annuleerReservatie
  );

  app.use(router.routes()).use(router.allowedMethods());
};

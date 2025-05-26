const Router = require('@koa/router'); // 👈 1
const betalingService = require('../service/betaling');
const Joi = require('joi');
const validate = require('../core/validation');
const { requireAuthentication, makeRequireRole } = require('../core/auth');
const Role = require('../core/roles');

const getAllBetalingen = async (ctx) => {
    const { userId } = ctx.state.session;
    ctx.body = await betalingService.getAll(userId);
};

getAllBetalingen.validationScheme = null;

const betaal = async (ctx) => {
  const betaling = await betalingService.create({
    ...ctx.request.body,
    bedrag: ctx.request.body.bedrag,
    betaalmethode: ctx.request.body.betaalmethode,
    reservatie_id: ctx.request.body.reservatie_id,
    user_id: ctx.state.session.userId
  });
  ctx.status = 201;
  ctx.body = betaling;
};

betaal.validationScheme = {
  body: {
    bedrag: Joi.number(),
    betaalmethode: Joi.string(),
    reservatie_id: Joi.number().integer().positive(),
  },
};

module.exports = (app) => {
  const router = new Router({ prefix: '/betalingen' });

  router.use(requireAuthentication);

  router.get(
    '/',
    validate(getAllBetalingen.validationScheme),
    getAllBetalingen
  );
  router.post('/', validate(betaal.validationScheme), betaal);

  app.use(router.routes()).use(router.allowedMethods());
};

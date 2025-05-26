const Router = require('@koa/router');
const installReservatieRouter = require('../rest/reservatie');
const installBetalingRouter = require('../rest/betaling');
const installUserRouter = require('../rest/user');
const installHealthRouter = require('../rest/health');
const installAccommodatieRouter = require('../rest/accommodatie')

module.exports = (app) => {
  const router = new Router({
    prefix: '/api',
  });

  installReservatieRouter(router);
  installBetalingRouter(router);
  installUserRouter(router);
  installHealthRouter(router);
  installAccommodatieRouter(router);

  app.use(router.routes()).use(router.allowedMethods());
};

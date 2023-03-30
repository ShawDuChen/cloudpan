'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/user/list', controller.user.index);
  router.get('/user/read/:id', controller.user.read);
  router.post('/user/create', controller.user.create);
  router.post('/user/update/:id', controller.user.update);
  router.delete('/user/destroy/:id', controller.user.destroy);
  router.post('/user/reg', controller.user.reg);
  router.post('/login', controller.user.login);
  router.post('/logout', controller.user.logout);
};

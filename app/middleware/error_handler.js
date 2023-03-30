'use strict';

/**
 * @param {Object} options - egg options
 * @param {Egg.Application} app - egg application
 */
module.exports = (options, app) => {
  console.log(options, app);
  return async function errorHandler(ctx, next) {
    try {
      await next();
      if (ctx.status === 404 && !ctx.body) {
        ctx.body = { msg: 'fail', code: ctx.status, data: '404 not found!' };
      }
    } catch (err) {
      ctx.app.emit('error', err, ctx); // 输出日志异常（common-error.log）
      const status = err.status || 500;
      const error = status === 500 && ctx.app.config.env === 'prod' ? 'Internal Server Error' : err.message;
      ctx.body = { error, code: status };
      if (status === 422) {
        ctx.body.detail = err.errors;
      }
      ctx.status = status;
    }
  };
};

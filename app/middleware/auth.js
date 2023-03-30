'use strict';

/**
 * @param {Object} options - egg options
 * @param {Egg.Application} app - egg application
 */
module.exports = (options, app) => {
  console.log(options, app);
  return async function auth(ctx, next) {
    const { token } = ctx.header;

    if (!token) {
      ctx.throw(400, '没有登陆访问权限');
    }

    let user = {};

    // token解密，换取用户数据
    try {
      user = app.jwt.verify(token, app.config.jwt.secret);
      // user = app.getToken(token);
    } catch (error) {
      const fail = error.name === 'TokenExpiredError' ? 'token已过期' : 'token令牌不合法';
      ctx.throw(400, fail);
    }

    // 判断当前用户是否登录
    const t = await ctx.service.cache.get('user_' + user.id);
    if (!t || t !== token) {
      ctx.throw(400, 'token 令牌不合法！');
    }

    // 获取当前用户，判断用户是否存在
    user = await app.model.User.findByPk(user.id);
    if (!user) {
      ctx.throw(400, '当前用户不存在');
    }
    // 挂载user信息到全局中
    ctx.authUser = user;

    await next();
  };
};

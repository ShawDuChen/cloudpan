'use strict';

const { Controller } = require('egg');
const crypto = require('crypto');

class UserController extends Controller {
  // 获取用户列表
  async index() {

    // this.ctx.throw(500); // 强制抛出异常

    // 模拟数据库获取
    const { page, page_size } = this.ctx.query;
    // const { Op } = this.app.Sequelize;
    const result = await this.app.model.User.findAll({
      // where: {
      //   sex: '男',
      //   username: {
      //     [Op.like]: '%11%',
      //   },
      // },
      limit: parseInt(page_size || 10),
      offset: 10 * (page - 1),
      // attributes: [ 'id', 'username', 'sex' ],
      attributes: {
        exclude: [ 'password' ],
      },
      order: [
        // [ 'id', 'DESC' ],
        // [ 'updated_at', 'DESC' ],
      ],
    });

    // const { ctx } = this;
    // ctx.body = {
    //   msg: 'ok',
    //   data: result,
    // };
    this.ctx.apiSuccess(result);
  }

  // 读取用户数据
  async read() {
    const id = parseInt(this.ctx.params.id);
    console.log(id);
    // const result = await this.app.model.User.findByPk(id);

    // findOne
    const result = await this.app.model.User.findOne({
      where: {
        id,
        sex: '女',
      },
    });

    // this.ctx.body = {
    //   code: 0,
    //   msg: 'ok',
    //   data: result,
    // };
    this.ctx.apiSuccess(result);
  }

  // 创建用户数据
  async create() {
    // 单个新增
    const body = this.ctx.request.body;
    // 新增参数验证
    this.ctx.validate({
      username: { type: 'string', required: true, desc: '用户名称' },
      password: { type: 'string', required: true, desc: '用户密码' },
      sex: { type: 'string', required: false, defValue: '男', desc: '性别' },
      avatar_url: { type: 'string', required: false, defValue: '', desc: '用户头像url' },
    });
    const res = await this.app.model.User.create(body);

    // 批量新增 blukCreate
    // const res = await this.app.model.User.bulkCreate([
    //   { username: '1115', password: '11', sex: '男' },
    //   { username: '2116', password: '22', sex: '女' },
    //   { username: '3115', password: '33', sex: '女' },
    //   { username: '1221', password: '111', sex: '男' },
    //   { username: '2222', password: '222', sex: '女' },
    //   { username: '3333', password: '333', sex: '男' },
    // ]);

    this.ctx.body = {
      code: 0, msg: 'ok', data: res,
    };
  }

  async update() {
    const id = parseInt(this.ctx.params.id || 0);
    const data = await this.app.model.User.findByPk(id);
    console.log(id);
    if (!data) {
      this.ctx.body = {
        code: -1, msg: 'data unexist',
      };
      return;
    }

    const { body } = this.ctx.request;
    data.username = body.username;
    data.sex = body.sex;

    // data = { ...data, ...body };

    // await data.save({
    //   fields: [ 'username' ],
    // });

    const res = await data.update(body, {
      fields: [ 'username', 'sex' ],
    });

    this.ctx.body = {
      code: 0,
      msg: 'ok',
      data: res,
    };
  }

  async destroy() {
    const id = parseInt(this.ctx.params.id || 0);
    // const data = await this.app.model.User.destroy({
    //   where: { id },
    // });
    const data = await this.app.model.User.findByPk(id);
    if (!data) {
      this.ctx.body = {
        code: -1, msg: 'data unexist',
      };
      return;
    }
    const res = await data.destroy();
    this.ctx.body = {
      code: 0,
      msg: 'ok',
      data: res,
    };
  }

  async reg() {
    const { ctx, app } = this;
    const body = ctx.request.body;
    const { username, password, repassword } = body;
    ctx.validate({
      username: { type: 'string', required: true, desc: '用户名称', range: { min: 6, max: 20 } },
      password: { type: 'string', required: true, desc: '密码', range: { min: 6, max: 20 } },
      repassword: { type: 'string', required: true, desc: '确认密码' },
    });
    const find = await app.model.User.findOne({
      where: { username },
    });
    if (find) {
      return ctx.throw(400, '用户名已存在');
    }
    if (password !== repassword) {
      return ctx.throw(400, '两次输入密码不一致');
    }
    let user = await app.model.User.create({
      username, password,
    });
    if (!user) {
      return ctx.throw(400, '注册失败');
    }

    user = JSON.parse(JSON.stringify(user));
    delete user.password;
    ctx.apiSuccess(user);
  }

  async login() {
    const { ctx, app } = this;

    ctx.validate({
      username: { type: 'string', required: true, desc: '用户名' },
      password: { type: 'string', required: true, desc: '密码' },
    });

    const { username, password } = ctx.request.body;

    let user = await app.model.User.findOne({ where: { username } });
    if (!user) {
      return ctx.throw(400, '用户不存在');
    }
    await this.validPassword(password, user.password);
    // 生产token
    user = JSON.parse(JSON.stringify(user));
    const token = app.getToken(user);
    user.token = token;
    delete user.password;

    // 加入redis中
    if (!await this.service.cache.set('user_' + user.id, token)) {
      ctx.throw(400, '登录失败');
    }
    return ctx.apiSuccess(user);
  }

  async validPassword(password, hash_password) {
    const hash = crypto.createHash('sha256', this.app.config.crypto.secret);
    hash.update(password);
    const secret_password = hash.digest('hex');
    if (secret_password !== hash_password) {
      return this.ctx.throw(400, '密码错误');
    }
    return true;
  }

  async logout() {
    const { ctx } = this;
    const id = ctx.authUser.id;
    if (!await this.service.cache.remove('user_' + id)) {
      ctx.throw(400, '退出登录失败');
    }
    ctx.apiSuccess('退出登录成功');
  }
}

module.exports = UserController;

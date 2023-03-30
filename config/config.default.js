/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1679880246086_3483';

  // add your middleware config here
  config.middleware = [
    'errorHandler', 'auth',
  ];

  config.auth = {
    enable: true,
    match: [
      '/logout',
      '/video',
      '/video_detail',
      '/vod/sign',
      '/comment',
      '/fava',
      '/user/follow',
      '/user/unfollow',
      '/user/follows',
      '/user/fens',
      '/user/statistics',
    ],
  };

  config.errorHandler = {
    enable: true, // 是否开启中间件
    // match: [ '/user/list' ], // 匹配到的走中间件
    ignore: [], // 忽略走中间件
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  // security
  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList: [],
  };

  // 配置跨域
  config.cors = {
    origin: '*',
    allowMethods: 'GET, PUT, POST, DELETE, PATCH',
  };

  // post请求解析
  config.bodyParser = {
    enable: true,
    jsonLimit: '4mb',
  };

  // 数据库连接配置
  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    username: 'root',
    password: '15023660918',
    port: 3306,
    database: 'eggapi',
    timezone: '+08:00',
    define: {
      freezeTableName: true,
      timestamps: true,
      paranoid: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      underscored: true,
    },
  };

  config.valparams = {
    locale: 'zh-cn',
    throwError: true,
  };

  config.crypto = {
    secret: 'qhdgw@54ncashdaksh2@+!@#3nxjdas*_672',
  };

  config.jwt = {
    secret: 'qhdgw@54ncashdaksh2@+!@#3nxjdas*_672',
  };

  config.redis = {
    client: {
      host: '127.0.0.1',
      port: 6379,
      password: '',
      db: 1,
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};

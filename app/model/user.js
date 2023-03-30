'use strict';
const crypto = require('crypto');
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { STRING, INTEGER, DATE, ENUM } = app.Sequelize;

  const User = app.model.define(
    'user',
    {
      id: { type: INTEGER(20).UNSIGNED, primaryKey: true, autoIncrement: true },
      username: {
        type: STRING(30),
        allowNull: false,
        defaultValue: '',
        comment: '用户名称',
        unique: true,
      },
      password: {
        type: STRING(200), allowNull: false, defaultValue: '',
        comment: '密码',
        set(value) {
          const hash = crypto.createHash('sha256', app.config.crypto.secret);
          hash.update(value);
          this.setDataValue('password', hash.digest('hex'));
        },
      },
      avatar_url: { type: STRING(200), allowNull: true, defaultValue: '' },
      sex: {
        type: ENUM,
        values: [ '男', '女', '保密' ],
        allowNull: true,
        defaultValue: '男',
        comment: '用户性别',
      },
      created_at: DATE,
      updated_at: DATE,
    },
    {
      timestamps: false,
      tableName: 'user',
    }
  );

  return User;
};

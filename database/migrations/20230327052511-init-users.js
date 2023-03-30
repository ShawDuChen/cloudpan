'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数，创建 users 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING, ENUM } = Sequelize;
    await queryInterface.createTable('user', {
      id: { type: INTEGER(20).UNSIGNED, primaryKey: true, autoIncrement: true },
      username: { type: STRING(30), allowNull: false, defaultValue: '', comment: '用户名称', unique: true },
      password: { type: STRING(200), allowNull: false, defaultValue: '' },
      avatar_url: { type: STRING(200), allowNull: true, defaultValue: '' },
      sex: { type: ENUM, values: [ '男', '女', '保密' ], allowNull: true, defaultValue: '男', comment: '用户性别' },
      created_at: DATE,
      updated_at: DATE,
    });
  },
  // 在执行数据库降级时调用的函数，删除 users 表
  down: async queryInterface => {
    await queryInterface.dropTable('user');
  },
};

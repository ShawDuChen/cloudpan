# cloud-pan



## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org

# 关于项目的配置

1. controller：控制器
    1. 按功能划分即可
    2. 满足restful-api结构的controller具备的方法需要记住
        1. index - get all
        2. show - get one
        3. new - /api/new get create
        4. edit - get modify one
        5. create - post one
        6. update - put one
        7. destroy - delete one

2. extend：扩展功能
    1. context.js
        ```js
        module.exports = {
          apiSuccess(data = '', msg = 'ok', code = 200) {
            this.body = { msg, data, code };
            this.status = code;
          },
          apiFail(data = '', msg = 'fail', code = 400) {
            this.body = { msg, data, code };
            this.status = code;
          }
        }
        // 实际中使用
        this.ctx.apiSuccess()
        this.ctx.apiFail()
        ```

3. middleware：中间件
    1. 可以配置多个中间件，中间件文件返回一个函数，函数内部返回一个命名函数用户config.xxx.js进行配置
        ```js
        module.export = () => {
          return async function middlewareName(ctx, next) {

          }
        }
        ```
    2. 在config.xxx.js中进行如下配置
        ```js
        config.middleware = ['middlewareName']
        config.middlewareName = {}
        ```

4. model：数据库模型数据
    1. 使用sequelize和mysql2进行管理，安装插件：egg-sequelize mysql2
    2. 在plugins和config.xxx.js中进行sequelize相关配置
        ```js
        // plugin.js
        const sequelize = {
          enable: true,
          package: 'egg-sequelize'
        }
        // config.xx.js
        config.sequelize = {
          dialect: 'mysql',
          host: '127.0.0.1',
          username: 'root', // 数据库用户名
          password: 'xxxx', // 数据库密码
          port: 3306,
          database: 'eggapi', // 连接的数据库
          timezone: '+08:00', // 时区
          define: { // 自定义的相关配置
            freezeTableName: true,
            timestamps: true,
            paranoid: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
            underscored: true,
          },
        };
        ```
    3. 使用sequelize-cli进行model数据创建：yarn add -D sequelize-cli，根目录新增.sequelizerc文件，并写入如下配置
        ```js
        'use strict';
        const path = require('path');
        module.exports = {
          config: path.join(__dirname, 'database/config.json'),
          'migrations-path': path.join(__dirname, 'database/migrations'),
          'seeders-path': path.join(__dirname, 'database/seeders'),
          'models-path': path.join(__dirname, 'app/model'),
        };
        ```
    4. 执行sequelize相关指令
        1. npx sequelize init:config
        2. npx sequelize init:migrations
        3. 根据实际情况修改/database/config.json中的数据库配置信息
    5. 使用migration创建数据库表，操作如下
        1. 执行命令 npx sequelize migration:generate --name=init-tableName
        2. 在/database/migrations下会生产对应的文件，根据使用情况修改初始化表功能，可参考如下配置
            ```js
            'use strict';
            module.exports = {
              // 在执行数据库升级时调用的函数，创建 users 表
              up: async (queryInterface, Sequelize) => {
                const { INTEGER, DATE, STRING } = Sequelize;
                await queryInterface.createTable('users', {
                  id: { type: INTEGER, primaryKey: true, autoIncrement: true },
                  name: STRING(30),
                  age: INTEGER,
                  created_at: DATE,
                  updated_at: DATE,
                });
              },
              // 在执行数据库降级时调用的函数，删除 users 表
              down: async (queryInterface) => {
                await queryInterface.dropTable('users');
              },
            };
            ```

5. router：路由
    1. 当router.js的内部路由太多时，可以通过创建router目录分文件管理路由表
    2. 例如创建/router/user.js，写入如下代码
        ```js
        'use strict';
        /**
        * @param {Egg.Application} app - egg application
        */
        module.exports = app => {
          const { router, controller } = app;
          router.get('/user/list', controller.user.index);
        };

        ```
    3. 然后在router.js中增加如下代码
        ```js
        require('./router/user')(app)
        ```

6. 如何解决CSRF和CORS问题
    1. CSRF
        1. 在config.xxx.js中配置
            ```js
            config.security = {
              csrf: {
                enable: false,
              },
              domainWhiteList: [],
            };
            ```
    2. CORS
        1. 安装egg-cors
        2. 在plugins中配置
            ```js
            const cors = {
              enable: true,
              package: 'egg-cors'
            }
            ```
        3. 在config.xxx.js中配置
            ```js
            // 配置跨域
            config.cors = {
              origin: '*',
              allowMethods: 'GET, PUT, POST, DELETE, PATCH',
            };
            ```
7. 增加参数验证功能
    1. 安装egg-valparams插件
    2. 在plugin.js中配置如下代码
        ```js
        const valparams = {
          enable: true,
          package: 'egg-valparams'
        }
        ```
    3. 在congfig.xxx.js配置如下代码
        ```js
        config.valparams = {
          locale: 'zh-cn',
          throwError: true,
        };
        ```
8. 增加数据加密功能
    1. 安装crypto: yarn add crypto
    2. 在config.xxx.js中增加配置
        ```js
        config.crypto = {
          secret: 'qhdgw@54ncashdaksh2@+!@#3nxjdas*_672'
        }
        ```

9. jwt登录鉴权
    1. 安装egg-jwt：yarn add egg-jwt
    2. 在plugin.js中增加配置
        ```js
        const jwt = {
          enable: true,
          package: 'egg-jwt'
        }
        ```
    3. 在config.xxx.js中增加配置
        ```js
        config.jwt = {
          secret: 'qhdgw@54ncashdaksh2@+!@#3nxjdas*_672'
        }
        ```

10. 使用redis缓存
    1. 安装egg-redis: yarn add egg-redis
    2. 在plugin.js中增加配置
        ```js
        const redis = {
          enable: true,
          package: 'egg-redis'
        }
        ```
    3. 在config.xxx.js中增加配置
        ```js
        config.redis = {
          client: {
            port: 6379,
            host: '127.0.0.1',
            password: '',
            db: 2
          }
        }
        ```

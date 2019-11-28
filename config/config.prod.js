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
  config.keys = appInfo.name + '_1564309783445_509512';

  // add your middleware config here
  config.middleware = [ 'errorHandler' ];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  // 环境配置
  config.envConfig = {
    uploadPath: 'app/public/upload/',
    uploadUrl: 'http://local.api.benlaigor.com:7001/public/upload/'
  }

  // body解析
  // config.bodyParser = {
  //   jsonLimit: '1mb',
  //   formLimit: '1mb',
  // };

  // 跨域白名单
  config.security = {
    csrf: {
      enable: false,
      ignore: '/client/report/**',
    },
    domainWhiteList: ['http://local.admin.benlaigor.com:8081', 'http://local.benlaigor.com:8082'],  // 安全白名单，以 . 开头
  };

  // 文件上传
  config.multipart = {
    fileSize: '100mb', // default 10M
  }

  // 数据库
  config.sequelize = {
    dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
    database: 'happy-life-dev',
    host: '120.24.55.201',
    port: '3306',
    username: 'root',
    password: '',
    timezone: '+08:00', // 东八时区
  };

  // redis
  config.redis = {
    client: {
      port: 6379, // Redis port
      host: '172.16.157.127', // Redis host
      password: '',
      db: 0,
    },
    agent: true,
  };

  // session redis
  config.sessionRedis = {
    key: 'happy-perfor-dev',
    maxAge: 24 * 3600 * 1000,
    httpOnly: true,
    encrypt: true,
  };

  // 阿里云oss
  // config.oss = {
  //   client: {
  //     accessKeyId: '',
  //     accessKeySecret: '',
  //     bucket: '',
  //     endpoint: 'oss-cn-beijing.aliyuncs.com',
  //     timeout: '60s',
  //   },
  // };

  return {
    ...config,
    ...userConfig,
  };
};

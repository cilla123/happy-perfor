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

  // 上报原始数据使用redis存储、kafka储存、还是使用mongodb存储
  config.report_data_type = 'redis'; // redis kafka mongodb

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
    domainWhiteList: [],  // 安全白名单，以 . 开头
  };

  // 文件上传
  config.multipart = {
    fileSize: '100mb', // default 10M
  }

  // 数据库
  config.sequelize = {
    dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
    database: 'happy-performance-dev',
    host: '172.16.157.127',
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
      password: 'qq123456*&?',
      db: 0,
    },
    agent: true,
  };

  // session redis
  config.sessionRedis = {
    key: 'happy-performance-dev',
    maxAge: 24 * 3600 * 1000,
    httpOnly: true,
    encrypt: true,
  };

  // mongodb 服务
  const dbclients = {
    db3: {
      // 单机部署
      url: 'mongodb://172.16.157.127:27017/happy-performance',
      // 副本集 读写分离
      // url: 'mongodb://127.0.0.1:28100,127.0.0.1:28101,127.0.0.1:28102/performance?replicaSet=rs1',
      // 集群分片
      // url: 'mongodb://127.0.0.1:30000/performance',
      options: {
        autoReconnect: true,
        poolSize: 20,
      },
    },
  };
  if (config.report_data_type === 'mongodb') {
    dbclients.db1 = {
      url: 'mongodb://172.16.157.127:27018/happy-performance',
      options: {
          poolSize: 20,
      },
    };
  }

  // mongoose 配置
  config.mongoose = {
    clients: dbclients,
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

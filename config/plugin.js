'use strict';

exports.sequelize = {
  enable: false,
  package: 'egg-sequelize',
};

exports.redis = {
  enable: true,
  package: 'egg-redis',
};

exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
};

exports.sessionRedis = {
  enable: false,
  package: 'egg-session-redis',
};

// exports.oss = {
//   enable: true,
//   package: 'egg-oss',
// };

exports.validate = {
  enable: true,
  package: 'egg-validate',
};

exports.cors = {
  enable: true,
  package: 'egg-cors',
};
const md5 = require('md5');
const { SALT } = require('../../constants/baseConfig');

module.exports = {

  /**
   * md5加密
   */
  md5Encrypt: (str) => {
    str = str + "";
    return md5(str + SALT);
  },

}
const jwt = require('jsonwebtoken');
const { SALT } = require('../../constants/baseConfig');

module.exports = {

  /**
   * 获取jwt解密厚的结果
   */
  getJwtDecodedResult: (authToken) => {
    const result = jwt.verify(authToken, SALT);
    return result;
  },

  /**
   * jwt签名
   */
  signJwt: (params) => {
    return jwt.sign(params, SALT);
  }

}
const { SUCCESS, ERROR } = require('../../constants/responseCode');

/**
 * 响应码
 */
class ServerResponse {

  constructor(status, msg, data) {
    this.code = status;
    this.msg = msg;
    this.data = data;
  }

  isSuccess() {
    return this.code === SUCCESS;
  }

  getCode() {
    return this.code;
  }

  getData() {
    return this.data;
  }

  getMsg() {
    return this.msg;
  }
  
  static createBySuccess() {
    return new ServerResponse(SUCCESS);
  }

  static createBySuccessMsg(msg) {
    return new ServerResponse(SUCCESS, msg, null);
  }

  static createBySuccessData(data) {
    return new ServerResponse(SUCCESS, null, data);
  }

  static createBySuccessMsgAndData(msg, data) {
    return new ServerResponse(SUCCESS, msg, data);
  }

  static createByError() {
    return new ServerResponse(ERROR, 'error', null);
  }

  static createByErrorMsg(errorMsg) {
    return new ServerResponse(ERROR, errorMsg, null);
  }

  static createByErrorCodeMsg(errorCode, errorMsg) {
    return new ServerResponse(errorCode, errorMsg, null);
  }
};

module.exports = ServerResponse
const { PARAMS_ERROR, HTTP_ERROR, NOT_FOUND} = require('../common/constants/responseCode');

module.exports = () => {
  return async function errorHandler(ctx, next) {
    try {
      await next();
    } catch (err) {
      const ServerResponse = ctx.response.ServerResponse;

      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      ctx.app.emit('error', err, ctx);
      const status = err.status || 500;

      if (status === HTTP_ERROR) {
        ctx.body = ServerResponse.createByErrorMsg('系统繁忙');        
      }

      if (status === NOT_FOUND) {
        ctx.body = ServerResponse.createByErrorMsg('无效的接口');        
      }

      if (status === PARAMS_ERROR) {
        ctx.body = ServerResponse.createByErrorMsg('参数错误');
      }
      ctx.status = status;
    }
  };
};
const { NEED_LOGIN, ERROR } = require('../common/constants/responseCode');
const { BE_USER_TOKEN } = require('../common/constants/redisType');
const { getJwtDecodedResult } = require('../common/utils/encrypt/jwt');

module.exports = (options) => {
  return async function checkLogin(ctx, next) {
    const authToken = ctx.request.header['x-token-auth'];
    const ServerResponse = ctx.response.ServerResponse;

    try {
      const result = getJwtDecodedResult(authToken);
      if (!result) {
        ctx.body = ServerResponse.createByErrorCodeMsg(ERROR, '未找到用户');        
      }
      if (options.checkAdmin) {
        if (authToken) {
          const user = await ctx.app.redis.get(BE_USER_TOKEN + result.id);
          if (user) {
            await next();          
          } else {
            ctx.body = ServerResponse.createByErrorCodeMsg(NEED_LOGIN, '用户未登录');   
          }
        } else {
          ctx.body = ServerResponse.createByErrorCodeMsg(NEED_LOGIN, '用户未登录');   
        }
      } else if (options.checkBlog) {
        await next();
      } else {
        await next();
      }
    } catch (error) {
      ctx.body = ServerResponse.createByErrorCodeMsg(NEED_LOGIN, '用户未登录');   
    }

    
    
  };
};

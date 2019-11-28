module.exports = () => {

  /**
   * 深拷贝并且转义
   */
  const deepCloneAndExcape = (obj, handleEscape) => {
    let data;
    if (Object.prototype.toString.call(obj) === '[object Array]') {
      data = [];
      for (let index = 0; index < obj.length; index++) {
        let escapeData = obj[index]
        if (typeof obj[index] === 'string') {
          escapeData = handleEscape(escapeData)          
        }
        data.push(deepCloneAndExcape(escapeData, handleEscape));
      }
    } else if(Object.prototype.toString.call(obj) === '[object Object]'){
      data = {};
      for (let key in obj) {
        let escapeData = obj[key]
        if (typeof obj[key] === 'string') {
          escapeData = handleEscape(escapeData)
        }
        data[key] = deepCloneAndExcape(escapeData, handleEscape);
      }
    } else {
      return obj;
    }
    return data;
  }

  /**
   * 防御xss攻击
   */
  return async function xssHandler(ctx, next) {
    const requestVo = ctx.request.body;
    const data = deepCloneAndExcape(requestVo, ctx.helper.escape)
    ctx.request.body = data;
    await next();
  };
};
module.exports = (options) => {
  return async function corsHandler(ctx, next) {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Content-Type', 'application/json;charset=UTF-8');
    ctx.set('X-Response-Time', '2s');
    ctx.set('Connection', 'close');
    ctx.status = 200;

    await next();
  }
}
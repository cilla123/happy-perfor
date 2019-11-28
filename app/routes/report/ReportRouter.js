module.exports = app => {
  // const checkLogin = app.middleware.checkLogin({ checkAdmin: true });
  // app.router.post('/admin/common/uploadFile', checkLogin, app.controller.admin.attachmentController.uploadFile);

  const corsHandler = app.middleware.corsHandler();
  app.router.post('/client/report', corsHandler, app.controller.client.reportController.webReport);

}

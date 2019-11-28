'use strict';

const BaseController = require('../BaseController')

/**
 * 上报控制器
 */
class ReportController extends BaseController {

  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.ArticleService = ctx.service.admin.articleService;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  /**
   * 创建文章
   */
  async create () {
    const queryVo = this.ctx.request.body;
    const validateRule = {
      title: { type: 'string', required: true },
      summary: { type: 'string', required: true },
      content: { type: 'string', required: true }
    }
    this.ctx.validate(validateRule, queryVo);
    const respponse = await this.ArticleService.create(queryVo);
    this.ctx.body = respponse;
  }

  /**
   * web端用户数据上报
   */
  async webReport () {
    this.ctx.body = 666
  }

}

module.exports = ReportController;

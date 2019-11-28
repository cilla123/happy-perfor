'use strict';

const _ = require('lodash');

const BaseService = require('../BaseService');

/**
 * 上报Service
 */
class ReportService extends BaseService {

  constructor(ctx) {
    super(ctx);
    // this.ArticleModel = ctx.model.ArticleModel;
    // this.CategoryService = ctx.service.admin.categoryService;
    // this.AttachmentService = ctx.service.admin.attachmentService;    
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  /**
   * 保存web端用户上报的数据
   */
  async saveWebReportData() {
    
  }

}

module.exports = ReportService

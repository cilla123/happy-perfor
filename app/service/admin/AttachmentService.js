'use strict';

const _ = require('lodash');

const BaseService = require('../BaseService');

/**
 * 附件Service
 */
class AttachmentService extends BaseService {

  constructor(ctx) {
    super(ctx);
    this.AttachmentModel = ctx.model.AttachmentModel;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  /**
   * 根据id查找对应的附件
   */
  async _findOne (id) {
    let newAttachment = await this.AttachmentModel.findOne({
      where: {
        id
      }
    });
    if (newAttachment) {
      newAttachment = newAttachment.toJSON();
      newAttachment = this.getNewObj(newAttachment);
    }
    return newAttachment;
  }

  /**
   * 上传
   */
  async create (attachment) {
    try {
      let newAttachment = await this.AttachmentModel.create(attachment, {});
      if (!newAttachment) return this.ServerResponse.createByErrorMsg('创建失败');

      newAttachment = newAttachment.toJSON();
      newAttachment = this.getNewObj(newAttachment);

      return this.ServerResponse.createBySuccessMsgAndData('上传成功', newAttachment);   
    } catch (error) {
      return this.ServerResponse.createByErrorMsg('上传失败');      
    }
  }

}

module.exports = AttachmentService;
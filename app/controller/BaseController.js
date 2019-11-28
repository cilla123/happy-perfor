'use strict';

const Controller = require('egg').Controller;
const awaitWriteStream = require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole');
const dayjs = require('dayjs');
const path = require('path');
const fs = require('fs');

/**
 * 基础Controller
 */
class BaseController extends Controller {

  constructor(ctx) {
    super(ctx);
    this.ServerResponse = ctx.response.ServerResponse;
    this.AttachmentService = ctx.service.admin.attachmentService;
  }
  
  /**
   * 上传文件
   * @param {string} 分类
   */
  async upload (category = '') {
    // 获取流
    const stream = await this.ctx.getFileStream();
    // 基础的目录
    const uplaodBasePath = this.app.config.envConfig.uploadPath;
    // 生成文件名
    const filename = `${Date.now()}${Number.parseInt(Math.random() * 1000,)}${path.extname(stream.filename).toLocaleLowerCase()}`;
    // 生成文件夹
    const dirname = dayjs(Date.now()).format('YYYY/MM/DD');
    // 同步创建文件夹
    function mkdirsSync(dirname) {
      if (fs.existsSync(dirname)) {
        return true;
      } else {
        if (mkdirsSync(path.dirname(dirname))) {
          fs.mkdirSync(dirname);
          return true;
        }
      }
    }
    // mkdirsSync(path.join(uplaodBasePath, category, dirname));
    // 生成写入路径
    // const target = path.join(uplaodBasePath, category, dirname, filename);
    // 写入流
    // const writeStream = fs.createWriteStream(target);
    // 结果
    const uploadUrl = category + dirname;
    const filePath = uploadUrl + '/' + filename;
    try {
      // oss 服务
      const ossResult = await this.ctx.oss.put(filePath, stream);
      // 本地上传
      // 异步把文件流 写入
      // await awaitWriteStream(stream.pipe(writeStream));
      // 文件信息插入数据库
      const response =  await this.AttachmentService.create({
        filename: filename,
        oriFilename: stream.filename,
        filePath: ossResult.url,
        extend: path.extname(stream.filename)
      })
      return response;
    } catch (err) {
      // 如果出现错误，关闭管道
      await sendToWormhole(stream);
      return this.ServerResponse.createByError('上传失败');
    }
  }

}

module.exports = BaseController;

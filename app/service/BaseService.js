'use strict';

const Service = require('egg').Service;

/**
 * 基础Service
 */
class BaseService extends Service {

  constructor(ctx) {
    super(ctx)
  }
  
  /**
   * 获取处理日期为时间戳的对象
   */
  getNewObj (obj) {
    obj = {
      ...obj,
      createTime: new Date(obj.createTime).getTime(),
      updateTime: new Date(obj.updateTime).getTime()
    }
    return obj
  }

  /**
   * 获取列表数据
   */
  async getListData (model, query) {
    const pageSize = Number(query.pageSize)
    const { count, rows } = await model.findAndCountAll({
      ...query,
      limit: Number(pageSize | 0),
      offset: Number(query.pageNum - 1 | 0) * Number(pageSize | 0),
    });
    if (rows.length === 0 || rows.length < 1) {
      return {
        pageNum: query.pageNum,
        pageSize: pageSize,
        list: [],
        total: count,
        totalPage: Math.ceil((count + pageSize - 1) / pageSize)
      };
    }
    const resultList = rows.map(row => {
      row = row.toJSON(),
      row = this.getNewObj(row)
      return row
    })
    return {
      pageNum: query.pageNum,
      pageSize: pageSize,
      list: resultList,
      total: count,
      totalPage: Math.ceil((count + pageSize - 1) / pageSize)
    }
  }

}

module.exports = BaseService;

'use strict';

const _ = require('lodash');

const BaseService = require('../BaseService');

/**
 * 分类Service
 */
class CategoryService extends BaseService {

  constructor(ctx) {
    super(ctx);
    this.CategoryModel = ctx.model.CategoryModel;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  /**
   * 分类详情
   */
  async detail (id) {
    try {
      let newCategory = await this.CategoryModel.findOne({
        where: {
          id
        }
      });
      if (!newCategory) return this.ServerResponse.createBySuccessMsg('没有此分类');

      newCategory = newCategory.toJSON();
      newCategory = this.getNewObj(newCategory);

      return this.ServerResponse.createBySuccessMsgAndData('查询成功', newCategory);      
    } catch (error) {
      return this.ServerResponse.createByErrorMsg('查询失败');                  
    }
  }

  /**
   * 分类列表
   */
  async list (queryVo) {
    try {
      const { like } = this.ctx.app.Sequelize.Op
      const resultList = await this.getListData(this.CategoryModel, {
        ...queryVo,
        where: { name: { [like]: `%${ queryVo.name }%` } },
        order: [[ 'updateTime', 'desc' ]],
      });
      return this.ServerResponse.createBySuccessMsgAndData('查询成功', resultList);     
    } catch (error) {
      return this.ServerResponse.createByErrorMsg('查询失败');                        
    }
  }

  /**
   * 获取全部列表
   */
  async getAllList () {
    try {
      let allCategory = await this.CategoryModel.findAll({});
      allCategory = allCategory.map(item => {
        item = item.toJSON();
        item = this.getNewObj(item);
        return item;
      });
      return this.ServerResponse.createBySuccessMsgAndData('查询成功', allCategory);   
    } catch (error) {
      return this.ServerResponse.createByErrorMsg('查询失败');                              
    }
  }

}

module.exports = CategoryService
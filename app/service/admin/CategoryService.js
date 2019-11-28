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
   * 根据id查找对应的分类
   */
  async _findOne (id) {
    let newCategory = await this.CategoryModel.findOne({
      where: {
        id
      }
    });
    if (newCategory) {
      newCategory = newCategory.toJSON();
      newCategory = this.getNewObj(newCategory);
    }
    return newCategory;
  }

  /**
   * 创建分类
   */
  async create (category) {
    try {
      let newCategory = await this.CategoryModel.create(category, {});
      if (!newCategory) return this.ServerResponse.createByErrorMsg('创建失败');

      return this.ServerResponse.createBySuccessMsg('创建成功');
    } catch (error) {
      return this.ServerResponse.createByErrorMsg('创建失败');      
    }
  }

  /**
   * 更新分类信息
   */
  async update (category) {
    try {
      const result = await this.CategoryModel.findOne({
        where: {
          id: category.id
        }
      })
      if (!result) return this.ServerResponse.createByErrorMsg('没有此分类');

      await this.CategoryModel.update(category, {
        where: { id: category.id },
        individualHooks: true,
      });

      return this.ServerResponse.createBySuccessMsg('更新成功');
    } catch (error) {
      return this.ServerResponse.createByErrorMsg('更新失败');            
    }
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
   * 删除分类
   */
  async delete (id) {
    const deleteCount = await this.CategoryModel.destroy({ where: { id } });
    if (deleteCount < 1) return this.ServerResponse.createByErrorMsg('删除失败');
    return this.ServerResponse.createBySuccessMsg('删除成功');
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
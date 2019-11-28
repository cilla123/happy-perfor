'use strict';

const _ = require('lodash');

const BaseService = require('../BaseService');

/**
 * 文章Service
 */
class ArticleService extends BaseService {

  constructor(ctx) {
    super(ctx);
    this.CategoryService = ctx.service.admin.categoryService;
    this.AttachmentService = ctx.service.admin.attachmentService;
    this.ArticleModel = ctx.model.ArticleModel;
    this.CategoryModel = ctx.model.CategoryModel;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  /**
   * 创建文章
   */
  async create (article) {
    try {
      article.pv = 0;
      let newArticle = await this.ArticleModel.create(article, {});
      if (!newArticle) return this.ServerResponse.createByErrorMsg('创建失败');

      return this.ServerResponse.createBySuccessMsg('创建成功');
    } catch (error) {
      return this.ServerResponse.createByErrorMsg('创建失败');      
    }
  }

  /**
   * 更新文章
   */
  async update (article) {
    try {
      const result = await this.ArticleModel.findOne({
        where: {
          id: article.id
        }
      })
      if (!result) return this.ServerResponse.createByErrorMsg('没有此文章');

      await this.ArticleModel.update(article, {
        where: { id: article.id },
        individualHooks: true,
      });

      return this.ServerResponse.createBySuccessMsg('更新成功');
    } catch (error) {
      return this.ServerResponse.createByErrorMsg('更新失败');            
    }
  }

  /**
   * 文章详情
   */
  async detail (id) {
    try {
      let newArticle = await this.ArticleModel.findOne({
        where: {
          id
        }
      });
      if (!newArticle) return this.ServerResponse.createBySuccessMsg('没有此文章');

      newArticle = newArticle.toJSON();
      newArticle = this.getNewObj(newArticle);

      let newCover;
      if (newArticle.coverId) {
        newCover = await this.AttachmentService._findOne(newArticle.coverId);
      }

      newArticle.cover = newCover;
      delete newArticle.coverId;

      return this.ServerResponse.createBySuccessMsgAndData('查询成功', newArticle);      
    } catch (error) {
      return this.ServerResponse.createByErrorMsg('查询失败');                  
    }
  }

  /**
   * 删除文章
   */
  async delete (id) {
    const deleteCount = await this.ArticleModel.destroy({ where: { id } });
    if (deleteCount < 1) return this.ServerResponse.createByErrorMsg('删除失败');
    return this.ServerResponse.createBySuccessMsg('删除成功');
  }

  /**
   * 修改文章状态
   */
  async updateStatus (id, status) {
    try {
      const result = await this.ArticleModel.findOne({
        where: {
          id
        }
      })
      if (!result) return this.ServerResponse.createByErrorMsg('没有此文章');

      await this.ArticleModel.update({ id, status }, {
        where: { id: id },
        individualHooks: true,
      });

      return this.ServerResponse.createBySuccessMsg('更新成功');
    } catch (error) {
      return this.ServerResponse.createByErrorMsg('更新失败');            
    }
  }

  /**
   * 文章列表
   */
  async list (queryVo) {
    try {
      const { like, or } = this.ctx.app.Sequelize.Op
      const resultList = await this.getListData(this.ArticleModel, {
        ...queryVo,
        where: {
          [or]: [{
            title: { [like]: `%${ queryVo.title }%` },
          }, {
            categoryId: queryVo.categoryId
          }] 
        },
        order: [[ 'updateTime', 'desc' ]],
      });

      const articleList = resultList.list
      let result;
      if (articleList) {
        // 查找对应文章的分类
        const resultListTemp = await Promise.all(articleList.map(async item => {
          let newCategory;
          if (item.categoryId) {
            newCategory = await this.CategoryService._findOne(item.categoryId)
          }
          delete item.categoryId
          return {
            ...item,
            category: newCategory || null
          }
        }))
  
        // 查找对应的图片
        result = await Promise.all(resultListTemp.map(async item => {
          let newCover;
          if (item.coverId) {
            newCover = await this.AttachmentService._findOne(item.coverId)
          }
          delete item.coverId
          return {
            ...item,
            cover: newCover || null
          }
        }))
      }
        

      return this.ServerResponse.createBySuccessMsgAndData('查询成功', {
        ...resultList,
        list: result
      });     
    } catch (error) {
      return this.ServerResponse.createByErrorMsg('查询失败');                        
    }
  }

  /**
   * 获取全部列表
   */
  async getAllList () {
    try {
      let allArticle = await this.ArticleModel.findAll({
        order: [[ 'updateTime', 'desc' ]],
      });
      allArticle = allArticle.map(item => {
        item = item.toJSON();
        item = this.getNewObj(item);
        return item;
      });
      return this.ServerResponse.createBySuccessMsgAndData('查询成功', allArticle);   
    } catch (error) {
      return this.ServerResponse.createByErrorMsg('查询失败');                              
    }
  }

}

module.exports = ArticleService

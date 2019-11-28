'use strict';

const _ = require('lodash');

const BaseService = require('../BaseService');

/**
 * 文章Service
 */
class ArticleService extends BaseService {

  constructor(ctx) {
    super(ctx);
    this.ArticleModel = ctx.model.ArticleModel;
    this.CategoryService = ctx.service.admin.categoryService;
    this.AttachmentService = ctx.service.admin.attachmentService;    
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
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

      // 更新pv
      const currentPv = newArticle.pv + 1;
      await this.ArticleModel.update({ id, pv: currentPv }, {
        where: { id: id },
        individualHooks: true,
      });

      newArticle = this.getNewObj(newArticle);

      let newCover;
      if (newArticle.coverId) {
        newCover = await this.AttachmentService._findOne(newArticle.coverId);
      }

      let newCategory;
      if (newArticle.categoryId) {
        newCategory = await this.CategoryService._findOne(newArticle.categoryId)
      }

      newArticle.category = newCategory;
      newArticle.cover = newCover;
      delete newArticle.categoryId;
      delete newArticle.coverId;

      return this.ServerResponse.createBySuccessMsgAndData('查询成功', newArticle);      
    } catch (error) {
      return this.ServerResponse.createByErrorMsg('查询失败');                  
    }
  }

  /**
   * 文章列表
   */
  async list (queryVo) {
    try {
      const { like, and, or, any } = this.ctx.app.Sequelize.Op
      const resultList = await this.getListData(this.ArticleModel, {
        ...queryVo,
        where: {
          [and]: [{
            title: { [like]: `%${ queryVo.title }%` },
          }, {
            categoryId: { [like]: `%${ queryVo.categoryId  }%` }
          }, {
            status: 1
          }] 
        },
        order: [[ 'createTime', 'desc' ]],
      });
      
      const articleList = resultList.list
      let result;
      if (articleList.length > 0) {
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

        result = {
          ...resultList,
          list: result
        }
      } else {
        result = resultList
      }
      return this.ServerResponse.createBySuccessMsgAndData('查询成功', result);     
    } catch (error) {
      return this.ServerResponse.createByErrorMsg('查询失败');                        
    }
  }

  /**
   * 获取推荐列表
   */
  async getRecommendList (queryVo) {
    try {
      const { like, and, or, any } = this.ctx.app.Sequelize.Op
      const resultList = await this.getListData(this.ArticleModel, {
        ...queryVo,
        where: {
          status: 1
        },
        order: [[ 'pv', 'desc' ], ['createTime', 'asc']],
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

  /**
   * 更新文章PV
   */
  async updateArticlePv (id) {
    try {
      const result = await this.ArticleModel.findOne({
        where: {
          id
        }
      })
      if (!result) return this.ServerResponse.createByErrorMsg('没有此文章');
      
      const currentPv = result.toJSON().pv + 1
      await this.ArticleModel.update({ id, pv: currentPv }, {
        where: { id: id },
        individualHooks: true,
      });

      return this.ServerResponse.createBySuccessMsg('更新成功');
    } catch (error) {
      return this.ServerResponse.createByErrorMsg('更新失败');            
    }
  }

}

module.exports = ArticleService

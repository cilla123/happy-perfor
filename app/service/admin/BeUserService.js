'use strict';

const _ = require('lodash');

const BaseService = require('../BaseService');
const { USERNAME, EMAIL } = require('../../common/constants/commonType');
const { md5Encrypt } = require('../../common/utils/encrypt/Md5');
const { BE_USER_TOKEN } = require('../../common/constants/redisType');
const { signJwt, getJwtDecodedResult } = require('../../common/utils/encrypt/jwt');

/**
 * 后台用户Service
 */
class BeUserService extends BaseService {

  constructor(ctx) {
    super(ctx);
    this.BeUserModel = ctx.model.BeUserModel;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  /**
   * 根据某个字段查询是否存在数据
   */
  async checkExistColByField (field, value) {
    const data = await this.BeUserModel.findOne({
      attributes: [field],
      where: { [field]: value },
    });
    return !!data;
  }

  /**
   * 检查是否存在账号
   */
  async checkValid(type, value) {
    if (type) {
      if (USERNAME === type) {
        return await this.checkExistColByField('username', value)
          ? this.ServerResponse.createByErrorMsg('用户名已存在')
          : this.ServerResponse.createBySuccessMsg('用户名不存在');
      }
      if (EMAIL === type) {
        return await this.checkExistColByField('email', value)
          ? this.ServerResponse.createByErrorMsg('邮箱已存在')
          : this.ServerResponse.createBySuccessMsg('邮箱不存在');
      }
    }
    return this.ServerResponse.createByErrorMsg('参数错误');
  }

  /**
   * 注册
   */
  async register (user) {
    // 检查用户名是否存在
    const validUsernameResponse = await this.checkValid(USERNAME, user.username);
    if (!validUsernameResponse.isSuccess()) return validUsernameResponse;

    try {
      user.password = md5Encrypt(user.password);
      
      let newUser = await this.BeUserModel.create(user, {
        attributes: { exclude: ['password'] }
      });
      if (!newUser) return this.ServerResponse.createByErrorMsg('注册失败');

      newUser = newUser.toJSON();
      _.unset(newUser, 'password');
      newUser = this.getNewObj(newUser)

      return this.ServerResponse.createBySuccessMsgAndData('注册成功', newUser);
    } catch (error) {
      return this.ServerResponse.createByErrorMsg('注册失败');
    }

  }

  /**
   * 登录
   */
  async login(username, password) {
    // 用户名存在报错
    const validResponse = await this.checkValid(USERNAME, username);
    if (validResponse.isSuccess()) return this.ServerResponse.createByErrorMsg('用户名不存在');

    // 检查密码是否正确
    const user = await this.BeUserModel.findOne({
      attributes: [ 'id', 'username', 'nickname' ],
      where: {
        username,
        password: md5Encrypt(password),
      },
    });

    if (!user) return this.ServerResponse.createByErrorMsg('密码错误');
    const userInfo = user.toJSON()
    const token = signJwt(userInfo);
    await this.app.redis.set(BE_USER_TOKEN + userInfo.id, token);

    return this.ServerResponse.createBySuccessMsgAndData('登录成功', {
      ...userInfo,
      token
    });
  }
  
  /**
   * 获取用户信息
   */
  async getUserInfo(userId) {
    const user = await this.BeUserModel.findOne({
      attributes: [ 'id', 'username', 'nickname'],
      where: { id: userId },
    });
    if (!user) return this.ServerResponse.createByErrorMsg('找不到当前用户');
    return this.ServerResponse.createBySuccessMsgAndData('查询成功', user.toJSON());
  }

}

module.exports = BeUserService;

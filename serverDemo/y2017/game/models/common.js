"use strict"
// 通用接口
const request = require('../../../tool/promise_request')
const _url = {//服务端接口地址
  getUserAddress: '/common/user-getUserAddress.html',//获取用户的收货地址
  toggleRelation: '/common/user-toggleRelation.html'//关注|取关 其他用户
}
/**
* 向服务端请求数据
* href 用于判断test/ot/online环境 获取对应接口地址
* param 请求参数
* ua User Agent 服务端接口限制需要
**/
module.exports = {
  //获取用户地址
  getUserAddress: async function(href, param, ua) {
    const result = await request.Get(_url.getUserAddress,href,param,ua)
    if (result.status == 200) {
      return result.data.result
    }
  },
  //关注|取消关注 其他用户
  toggleRelation: async function(href, param, ua) {
    const result = await request.Get(_url.toggleRelation,href,param,ua)
    if (result.status == 200) {
      return result.data.result
    }
  }
}

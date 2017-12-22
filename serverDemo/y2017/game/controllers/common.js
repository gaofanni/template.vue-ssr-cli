"use strict"
//通用接口
const apiModel = require('../models/common')
module.exports = {
  //关注|取消关注 其他用户
  toggleRelation: async function(cxt,next) {
    let href = cxt.href
    let param = cxt.search
    let ua = cxt.header['user-agent'] //服务端接口需要
    let data = await apiModel.toggleRelation(href,param,ua)
    cxt.body = data
  },
  //获取用户地址
  getUserAddress: async function(cxt,next) {
    let href = cxt.href
    let param = cxt.search
    let ua = cxt.header['user-agent'] //服务端接口需要
    let data = await apiModel.getUserAddress(href,param,ua)
    cxt.body = data
  }
}

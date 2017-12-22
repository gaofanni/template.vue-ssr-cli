/**
 * 同步数据请求封装
 **/
"use strict"

const thunkify = require('thunkify')
const request = require('request')
const Host = require('./host')
module.exports = {
  Get: thunkify(function(url, referer, ua,_) {
    let _host = Host.getURL(referer)
    request.get({
      headers: {'User-Agent': ua},
      url : _host + url,
    }, _)
  }),
  Post: thunkify(function(url, referer, _) {
    let _host = Host.getURL(referer)
    request.post({
      url : _host + url,
    }, _)
  })
}

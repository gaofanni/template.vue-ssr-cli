/**
 * 同步数据请求封装
 **/
"use strict"

const axios = require('axios')
const Host = require('./host')
module.exports = {
  Get: function(url,referer,param,ua) {
    let _host = Host.getURL(referer);
    return axios({
        method:'get',
        url:_host + url,
        headers:{'User-Agent':ua},
        params:param
    })
  },
  Post: function(url,referer,data,ua) {
    let _host = Host.getURL(referer);
    return axios({
        method:'post',
        url:_host + url,
        headers:{'User-Agent':ua},
        data:data
    })
  },
  Tongji: function(param, referer, ua) {
    let _tjHost = Host.getTjhost(referer)
    console.log(_tjHost+param);
    return axios.get(_tjHost+param,{
      headers:{'User-Agent':ua}
    })
    // request.get({
    //   headers: {'User-Agent': ua},
    //   url : _tjHost+param,
    // })
  },
  Download: function(url,referer,param,ua) {
    let _host = Host.getDownloadURL(referer);
    return axios({
        method:'get',
        url:_host + url,
        headers:{'User-Agent':ua},
        params:param
    })
  }
}

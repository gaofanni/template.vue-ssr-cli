
/**
 * 根据环境对于不同接口地址
 **/
module.exports = {
  regTest: /\/test\./i,
  regOt: /\/ot\./i,
  getURL: function (href) {
    if (this.regTest.test(href) || (href.indexOf('localhost') > -1) || (href.indexOf('192.168') > -1) || (href.indexOf('127.0.0.1') > -1)) {
      return 'http://mobi.4399tech.com/redirect/huodong.4399.cn/t2'
    } else if (this.regOt.test(href)) {
      return 'http://mobi.4399tech.com/redirect/huodong.4399.cn/ot'
    } else {
      return 'http://huodong.4399.cn'
    }
  },
  getTjhost: function (href) {
    if (this.regTest.test(href) || (href.indexOf('localhost') > -1) || (href.indexOf('192.168') > -1) || (href.indexOf('127.0.0.1') > -1)) {
      return 'http://mobi.4399tech.com/redirect/tj.img4399.com/t2'
    } else {
      return 'http://tj.img4399.com:8010'
    }
  },
  getDownloadURL: function (href) {
    
        if (this.regTest.test(href) || (href.indexOf('localhost') > -1) || (href.indexOf('192.168') > -1) || (href.indexOf('127.0.0.1') > -1)) {
          return 'http://mobi.4399tech.com/redirect/m.4399youpai.com/t2'
        } else if (this.regOt.test(href)) {
          return 'http://mobi.4399tech.com/redirect/m.4399youpai.com/ot'
        } else {
          return 'http://m.4399youpai.com'
        }
  }
};

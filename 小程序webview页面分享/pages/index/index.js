//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    web_src:'', // 嵌入的网址
    sharetitle:'', // 指定分享的标题
    share_src:'',  // 指定分享的网址
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    console.log(options)
    // 指定分享页面，即分享页，非当前页时
    if (options.return_url) {
      var web_url = decodeURIComponent(options.return_url);
      // 网址中加参数标记是小程序重新载入的
      web_url += web_url.indexOf('?') == -1 ? '?' : '&';
      web_url += 'platform=miniprogram';
 
      var share_url = decodeURIComponent(options.share_url);
    } else {
      var web_url = 'https://www.xinxueshuo.cn/#/'
      var share_url = web_url;
    }
    
    this.setData({
      web_src: web_url,
      share_src: share_url,
      sharetitle: options.sharetitle ? options.sharetitle : '',
    }, function () {
 
    });
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onShareAppMessage(options) {
    console.log(options)
    var that = this
    var share_src = that.data.share_src
    // 分享标题-有指定分享标题时就使用指定的，没有使用默认的
    var title = that.data.sharetitle ? that.data.sharetitle : that.data.title;
 
    // 当嵌入网址是重新载入时，更新分享链接为当前网址
    if (options.webViewUrl.indexOf('miniprogram') == -1) {
      share_src = options.webViewUrl
      title = that.data.title;
    }
    var path = '/pages/share/index?return_url=' + encodeURIComponent(share_src);
 
    return {
      title: title,
      path: path,
      success: function (res) {
      }
    }
  },
})

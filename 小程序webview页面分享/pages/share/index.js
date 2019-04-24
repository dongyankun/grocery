//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    web_src:'', // 嵌入的网址
    sharetitle:'', // 指定分享的标题
    share_src:'',  // 指定分享的网址
    globalData:{
      userinfo: null,
      ctxPath: "https://xxx"
    }
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    let that = this;
    that.setData({
      share_src: decodeURIComponent(options.return_url),
    })
    
  },
  getUserInfo: function(e) {
    
  },
  onShareAppMessage(options) {
    
  },
})

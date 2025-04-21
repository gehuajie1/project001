App({
  globalData: {
    baseUrl: 'http://10.10.88.224:8088/api',  // 请替换为您的实际IP地址
    userInfo: null
  },
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log('登录成功', res)
      }
    })
  }
}) 
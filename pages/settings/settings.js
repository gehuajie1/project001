const app = getApp()

Page({
  data: {
    nickname: '用户昵称',
    phone: '138****8888',
    baseUrl: app.globalData.baseUrl,
    userInfo: null,
    notificationEnabled: true,
    darkMode: false
  },

  onLoad: function() {
    // 获取用户信息
    this.getUserInfo();
    this.loadUserInfo()
  },

  onShow: function() {
    this.loadUserInfo()
  },

  getUserInfo: function() {
    // 这里应该从服务器获取用户信息
    // 模拟数据
    this.setData({
      nickname: '用户昵称',
      phone: '138****8888'
    });
  },

  changeAvatar: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // 这里应该上传图片到服务器
        const tempFilePath = res.tempFilePaths[0];
        wx.showToast({
          title: '头像上传成功',
          icon: 'success'
        });
      }
    });
  },

  changePhone: function() {
    wx.navigateTo({
      url: '/pages/change-phone/change-phone'
    });
  },

  changePassword: function() {
    wx.navigateTo({
      url: '/pages/change-password/change-password'
    });
  },

  logout: function() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除登录信息
          wx.removeStorageSync('token');
          app.globalData.token = '';
          app.globalData.isLogin = false;
          
          // 跳转到登录页
          wx.reLaunch({
            url: '/pages/login/login'
          });
        }
      }
    });
  },

  // 加载用户信息
  loadUserInfo: function() {
    const userInfo = app.globalData.userInfo
    if (userInfo) {
      this.setData({ userInfo })
    }
  },

  // 处理登录
  handleLogin: function() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },

  // 处理退出登录
  handleLogout: function() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          app.logout()
          this.setData({ userInfo: null })
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          })
        }
      }
    })
  },

  // 跳转到指定页面
  navigateTo: function(e) {
    const { url } = e.currentTarget.dataset
    wx.navigateTo({ url })
  },

  // 检查更新
  checkUpdate: function() {
    const updateManager = wx.getUpdateManager()
    
    updateManager.onCheckForUpdate(function(res) {
      if (res.hasUpdate) {
        updateManager.onUpdateReady(function() {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: function(res) {
              if (res.confirm) {
                updateManager.applyUpdate()
              }
            }
          })
        })
        
        updateManager.onUpdateFailed(function() {
          wx.showModal({
            title: '更新提示',
            content: '新版本下载失败，请检查网络设置',
            showCancel: false
          })
        })
      } else {
        wx.showToast({
          title: '已是最新版本',
          icon: 'success'
        })
      }
    })
  },

  // 清除缓存
  clearCache: function() {
    wx.showModal({
      title: '提示',
      content: '确定要清除缓存吗？',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorage({
            success: () => {
              wx.showToast({
                title: '清除成功',
                icon: 'success'
              })
            }
          })
        }
      }
    })
  }
}); 
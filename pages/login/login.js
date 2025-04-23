const app = getApp()
const { http }  = require('../../utils/request')
const crypto = require('../../utils/crypto')

Page({
  data: {
    username: '',
    password: '',
    rememberMe: false,
    baseUrl: app.globalData.baseUrl
  },

  onLoad() {
    // 检查是否已登录
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
  },

  onUsernameChange(e) {
    this.setData({
      username: e.detail
    })
  },

  onPasswordChange(e) {
    this.setData({
      password: e.detail
    })
  },

  async handleLogin() {
    const { username, password } = this.data
    
    if (!username || !password) {
      wx.showToast({
        title: '请输入用户名和密码',
        icon: 'none'
      })
      return
    }

    try {
      // 对密码进行MD5加密
      const encryptedPassword = crypto.md5(password)
      
      const res = await http.post('/users/login', {
        username,
        password: encryptedPassword
      })

      console.log('登录返回数据:', res) // 添加日志，查看返回的数据结构

      // 确保获取到返回值后再进行存储
      if (res && res.data && res.data.userInfo && res.data.token) {
        // 保存用户信息和token
        wx.setStorageSync('userInfo', res.data.userInfo)
        wx.setStorageSync('token', res.data.token)

        // 如果选择了记住我，保存登录信息（注意：保存原始密码，不保存加密后的密码）
        if (this.data.rememberMe) {
          wx.setStorageSync('loginInfo', {
            username,
            password
          })
        }

        wx.showToast({
          title: '登录成功',
          icon: 'success'
        })

        // 跳转到首页
        wx.switchTab({
          url: '/pages/index/index'
        })
      } else {
        throw new Error('登录失败：返回数据不完整')
      }
    } catch (error) {
      console.error('登录失败:', error)
      // 错误信息已经在request.js中通过showToast显示，这里不需要重复显示
    }
  },

  goToRegister() {
    wx.navigateTo({
      url: '/pages/register/register'
    })
  },

  onRememberChange(e) {
    this.setData({
      rememberMe: e.detail.value.includes('remember')
    })
  },

  onForgotPassword() {
    // 处理忘记密码逻辑
  },

  onLogin: function() {
    const { username, password, rememberMe } = this.data;
    
    if (!username || !password) {
      wx.showToast({
        title: '请输入用户名和密码',
        icon: 'none'
      });
      return;
    }

    // 模拟登录请求
    wx.showLoading({
      title: '登录中...',
    });

    // 这里替换为实际的登录API调用
    setTimeout(() => {
      wx.hideLoading();
      
      // 登录成功
      if (rememberMe) {
        wx.setStorageSync('username', username);
        wx.setStorageSync('password', password);
      } else {
        wx.removeStorageSync('username');
        wx.removeStorageSync('password');
      }

      // 保存token
      wx.setStorageSync('token', 'mock_token');
      app.globalData.token = 'mock_token';
      app.globalData.isLogin = true;

      // 跳转到首页
      wx.switchTab({
        url: '/pages/index/index'
      });
    }, 1000);
  }
}); 
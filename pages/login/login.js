const app = getApp()
const http = require('../../utils/request')

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
      const res = await http.post('/user/login', {
        username,
        password
      })

      // 保存用户信息和token
      wx.setStorageSync('userInfo', res.userInfo)
      wx.setStorageSync('token', res.token)

      // 如果选择了记住我，保存登录信息
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
    } catch (error) {
      console.error('登录失败:', error)
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
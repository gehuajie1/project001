const app = getApp()
const weatherService = require('../../utils/weather')

Page({
  data: {
    greeting: '',
    currentDate: '',
    weekDay: '',
    weatherIcon: 'sunny',
    weatherText: '晴',
    temperature: '25',
    location: '正在获取位置...',
    loveDays: 0,
    baseUrl: app.globalData.baseUrl,
    weather: null,
    loading: true,
    error: null,
    nextAnniversary: {
      day: 0,
      name: ''
    }
  },

  onLoad: function() {
    this.updateDateTime();
    this.calculateLoveDays();
    this.loadWeatherInfo();
    this.setGreeting();
    this.loadAnniversaryInfo();
  },

  onShow: function() {
    this.setGreeting();
  },

  setGreeting: function() {
    const hour = new Date().getHours()
    let greeting = ''
    
    if (hour < 6) {
      greeting = '夜深了，注意休息'
    } else if (hour < 9) {
      greeting = '早安，美好的一天开始了'
    } else if (hour < 12) {
      greeting = '上午好，加油哦'
    } else if (hour < 14) {
      greeting = '中午好，记得午休'
    } else if (hour < 17) {
      greeting = '下午好，打起精神来'
    } else if (hour < 19) {
      greeting = '傍晚好，记得吃晚饭'
    } else if (hour < 22) {
      greeting = '晚上好，享受美好时光'
    } else {
      greeting = '夜深了，注意休息'
    }
    
    this.setData({ greeting })
  },

  onPullDownRefresh() {
    this.loadWeatherInfo()
  },

  async loadWeatherInfo() {
    try {
      this.setData({ loading: true, error: null })
      const weather = await weatherService.getWeather()
      this.setData({ 
        weather,
        loading: false,
        weatherIcon: weather.icon || 'sunny',
        weatherText: weather.text || '晴',
        temperature: weather.temperature || '--',
        location: weather.location || '位置获取失败'
      })
    } catch (error) {
      console.error('加载天气信息失败:', error)
      if (error.errMsg && error.errMsg.includes('getLocation:fail auth deny')) {
        // 处理位置权限被拒绝的情况
        wx.showModal({
          title: '需要位置权限',
          content: '获取天气信息需要位置权限，是否去设置？',
          success: (res) => {
            if (res.confirm) {
              wx.openSetting({
                success: (settingRes) => {
                  if (settingRes.authSetting['scope.userLocation']) {
                    // 用户已授权，重新获取天气
                    this.loadWeatherInfo();
                  }
                }
              });
            }
          }
        });
      }
      this.setData({ 
        error: '获取天气信息失败，请下拉刷新重试',
        loading: false,
        weatherIcon: 'error',
        weatherText: '获取失败',
        temperature: '--',
        location: '位置获取失败'
      })
    } finally {
      wx.stopPullDownRefresh()
    }
  },

  updateDateTime: function() {
    const now = new Date();
    const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    
    this.setData({
      currentDate: `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`,
      weekDay: weekDays[now.getDay()]
    });
  },

  calculateLoveDays: function() {
    // 这里应该从服务器获取开始日期
    const startDate = new Date('2023-01-01');
    const now = new Date();
    const diffTime = Math.abs(now - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    this.setData({
      loveDays: diffDays
    });
  },

  navigateToAnniversary: function() {
    wx.navigateTo({
      url: '/pages/anniversary/anniversary'
    });
  },

  navigateToCheckin: function() {
    wx.navigateTo({
      url: '/pages/checkin/checkin'
    });
  },

  navigateToWish: function() {
    wx.navigateTo({
      url: '/pages/wish/wish'
    });
  },

  // 加载纪念日信息
  loadAnniversaryInfo() {
    wx.request({
      url: `${this.data.baseUrl}/anniversary/next`,
      method: 'GET',
      success: (res) => {
        if (res.data.state === 'success') {
          this.setData({
            nextAnniversary: {
              day: res.data.data.day,
              name: res.data.data.name
            }
          });
        } else {
          console.error('获取纪念日信息失败:', res.data.msg);
        }
      },
      fail: (err) => {
        console.error('获取纪念日信息失败:', err);
      }
    });
  }
}); 
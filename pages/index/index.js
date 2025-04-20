const app = getApp()
const weatherService = require('../../utils/weather')

Page({
  data: {
    userInfo: null,
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
    anniversaryDays: 0,
    nextAnniversaryDays: 0,
    nextAnniversaryType: '',
    nextAnniversary: '暂无'
  },

  onLoad: function() {
    this.updateDateTime();
    this.calculateLoveDays();
    this.loadWeatherInfo();
    this.loadUserInfo();
    this.setGreeting();
    this.calculateAnniversaries();
    this.loadAnniversaryInfo();
  },

  onShow: function() {
    // 每次显示页面时刷新用户信息和问候语
    this.loadUserInfo();
    this.setGreeting();
  },

  loadUserInfo: function() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({ userInfo })
    }
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

  onAvatarClick: function() {
    if (!this.data.userInfo) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
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

  getWeather: function() {
    // 这里应该调用天气API
    // 模拟数据
    this.setData({
      weatherIcon: 'sunny',
      weatherText: '晴',
      temperature: '25'
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

  // 计算纪念日
  calculateAnniversaries() {
    const now = new Date();
    const weddingDate = new Date('2023-05-20'); // 结婚纪念日
    const datingDate = new Date('2020-08-15'); // 恋爱纪念日

    // 计算距离结婚纪念日的天数
    const weddingDays = Math.floor((now - weddingDate) / (1000 * 60 * 60 * 24));
    
    // 计算距离恋爱纪念日的天数
    const datingDays = Math.floor((now - datingDate) / (1000 * 60 * 60 * 24));

    // 计算下一个纪念日
    const nextWedding = new Date(weddingDate);
    nextWedding.setFullYear(now.getFullYear());
    if (nextWedding < now) {
      nextWedding.setFullYear(now.getFullYear() + 1);
    }

    const nextDating = new Date(datingDate);
    nextDating.setFullYear(now.getFullYear());
    if (nextDating < now) {
      nextDating.setFullYear(now.getFullYear() + 1);
    }

    // 确定下一个纪念日
    let nextAnniversary;
    let nextAnniversaryType;
    if (nextWedding < nextDating) {
      nextAnniversary = nextWedding;
      nextAnniversaryType = '结婚纪念日';
    } else {
      nextAnniversary = nextDating;
      nextAnniversaryType = '恋爱纪念日';
    }

    // 计算距离下一个纪念日的天数
    const daysUntilNext = Math.ceil((nextAnniversary - now) / (1000 * 60 * 60 * 24));

    this.setData({
      anniversaryDays: datingDays,
      nextAnniversaryDays: daysUntilNext,
      nextAnniversaryType: nextAnniversaryType
    });
  },

  // 加载纪念日信息
  loadAnniversaryInfo() {
    wx.request({
      url: `${this.data.baseUrl}/anniversary/next`,
      method: 'GET',
      success: (res) => {
        if (res.data.code === 0) {
          this.setData({
            nextAnniversaryDays: res.data.data.days,
            nextAnniversaryType: res.data.data.type
          });
        } else {
          wx.showToast({
            title: '获取纪念日信息失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        console.error('获取纪念日信息失败:', err);
        wx.showToast({
          title: '获取纪念日信息失败',
          icon: 'none'
        });
      }
    });
  },
}); 
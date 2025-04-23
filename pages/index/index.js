const app = getApp()
const { getWeather } = require('../../utils/weather')
const {request} = require('../../utils/request')

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
    userInfo: null,
    weatherData: {
      city: '',
      reportTime: '',
      today: {
        dayWeather: '',
        nightWeather: '',
        dayTemp: '',
        nightTemp: '',
        dayWind: '',
        nightWind: '',
        dayPower: '',
        nightPower: ''
      },
      tomorrow: {
        dayWeather: '',
        nightWeather: '',
        dayTemp: '',
        nightTemp: '',
        dayWind: '',
        nightWind: '',
        dayPower: '',
        nightPower: ''
      }
    },
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
    this.loadWeather();
    this.setGreeting();
    this.loadAnniversaryInfo();
    this.loadUserInfo();
  },

  onShow: function() {
    this.setGreeting();
    this.loadUserInfo();
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
    this.loadWeather().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  async loadWeather() {
    try {
      console.log('开始加载天气数据')
      this.setData({ loading: true })
      const res = await getWeather()
      console.log('获取到的天气数据:', res)
      
      if (res && res.forecasts && res.forecasts[0]) {
        const forecast = res.forecasts[0]
        const today = forecast.casts[0]
        const tomorrow = forecast.casts[1]
        
        console.log('解析后的数据:', {
          forecast,
          today,
          tomorrow
        })
        
        // 确保所有必要的数据都存在
        if (!today || !tomorrow) {
          throw new Error('天气数据不完整')
        }

        const newWeatherData = {
          city: forecast.city || '',
          reportTime: forecast.reporttime || '',
          today: {
            dayWeather: today.dayweather || '',
            nightWeather: today.nightweather || '',
            dayTemp: today.daytemp || '',
            nightTemp: today.nighttemp || '',
            dayWind: today.daywind || '',
            nightWind: today.nightwind || '',
            dayPower: today.daypower || '',
            nightPower: today.nightpower || ''
          },
          tomorrow: {
            dayWeather: tomorrow.dayweather || '',
            nightWeather: tomorrow.nightweather || '',
            dayTemp: tomorrow.daytemp || '',
            nightTemp: tomorrow.nighttemp || '',
            dayWind: tomorrow.daywind || '',
            nightWind: tomorrow.nightwind || '',
            dayPower: tomorrow.daypower || '',
            nightPower: tomorrow.nightpower || ''
          }
        }

        console.log('处理后的天气数据:', newWeatherData)
        this.setData({ 
          weatherData: newWeatherData,
          loading: false,
          error: null
        })
        console.log('设置数据后的状态:', this.data)
      } else {
        throw new Error('天气数据格式错误')
      }
    } catch (error) {
      console.error('加载天气数据失败:', error)
      this.setData({ 
        error: '获取天气信息失败，请下拉刷新重试',
        loading: false
      })
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

  // 加载纪念日信息
  async loadAnniversaryInfo() {
    try {
      const res = await request({
        url: '/anniversary/next',
        method: 'GET'
      })

      if (res && res.state === 'success' && res.data) {
        this.setData({
          nextAnniversary: {
            day: res.data.days,
            name: res.data.title
          }
        })
      }
    } catch (error) {
      console.error('加载纪念日信息失败:', error)
    }
  },

  // 获取天气图标
  getWeatherIcon(weather) {
    if (!weather || typeof weather !== 'string') return 'cloudy-o'
    
    const weatherMap = {
      '晴': 'sunny',
      '多云': 'cloudy',
      '阴': 'cloudy-o',
      '小雨': 'rain',
      '中雨': 'rain',
      '大雨': 'rain',
      '暴雨': 'rain',
      '雷阵雨': 'lightning',
      '小雪': 'snow',
      '中雪': 'snow',
      '大雪': 'snow',
      '雾': 'fog',
      '霾': 'fog',
      '风': 'wind'
    }
    return weatherMap[weather] || 'cloudy-o'
  },

  // 加载用户信息
  loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({ userInfo })
    }
  }
});
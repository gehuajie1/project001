const http = require('./request')

// 获取位置信息
const getLocation = () => {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'gcj02',
      success: resolve,
      fail: (error) => {
        console.error('获取位置信息失败:', error)
        // 处理位置权限被拒绝的情况
        if (error.errMsg && error.errMsg.includes('getLocation:fail auth deny')) {
          wx.showModal({
            title: '需要位置权限',
            content: '获取天气信息需要位置权限，是否去设置？',
            success: (res) => {
              if (res.confirm) {
                wx.openSetting({
                  success: (settingRes) => {
                    if (settingRes.authSetting['scope.userLocation']) {
                      // 用户已授权，重新获取位置
                      getLocation().then(resolve).catch(reject)
                    } else {
                      reject(new Error('用户未授权位置权限'))
                    }
                  }
                })
              } else {
                reject(new Error('用户取消授权'))
              }
            }
          })
        } else {
          reject(error)
        }
      }
    })
  })
}

// 天气图标映射
const weatherIconMap = {
  'sunny': 'sunny',           // 晴
  'cloudy': 'cloudy',         // 多云
  'overcast': 'overcast',     // 阴
  'lightrain': 'lightrain',   // 小雨
  'heavyrain': 'heavyrain',   // 大雨
  'snow': 'snow',             // 雪
  'fog': 'fog',               // 雾
  'haze': 'haze',             // 霾
  'thunder': 'thunder',       // 雷
  'sleet': 'sleet',           // 雨夹雪
  'windy': 'windy',           // 风
  'tornado': 'tornado',       // 龙卷风
  'typhoon': 'typhoon'        // 台风
}

// 默认天气数据
const defaultWeatherData = {
  icon: 'sunny',
  text: '晴',
  temperature: '25',
  location: '合肥市',
  humidity: '--',
  windDirection: '未知风向',
  windScale: '0级',
  pressure: '--',
  visibility: '--',
  updateTime: new Date().toLocaleString()
}

// 获取天气信息
const getWeather = async () => {
  try {
    // 1. 获取位置信息
    const location = await getLocation()
    
    // 2. 尝试使用腾讯地图API
    try {
      const weather = await new Promise((resolve, reject) => {
        wx.request({
          url: 'https://apis.map.qq.com/ws/geocoder/v1/',
          method: 'GET',
          data: {
            location: `${location.latitude},${location.longitude}`,
            key: 'CEOBZ-BEHLQ-N5T5S-2CBI5-YKPRH-FEBGH',
            get_poi: 0
          },
          success: (res) => {
            if (res.statusCode === 200 && res.data.status === 0) {
              // 获取到地址信息后，再获取天气信息
              wx.request({
                url: 'https://apis.map.qq.com/ws/weather/v1/',
                method: 'GET',
                data: {
                  location: `${location.latitude},${location.longitude}`,
                  key: 'CEOBZ-BEHLQ-N5T5S-2CBI5-YKPRH-FEBGH'
                },
                success: (weatherRes) => {
                  if (weatherRes.statusCode === 200 && weatherRes.data.status === 0) {
                    const weatherData = weatherRes.data.result
                    // 获取风向描述
                    const getWindDirection = (degree) => {
                      if (degree >= 337.5 || degree < 22.5) return '北风'
                      if (degree >= 22.5 && degree < 67.5) return '东北风'
                      if (degree >= 67.5 && degree < 112.5) return '东风'
                      if (degree >= 112.5 && degree < 157.5) return '东南风'
                      if (degree >= 157.5 && degree < 202.5) return '南风'
                      if (degree >= 202.5 && degree < 247.5) return '西南风'
                      if (degree >= 247.5 && degree < 292.5) return '西风'
                      if (degree >= 292.5 && degree < 337.5) return '西北风'
                      return '未知风向'
                    }
                    
                    // 获取风力等级描述
                    const getWindScale = (speed) => {
                      if (speed < 1) return '0级'
                      if (speed < 5) return '1-2级'
                      if (speed < 10) return '3-4级'
                      if (speed < 15) return '5-6级'
                      if (speed < 20) return '7-8级'
                      if (speed < 25) return '9-10级'
                      return '10级以上'
                    }
                    
                    resolve({
                      icon: weatherIconMap[weatherData.now.icon] || 'sunny',
                      text: weatherData.now.text,
                      temperature: weatherData.now.temp,
                      location: res.data.result.address,
                      humidity: weatherData.now.humidity || '--',
                      windDirection: getWindDirection(weatherData.now.wind360 || 0),
                      windScale: getWindScale(weatherData.now.windSpeed || 0),
                      pressure: weatherData.now.pressure || '--',
                      visibility: weatherData.now.vis || '--',
                      updateTime: weatherData.now.obsTime || new Date().toLocaleString()
                    })
                  } else {
                    console.warn('腾讯地图API调用失败:', weatherRes.data)
                    resolve(defaultWeatherData)
                  }
                },
                fail: (error) => {
                  console.error('获取天气信息失败:', error)
                  resolve(defaultWeatherData)
                }
              })
            } else {
              console.warn('获取位置信息失败:', res.data)
              resolve(defaultWeatherData)
            }
          },
          fail: (error) => {
            console.error('获取位置信息失败:', error)
            resolve(defaultWeatherData)
          }
        })
      })
      
      return weather
    } catch (error) {
      console.error('获取天气信息失败:', error)
      return defaultWeatherData
    }
  } catch (error) {
    console.error('获取位置信息失败:', error)
    return defaultWeatherData
  }
}

module.exports = {
  getWeather
} 
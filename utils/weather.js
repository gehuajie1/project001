const app = getApp()

// 高德天气API配置
const AMAP_KEY = 'ed7eece954b5b1d7d2c160c17d8ecf32'
const AMAP_WEATHER_URL = 'https://restapi.amap.com/v3/weather/weatherInfo'
const AMAP_GEOCODE_URL = 'https://restapi.amap.com/v3/geocode/regeo'

// 默认城市编码（合肥市）
const DEFAULT_CITY_CODE = '340100'

// 获取天气信息
async function getWeather() {
    try {
        // 获取位置信息
        const location = await getLocation()

        // 调用高德天气API
        const res = await new Promise((resolve, reject) => {
            wx.request({
                url: AMAP_WEATHER_URL,
                data: {
                    key: AMAP_KEY,
                    city: location.adcode || DEFAULT_CITY_CODE,
                    extensions: 'all' // 获取预报天气
                },
                success: (res) => {
                    resolve(res)
                },
                fail: (err) => {
                    reject(err)
                }
            })
        })

        if (res.data.status === '1') {
            const weatherData = res.data.lives[0] // 实时天气数据
            const forecastData = res.data.forecasts[0] // 预报天气数据

            return {
                location: location.district || '合肥市',
                temperature: weatherData.temperature,
                text: weatherData.weather,
                humidity: weatherData.humidity,
                windDirection: weatherData.winddirection,
                windScale: weatherData.windpower,
                pressure: weatherData.pressure,
                visibility: weatherData.visibility,
                updateTime: weatherData.reporttime,
                suggestion: getWeatherSuggestion(weatherData.weather),
                icon: getWeatherIcon(weatherData.weather),
                // 预报天气数据
                forecast: forecastData.casts.map(item => ({
                    date: item.date,
                    dayWeather: item.dayweather,
                    nightWeather: item.nightweather,
                    dayTemp: item.daytemp,
                    nightTemp: item.nighttemp,
                    dayWind: item.daywind,
                    nightWind: item.nightwind,
                    dayPower: item.daypower,
                    nightPower: item.nightpower
                }))
            }
        } else {
            throw new Error(res.data.info || '获取天气信息失败')
        }
    } catch (error) {
        console.error('获取天气信息失败:', error)
        // 返回默认天气数据
        return {
            location: '合肥市',
            temperature: '--',
            text: '未知',
            humidity: '--',
            windDirection: '未知',
            windScale: '--',
            pressure: '--',
            visibility: '--',
            updateTime: new Date().toLocaleString(),
            suggestion: '无法获取天气信息',
            icon: 'unknown'
        }
    }
}

// 获取位置信息
function getLocation() {
    return new Promise((resolve, reject) => {
        wx.getLocation({
            type: 'gcj02',
            success: async (res) => {
                try {
                    // 调用高德逆地理编码API
                    const geoRes = await new Promise((resolveGeo, rejectGeo) => {
                        wx.request({
                            url: AMAP_GEOCODE_URL,
                            data: {
                                key: AMAP_KEY,
                                location: `${res.longitude},${res.latitude}`
                            },
                            success: (geoRes) => {
                                resolveGeo(geoRes)
                            },
                            fail: (geoErr) => {
                                rejectGeo(geoErr)
                            }
                        })
                    })

                    if (geoRes.data.status === '1') {
                        const addressComponent = geoRes.data.regeocode.addressComponent
                        resolve({
                            district: addressComponent.district,
                            adcode: addressComponent.adcode
                        })
                    } else {
                        throw new Error(geoRes.data.info || '获取位置信息失败')
                    }
                } catch (error) {
                    console.error('获取位置信息失败:', error)
                    resolve({
                        district: '合肥市',
                        adcode: DEFAULT_CITY_CODE
                    })
                }
            },
            fail: (err) => {
                // 处理位置权限被拒绝的情况
                if (err.errMsg && err.errMsg.includes('getLocation:fail auth deny')) {
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
                                            // 用户未授权，返回默认城市
                                            resolve({
                                                district: '合肥市',
                                                adcode: DEFAULT_CITY_CODE
                                            })
                                        }
                                    }
                                })
                            } else {
                                // 用户取消授权，返回默认城市
                                resolve({
                                    district: '合肥市',
                                    adcode: DEFAULT_CITY_CODE
                                })
                            }
                        }
                    })
                } else {
                    // 其他错误，返回默认城市
                    resolve({
                        district: '合肥市',
                        adcode: DEFAULT_CITY_CODE
                    })
                }
            }
        })
    })
}

// 根据天气状况获取建议
function getWeatherSuggestion(weather) {
    const suggestions = {
        '晴': '天气晴朗，适合外出活动',
        '多云': '天气多云，注意防晒',
        '阴': '天气阴沉，建议室内活动',
        '小雨': '有小雨，记得带伞',
        '中雨': '有中雨，注意出行安全',
        '大雨': '有大雨，建议减少外出',
        '雷阵雨': '有雷阵雨，注意防雷',
        '雾': '有雾，注意交通安全',
        '霾': '有霾，建议减少户外活动'
    }
    return suggestions[weather] || '请根据天气情况合理安排活动'
}

// 根据天气状况获取图标
function getWeatherIcon(weather) {
    const icons = {
        '晴': 'sunny',
        '多云': 'cloudy',
        '阴': 'overcast',
        '小雨': 'light-rain',
        '中雨': 'moderate-rain',
        '大雨': 'heavy-rain',
        '雷阵雨': 'thunderstorm',
        '雾': 'fog',
        '霾': 'haze'
    }
    return icons[weather] || 'unknown'
}

module.exports = {
    getWeather
}
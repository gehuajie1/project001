const { request } = require('./request')

const app = getApp()

// 高德天气API配置
const AMAP_KEY = 'ea66231cdf146d743882b0e49792fa94'
const AMAP_WEATHER_URL = 'https://restapi.amap.com/v3/weather/weatherInfo'

// 默认城市编码（合肥市）
const DEFAULT_CITY_CODE = '340100'

// 获取天气信息
async function getWeather() {
    try {
        // 获取位置信息
        const location = await getLocation();

        // 调用高德天气 API
        const res = await request({
            url: AMAP_WEATHER_URL,
            data: {
                key: AMAP_KEY,
                city: location.adcode,
                extensions: 'all' // 获取预报天气
            }
        });

        console.log('天气 API 返回数据:', res);
        return res;
    } catch (error) {
        console.error('获取天气信息失败:', error);
        throw error;
    }
}

// 获取位置信息
function getLocation() {
    return new Promise((resolve, reject) => {
        wx.getLocation({
            type: 'gcj02',
            success: (res) => {
                console.log('获取位置成功:', res)
                // 直接使用微信获取的位置信息
                resolve({
                    district: '当前位置',
                    adcode: DEFAULT_CITY_CODE // 暂时使用默认城市编码
                })
            },
            fail: (err) => {
                console.error('获取位置失败:', err)
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

// 获取星期几
function getWeekDay(day) {
    const weekDays = ['日', '一', '二', '三', '四', '五', '六']
    return `星期${weekDays[day]}`
}

module.exports = {
    getWeather
}
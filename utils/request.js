const app = getApp()
// 请求基础配置
const baseConfig = {
  baseURL: app.globalData.baseUrl, // 使用app.js中配置的baseURL
  timeout: 10000, // 超时时间
  header: {
    'content-type': 'application/json'
  }
}

// 请求拦截器
const requestInterceptor = (config) => {
  // 可以在这里添加token等认证信息
  const token = wx.getStorageSync('token')
  if (token) {
    config.header['Authorization'] = `Bearer ${token}`
  }
  return config
}

// 响应拦截器
const responseInterceptor = (response) => {
  const { statusCode, data } = response
  if (statusCode === 200) {
    // 这里可以根据后端返回的数据结构进行调整
    if(data.state == 'fail'){
      // 处理业务错误
      wx.showToast({
        title: data.msg || '请求失败',
        icon: 'none'
      })
      return Promise.reject(data)
    }else if(data.state == 'success'){
      return data.data
    }
  } else {
    // 处理HTTP错误
    wx.showToast({
      title: '网络错误',
      icon: 'none'
    })
    return Promise.reject(response)
  }
}

// 统一的请求方法
const request = (options) => {
  // 合并配置
  const config = {
    ...baseConfig,
    ...options,
    url: `${baseConfig.baseURL}${options.url}`
  }

  // 应用请求拦截器
  const finalConfig = requestInterceptor(config)

  return new Promise((resolve, reject) => {
    wx.request({
      ...finalConfig,
      success: (res) => {
        try {
          const result = responseInterceptor(res)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      },
      fail: (error) => {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
        reject(error)
      }
    })
  })
}

// 封装常用的请求方法
const http = {
  get(url, data = {}, options = {}) {
    return request({
      url,
      data,
      method: 'GET',
      ...options
    })
  },

  post(url, data = {}, options = {}) {
    return request({
      url,
      data,
      method: 'POST',
      ...options
    })
  },

  put(url, data = {}, options = {}) {
    return request({
      url,
      data,
      method: 'PUT',
      ...options
    })
  },

  delete(url, data = {}, options = {}) {
    return request({
      url,
      data,
      method: 'DELETE',
      ...options
    })
  }
}

module.exports = http 
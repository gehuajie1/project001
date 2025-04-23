const app = getApp();

// 请求基础配置
const baseConfig = {
  baseURL: app.globalData.baseUrl,
  timeout: 10000,
  header: {
    'content-type': 'application/json'
  }
};

// 错误处理函数
const handleError = (error, defaultMsg = '请求失败') => {
  const errorMsg = error.msg || error.errMsg || defaultMsg;
  wx.showToast({
    title: errorMsg,
    icon: 'none',
    duration: 2000
  });
  console.error('请求错误:', error);
  return Promise.reject(error);
};

// 请求拦截器
const requestInterceptor = (config) => {
  // 获取token
  const token = wx.getStorageSync('token')
  
  // 如果是登录接口，不添加token
  if (config.url.includes('/login')) {
    return config
  }
  
  // 添加请求头
  if (token) {
    config.header = {
      ...config.header,
      'Authorization': `Bearer ${token}`
    }
  }
  
  return config
}

// 响应拦截器
const responseInterceptor = (response) => {
  // 检查响应状态
  if (response.statusCode === 401) {
    // token过期，清除本地存储并跳转到登录页
    wx.removeStorageSync('token')
    wx.removeStorageSync('userId')
    wx.navigateTo({
      url: '/pages/login/login'
    })
    return Promise.reject(new Error('登录已过期，请重新登录'))
  }
  
  return response.data
}

// 封装请求方法
const request = (config) => {
  // 合并配置
  const mergedConfig = {
    ...config,
    url: config.url.startsWith('http') ? config.url : `${baseConfig.baseURL}${config.url}`,
    header: {
      'content-type': 'application/json',
      ...config.header
    }
  }
  
  // 应用请求拦截器
  const finalConfig = requestInterceptor(mergedConfig)
  
  return new Promise((resolve, reject) => {
    wx.request({
      ...finalConfig,
      success: (res) => {
        // 应用响应拦截器
        try {
          const data = responseInterceptor(res)
          resolve(data)
        } catch (error) {
          reject(error)
        }
      },
      fail: (error) => {
        console.error('请求失败:', error)
        reject(error)
      }
    })
  })
}

// 常用请求方法封装
const http = {
  get(url, data = {}, options = {}) {
    return request({ url, data, method: 'GET', ...options });
  },

  post(url, data = {}, options = {}) {
    return request({ url, data, method: 'POST', ...options });
  },

  put(url, data = {}, options = {}) {
    return request({ url, data, method: 'PUT', ...options });
  },

  delete(url, data = {}, options = {}) {
    return request({ url, data, method: 'DELETE', ...options });
  },

  // 添加上传文件方法
  upload(url, filePath, name = 'file', formData = {}, options = {}) {
    return new Promise((resolve, reject) => {
      const config = requestInterceptor({ url, ...options });
      wx.uploadFile({
        url: config.url,
        filePath,
        name,
        formData,
        header: config.header,
        success: (res) => {
          try {
            // 尝试解析返回的数据
            const data = JSON.parse(res.data);
            resolve(responseInterceptor({ ...res, data }));
          } catch (e) {
            resolve(res);
          }
        },
        fail: (err) => reject(handleError(err))
      });
    });
  }
};

module.exports = { request, http };
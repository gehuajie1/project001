module.exports = {
  // 小程序配置
  appId: 'wx123456789', // 替换为您的实际AppID
  appSecret: 'your_app_secret', // 替换为您的实际AppSecret
  
  // API配置
  baseUrl: 'https://api.example.com', // 替换为您的实际API地址
  apiVersion: 'v1',
  
  // 短信服务配置
  smsConfig: {
    provider: 'aliyun', // 阿里云短信服务
    accessKeyId: 'your_access_key_id',
    accessKeySecret: 'your_access_key_secret',
    signName: '情侣小程序',
    templateCode: 'SMS_123456789' // 替换为您的实际模板ID
  },
  
  // 天气服务配置
  weatherConfig: {
    provider: 'heweather', // 和风天气
    key: 'your_weather_key', // 替换为您的实际天气API密钥
    location: 'auto_ip' // 自动获取位置
  },
  
  // 云开发配置
  cloudConfig: {
    env: 'your-env-id', // 替换为您的实际环境ID
    traceUser: true
  },
  
  // 页面配置
  pages: {
    home: {
      title: '首页',
      path: '/pages/home/home'
    },
    function: {
      title: '功能',
      path: '/pages/function/function'
    },
    settings: {
      title: '设置',
      path: '/pages/settings/settings'
    },
    anniversary: {
      title: '纪念日',
      path: '/pages/anniversary/anniversary'
    },
    checkin: {
      title: '打卡',
      path: '/pages/checkin/checkin'
    },
    accounting: {
      title: '记账',
      path: '/pages/accounting/accounting'
    },
    wish: {
      title: '心愿',
      path: '/pages/wish/wish'
    },
    memo: {
      title: '备忘录',
      path: '/pages/memo/memo'
    }
  },
  
  // 主题配置
  theme: {
    primaryColor: '#ff4d4f',
    successColor: '#07c160',
    warningColor: '#ff976a',
    dangerColor: '#ee0a24',
    textColor: '#323233',
    activeColor: '#f2f3f5',
    backgroundColor: '#f7f8fa',
    borderColor: '#ebedf0'
  }
} 
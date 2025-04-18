const app = getApp()

Page({
  data: {
    currentDate: '',
    weekDay: '',
    weatherIcon: 'sunny',
    weatherText: '晴',
    temperature: '25',
    location: '正在获取位置...',
    loveDays: 0,
    baseUrl: app.globalData.baseUrl
  },

  onLoad: function() {
    this.updateDateTime();
    this.getLocation();
    this.calculateLoveDays();
    this.getWeather();
  },

  updateDateTime: function() {
    const now = new Date();
    const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    
    this.setData({
      currentDate: `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`,
      weekDay: weekDays[now.getDay()]
    });
  },

  getLocation: function() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        // 这里应该调用逆地理编码API获取具体位置
        this.setData({
          location: '中国'
        });
      },
      fail: () => {
        wx.showToast({
          title: '获取位置失败',
          icon: 'none'
        });
      }
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
  }
}); 
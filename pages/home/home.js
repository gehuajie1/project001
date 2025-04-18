const app = getApp()

Page({
  data: {
    userInfo: null,
    weatherInfo: null,
    anniversaryInfo: null,
    checkinList: [],
    accountingList: [],
    wishList: [],
    memoList: []
  },

  onLoad: function() {
    this.loadUserInfo()
    this.loadWeatherInfo()
    this.loadAnniversaryInfo()
    this.loadCheckinList()
    this.loadAccountingList()
    this.loadWishList()
    this.loadMemoList()
  },

  onShow: function() {
    // 每次显示页面时刷新数据
    this.loadCheckinList()
    this.loadAccountingList()
    this.loadWishList()
    this.loadMemoList()
  },

  // 加载用户信息
  loadUserInfo: function() {
    const userInfo = app.globalData.userInfo
    if (userInfo) {
      this.setData({ userInfo })
    } else {
      app.getUserInfo(userInfo => {
        this.setData({ userInfo })
      })
    }
  },

  // 加载天气信息
  loadWeatherInfo: function() {
    app.getWeatherInfo().then(weatherInfo => {
      this.setData({ weatherInfo })
    }).catch(err => {
      console.error('获取天气信息失败:', err)
    })
  },

  // 加载纪念日信息
  loadAnniversaryInfo: function() {
    // 模拟数据
    const anniversaryInfo = {
      days: 365,
      date: '2023-01-01',
      title: '在一起一周年'
    }
    this.setData({ anniversaryInfo })
  },

  // 加载打卡列表
  loadCheckinList: function() {
    // 模拟数据
    const checkinList = [
      {
        id: 1,
        icon: 'smile-o',
        title: '早安打卡',
        completed: true
      },
      {
        id: 2,
        icon: 'star-o',
        title: '晚安打卡',
        completed: false
      },
      {
        id: 3,
        icon: 'heart-o',
        title: '爱心打卡',
        completed: true
      }
    ]
    this.setData({ checkinList })
  },

  // 加载记账列表
  loadAccountingList: function() {
    // 模拟数据
    const accountingList = [
      {
        id: 1,
        title: '午餐',
        amount: 50,
        type: 'expense',
        date: '2023-01-01 12:00'
      },
      {
        id: 2,
        title: '工资',
        amount: 5000,
        type: 'income',
        date: '2023-01-01 09:00'
      },
      {
        id: 3,
        title: '电影票',
        amount: 80,
        type: 'expense',
        date: '2023-01-01 20:00'
      }
    ]
    this.setData({ accountingList })
  },

  // 加载心愿列表
  loadWishList: function() {
    // 模拟数据
    const wishList = [
      {
        id: 1,
        icon: 'gift-o',
        title: '一起去旅行',
        completed: false
      },
      {
        id: 2,
        icon: 'diamond-o',
        title: '买戒指',
        completed: true
      },
      {
        id: 3,
        icon: 'photo-o',
        title: '拍情侣照',
        completed: false
      }
    ]
    this.setData({ wishList })
  },

  // 加载备忘录列表
  loadMemoList: function() {
    // 模拟数据
    const memoList = [
      {
        id: 1,
        content: '记得买生日礼物',
        date: '2023-01-01'
      },
      {
        id: 2,
        content: '周末去看电影',
        date: '2023-01-02'
      },
      {
        id: 3,
        content: '准备情人节惊喜',
        date: '2023-01-03'
      }
    ]
    this.setData({ memoList })
  },

  // 跳转到详情页
  navigateToDetail: function(e) {
    const { type, id } = e.currentTarget.dataset
    const url = `/pages/${type}/${type}?id=${id}`
    wx.navigateTo({ url })
  }
}) 
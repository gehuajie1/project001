const app = getApp()

Page({
  data: {
    functionList: [
      {
        id: 1,
        type: 'anniversary',
        desc: '今天是个大日子',
        icon: 'calendar-o',
        color: '#ff4d4f'
      },
      {
        id: 2,
        type: 'checkin',
        desc: '去有风的地方',
        icon: 'location-o',
        color: '#07c160'
      },
      {
        id: 3,
        type: 'accounting',
        desc: '实现财务自由',
        icon: 'balance-o',
        color: '#1989fa'
      },
      {
        id: 4,
        type: 'wish',
        desc: '一起许个愿吧',
        icon: 'gift-o',
        color: '#ff976a'
      },
      {
        id: 5,
        type: 'memo',
        desc: '得备注一下',
        icon: 'notes-o',
        color: '#7232dd'
      },
      {
        id: 6,
        type: 'album',
        desc: '记录美好瞬间',
        icon: 'photo-o',
        color: '#ee0a24'
      }
    ],
    userInfo: null,
    currentDate: ''
  },

  onLoad: function() {
    this.loadUserInfo()
    this.updateDate()
  },

  onShow: function() {
    this.loadUserInfo()
    this.updateDate()
  },

  onHide: function() {
    // 页面隐藏时的逻辑
  },

  onUnload: function() {
    // 页面卸载时的逻辑
  },

  // 更新日期显示
  updateDate: function() {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const week = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]
    this.setData({
      currentDate: `${year}年${month}月${day}日 星期${week}`
    })
  },

  // 加载用户信息
  loadUserInfo: function() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        userInfo: userInfo
      })
    }
  },

  // 跳转到对应功能页面
  navigateTo: function(e) {
    const type = e.currentTarget.dataset.type
    let url = ''
    
    switch(type) {
      case 'anniversary':
        url = '/pages/anniversary/anniversary'
        break
      case 'checkin':
        url = '/pages/checkin/checkin'
        break
      case 'accounting':
        url = '/pages/accounting/accounting'
        break
      case 'wish':
        url = '/pages/wish/wish'
        break
      case 'memo':
        url = '/pages/memo/memo'
        break
      case 'album':
        url = '/pages/album/album'
        break
    }
    
    if (url) {
      wx.navigateTo({
        url: url
      })
    }
  }
}); 
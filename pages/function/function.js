const app = getApp()

Page({
  data: {
    baseUrl: app.globalData.baseUrl,
    // 功能模块列表
    functionList: [
      {
        id: 1,
        type: 'anniversary',
        title: '纪念日',
        desc: '记录重要日期，设置提醒',
        icon: 'calendar-o',
        color: '#ff4d4f'
      },
      {
        id: 2,
        type: 'checkin',
        title: '打卡',
        desc: '每日打卡，记录生活点滴',
        icon: 'checked',
        color: '#07c160'
      },
      {
        id: 3,
        type: 'accounting',
        title: '记账',
        desc: '记录收支，管理财务',
        icon: 'balance-o',
        color: '#1989fa'
      },
      {
        id: 4,
        type: 'wish',
        title: '心愿',
        desc: '记录心愿，一起实现',
        icon: 'gift-o',
        color: '#ff976a'
      },
      {
        id: 5,
        type: 'memo',
        title: '备忘录',
        desc: '记录重要事项，设置提醒',
        icon: 'notes-o',
        color: '#7232dd'
      },
      {
        id: 6,
        type: 'album',
        title: '相册',
        desc: '记录美好瞬间，珍藏回忆',
        icon: 'photo-o',
        color: '#ee0a24'
      },
      {
        id: 7,
        type: 'chat',
        title: '聊天',
        desc: '私密聊天，记录甜蜜',
        icon: 'chat-o',
        color: '#07c160'
      },
      {
        id: 8,
        type: 'location',
        title: '位置',
        desc: '实时位置，随时找到你',
        icon: 'location-o',
        color: '#1989fa'
      }
    ]
  },

  onLoad: function() {
    // 页面加载时的逻辑
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

  navigateToAccounting: function() {
    wx.navigateTo({
      url: '/pages/accounting/accounting'
    });
  },

  navigateToWish: function() {
    wx.navigateTo({
      url: '/pages/wish/wish'
    });
  },

  navigateToMemo: function() {
    wx.navigateTo({
      url: '/pages/memo/memo'
    });
  },

  // 跳转到对应功能页面
  navigateTo: function(e) {
    const { type } = e.currentTarget.dataset
    const url = `/pages/${type}/${type}`
    wx.navigateTo({ url })
  }
}); 
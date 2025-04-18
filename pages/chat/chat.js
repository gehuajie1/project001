const app = getApp()

Page({
  data: {
    chats: [],
    showAddPopup: false,
    form: {
      name: '',
      description: '',
      avatar: ''
    }
  },

  onLoad() {
    this.loadChats()
  },

  // 加载聊天列表
  loadChats() {
    // 模拟数据
    const mockChats = [
      {
        id: 1,
        name: '家人群',
        avatar: '/images/avatar1.png',
        lastMessage: '好的，我知道了',
        time: '12:30',
        unread: 3
      },
      {
        id: 2,
        name: '同学群',
        avatar: '/images/avatar2.png',
        lastMessage: '明天见',
        time: '昨天',
        unread: 0
      },
      {
        id: 3,
        name: '工作群',
        avatar: '/images/avatar3.png',
        lastMessage: '项目进度如何？',
        time: '周一',
        unread: 1
      }
    ]
    this.setData({ chats: mockChats })
  },

  // 打开聊天
  openChat(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/chat/detail/detail?id=${id}`
    })
  },

  // 显示添加弹窗
  showAdd() {
    this.setData({ showAddPopup: true })
  },

  // 隐藏添加弹窗
  hideAdd() {
    this.setData({ showAddPopup: false })
  },

  // 选择头像
  chooseAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          'form.avatar': res.tempFilePaths[0]
        })
      }
    })
  },

  // 表单输入
  onInput(e) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [`form.${field}`]: e.detail
    })
  },

  // 提交表单
  submitForm() {
    const { name, description, avatar } = this.data.form
    if (!name) {
      wx.showToast({
        title: '请输入聊天名称',
        icon: 'none'
      })
      return
    }

    // 模拟添加新聊天
    const newChat = {
      id: Date.now(),
      name,
      avatar: avatar || '/images/default-avatar.png',
      lastMessage: '',
      time: '刚刚',
      unread: 0
    }

    this.setData({
      chats: [newChat, ...this.data.chats],
      showAddPopup: false,
      form: {
        name: '',
        description: '',
        avatar: ''
      }
    })

    wx.showToast({
      title: '创建成功',
      icon: 'success'
    })
  }
}) 
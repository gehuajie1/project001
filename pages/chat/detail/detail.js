const app = getApp()

Page({
  data: {
    chatInfo: {},
    messages: [],
    inputMessage: '',
    scrollToView: ''
  },

  onLoad(options) {
    const { id } = options
    this.loadChatInfo(id)
    this.loadMessages(id)
  },

  // 加载聊天信息
  loadChatInfo(id) {
    // 模拟数据
    const mockChatInfo = {
      id: 1,
      name: '家人群',
      avatar: '/images/avatar1.png'
    }
    this.setData({ chatInfo: mockChatInfo })
  },

  // 加载消息列表
  loadMessages(id) {
    // 模拟数据
    const mockMessages = [
      {
        id: 1,
        content: '你好啊',
        time: '12:30',
        avatar: '/images/avatar2.png',
        isSelf: false
      },
      {
        id: 2,
        content: '你好',
        time: '12:31',
        avatar: '/images/avatar1.png',
        isSelf: true
      },
      {
        id: 3,
        content: '最近怎么样？',
        time: '12:32',
        avatar: '/images/avatar2.png',
        isSelf: false
      }
    ]
    this.setData({ messages: mockMessages })
  },

  // 返回上一页
  goBack() {
    wx.navigateBack()
  },

  // 输入消息
  onInput(e) {
    this.setData({
      inputMessage: e.detail
    })
  },

  // 选择图片
  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // 处理图片上传
        console.log('选择图片：', res.tempFilePaths[0])
      }
    })
  },

  // 发送消息
  sendMessage() {
    const { inputMessage, messages } = this.data
    if (!inputMessage.trim()) {
      wx.showToast({
        title: '请输入消息内容',
        icon: 'none'
      })
      return
    }

    const newMessage = {
      id: Date.now(),
      content: inputMessage,
      time: this.formatTime(new Date()),
      avatar: '/images/avatar1.png',
      isSelf: true
    }

    this.setData({
      messages: [...messages, newMessage],
      inputMessage: '',
      scrollToView: `message-${newMessage.id}`
    })

    // 模拟回复
    setTimeout(() => {
      const replyMessage = {
        id: Date.now() + 1,
        content: '收到消息了',
        time: this.formatTime(new Date()),
        avatar: '/images/avatar2.png',
        isSelf: false
      }
      this.setData({
        messages: [...this.data.messages, replyMessage],
        scrollToView: `message-${replyMessage.id}`
      })
    }, 1000)
  },

  // 格式化时间
  formatTime(date) {
    const hour = date.getHours().toString().padStart(2, '0')
    const minute = date.getMinutes().toString().padStart(2, '0')
    return `${hour}:${minute}`
  }
}) 
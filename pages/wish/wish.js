const app = getApp()

Page({
  data: {
    stats: {
      total: 0,
      completed: 0,
      progress: 0
    },
    wishes: [],
    showAddPopup: false,
    showDetailPopup: false,
    showPriorityPicker: false,
    showDatePicker: false,
    form: {
      title: '',
      description: '',
      priority: '',
      priorityText: '',
      targetDate: ''
    },
    currentWish: null,
    priorityOptions: ['高优先级', '中优先级', '低优先级'],
    currentDate: new Date().getTime(),
    minDate: new Date().getTime(),
    canvasWidth: 0,
    canvasHeight: 0
  },

  onLoad() {
    this.loadWishes()
    this.initCanvas()
    
    // 添加点击事件监听
    const query = wx.createSelectorQuery()
    query.select('#wishTree')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node
        canvas.addEventListener('touchstart', (e) => {
          const touch = e.touches[0]
          const rect = canvas.getBoundingClientRect()
          const x = touch.clientX - rect.left
          const y = touch.clientY - rect.top
          
          // 检查是否点击到礼物盒
          const wish = this.data.wishes.find(wish => {
            const distance = Math.sqrt(
              Math.pow(x - wish.boxX, 2) + 
              Math.pow(y - wish.boxY, 2)
            )
            return distance < wish.boxSize
          })
          
          if (wish) {
            this.showDetail({ currentTarget: { dataset: { id: wish.id } } })
          }
        })
      })
  },

  // 初始化画布
  async initCanvas() {
    const query = wx.createSelectorQuery()
    query.select('#wishTree')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        
        // 设置画布大小
        const dpr = wx.getSystemInfoSync().pixelRatio
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        ctx.scale(dpr, dpr)
        
        this.setData({
          canvasWidth: res[0].width,
          canvasHeight: res[0].height
        })
        
        this.drawWishTree(ctx)
      })
  },

  // 绘制许愿树
  drawWishTree(ctx) {
    const { canvasWidth, canvasHeight, wishes } = this.data
    
    // 清空画布
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    
    // 绘制树干
    ctx.beginPath()
    ctx.fillStyle = '#8B4513'
    ctx.moveTo(canvasWidth / 2 - 20, canvasHeight)
    ctx.lineTo(canvasWidth / 2 + 20, canvasHeight)
    ctx.lineTo(canvasWidth / 2 + 10, canvasHeight * 0.6)
    ctx.lineTo(canvasWidth / 2 - 10, canvasHeight * 0.6)
    ctx.closePath()
    ctx.fill()
    
    // 绘制树冠
    ctx.beginPath()
    ctx.fillStyle = '#228B22'
    ctx.moveTo(canvasWidth / 2, canvasHeight * 0.2)
    ctx.quadraticCurveTo(
      canvasWidth * 0.8, canvasHeight * 0.3,
      canvasWidth * 0.7, canvasHeight * 0.6
    )
    ctx.quadraticCurveTo(
      canvasWidth * 0.9, canvasHeight * 0.7,
      canvasWidth * 0.6, canvasHeight * 0.8
    )
    ctx.quadraticCurveTo(
      canvasWidth * 0.8, canvasHeight * 0.9,
      canvasWidth * 0.5, canvasHeight * 0.9
    )
    ctx.quadraticCurveTo(
      canvasWidth * 0.2, canvasHeight * 0.9,
      canvasWidth * 0.4, canvasHeight * 0.8
    )
    ctx.quadraticCurveTo(
      canvasWidth * 0.1, canvasHeight * 0.7,
      canvasWidth * 0.3, canvasHeight * 0.6
    )
    ctx.quadraticCurveTo(
      canvasWidth * 0.2, canvasHeight * 0.3,
      canvasWidth / 2, canvasHeight * 0.2
    )
    ctx.closePath()
    ctx.fill()
    
    // 绘制礼物盒
    const boxSize = 30
    const boxSpacing = 40
    const startX = canvasWidth * 0.2
    const startY = canvasHeight * 0.3
    const maxBoxesPerRow = 4
    
    wishes.forEach((wish, index) => {
      const row = Math.floor(index / maxBoxesPerRow)
      const col = index % maxBoxesPerRow
      const x = startX + col * boxSpacing
      const y = startY + row * boxSpacing
      
      // 礼物盒主体
      ctx.beginPath()
      ctx.fillStyle = wish.status === 'completed' ? '#FF69B4' : '#FFB6C1'
      ctx.fillRect(x - boxSize/2, y - boxSize/2, boxSize, boxSize)
      
      // 礼物盒盖子
      ctx.beginPath()
      ctx.fillStyle = wish.status === 'completed' ? '#FF1493' : '#FF69B4'
      ctx.fillRect(x - boxSize/2, y - boxSize/2 - 5, boxSize, 5)
      
      // 礼物盒丝带
      ctx.beginPath()
      ctx.strokeStyle = '#FFFFFF'
      ctx.lineWidth = 2
      ctx.moveTo(x - boxSize/2, y)
      ctx.lineTo(x + boxSize/2, y)
      ctx.moveTo(x, y - boxSize/2)
      ctx.lineTo(x, y + boxSize/2)
      ctx.stroke()
      
      // 如果愿望已完成，绘制打开的礼物盒
      if (wish.status === 'completed') {
        ctx.beginPath()
        ctx.fillStyle = '#FFD700'
        ctx.arc(x, y, 10, 0, Math.PI * 2)
        ctx.fill()
      }
      
      // 保存礼物盒的位置信息
      wish.boxX = x
      wish.boxY = y
      wish.boxSize = boxSize
    })
  },

  // 加载愿望列表
  loadWishes() {
    // 模拟数据
    const mockWishes = [
      {
        id: 1,
        title: '学习英语',
        description: '每天坚持学习英语30分钟，提高听说读写能力',
        priority: 'high',
        createTime: '2024-01-01',
        targetDate: '2024-12-31',
        progress: 30,
        status: 'in_progress'
      },
      {
        id: 2,
        title: '健身计划',
        description: '每周健身3次，每次1小时',
        priority: 'medium',
        createTime: '2024-01-15',
        targetDate: '2024-06-30',
        progress: 60,
        status: 'in_progress'
      },
      {
        id: 3,
        title: '阅读计划',
        description: '每月阅读2本书',
        priority: 'low',
        createTime: '2024-02-01',
        targetDate: '2024-12-31',
        progress: 100,
        status: 'completed'
      }
    ]

    // 计算统计数据
    const total = mockWishes.length
    const completed = mockWishes.filter(item => item.status === 'completed').length
    const progress = Math.round((completed / total) * 100)

    this.setData({
      wishes: mockWishes,
      stats: {
        total,
        completed,
        progress
      }
    }, () => {
      // 重新绘制许愿树
      this.initCanvas()
    })
  },

  // 显示添加弹窗
  showAdd() {
    this.setData({
      showAddPopup: true,
      form: {
        title: '',
        description: '',
        priority: '',
        priorityText: '',
        targetDate: ''
      }
    })
  },

  // 隐藏添加弹窗
  hideAdd() {
    this.setData({ showAddPopup: false })
  },

  // 显示详情弹窗
  showDetail(e) {
    const { id } = e.currentTarget.dataset
    const wish = this.data.wishes.find(item => item.id === id)
    this.setData({
      showDetailPopup: true,
      currentWish: wish
    })
  },

  // 隐藏详情弹窗
  hideDetail() {
    this.setData({ showDetailPopup: false })
  },

  // 显示优先级选择器
  showPriorityPicker() {
    this.setData({ showPriorityPicker: true })
  },

  // 隐藏优先级选择器
  hidePriorityPicker() {
    this.setData({ showPriorityPicker: false })
  },

  // 确认优先级选择
  onPriorityConfirm(e) {
    const { value } = e.detail
    const priorityMap = {
      '高优先级': 'high',
      '中优先级': 'medium',
      '低优先级': 'low'
    }
    this.setData({
      'form.priority': priorityMap[value],
      'form.priorityText': value,
      showPriorityPicker: false
    })
  },

  // 显示日期选择器
  showDatePicker() {
    this.setData({ showDatePicker: true })
  },

  // 隐藏日期选择器
  hideDatePicker() {
    this.setData({ showDatePicker: false })
  },

  // 确认日期选择
  onDateConfirm(e) {
    const date = new Date(e.detail)
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    this.setData({
      'form.targetDate': formattedDate,
      showDatePicker: false
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
    const { title, description, priority, targetDate } = this.data.form
    if (!title) {
      wx.showToast({
        title: '请输入愿望标题',
        icon: 'none'
      })
      return
    }

    if (!priority) {
      wx.showToast({
        title: '请选择优先级',
        icon: 'none'
      })
      return
    }

    if (!targetDate) {
      wx.showToast({
        title: '请选择目标日期',
        icon: 'none'
      })
      return
    }

    // 模拟添加新愿望
    const newWish = {
      id: Date.now(),
      title,
      description,
      priority,
      createTime: this.formatDate(new Date()),
      targetDate,
      progress: 0,
      status: 'in_progress'
    }

    this.setData({
      wishes: [newWish, ...this.data.wishes],
      showAddPopup: false,
      stats: {
        total: this.data.stats.total + 1,
        completed: this.data.stats.completed,
        progress: Math.round((this.data.stats.completed / (this.data.stats.total + 1)) * 100)
      }
    }, () => {
      // 重新绘制许愿树
      this.initCanvas()
    })

    wx.showToast({
      title: '添加成功',
      icon: 'success'
    })
  },

  // 删除愿望
  deleteWish() {
    wx.showModal({
      title: '提示',
      content: '确定要删除这个愿望吗？',
      success: (res) => {
        if (res.confirm) {
          const { currentWish } = this.data
          const wishes = this.data.wishes.filter(item => item.id !== currentWish.id)
          const completed = wishes.filter(item => item.status === 'completed').length
          
          this.setData({
            wishes,
            showDetailPopup: false,
            stats: {
              total: wishes.length,
              completed,
              progress: Math.round((completed / wishes.length) * 100)
            }
          }, () => {
            // 重新绘制许愿树
            this.initCanvas()
          })

          wx.showToast({
            title: '删除成功',
            icon: 'success'
          })
        }
      }
    })
  },

  // 格式化日期
  formatDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }
}) 
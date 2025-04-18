const app = getApp()

Page({
  data: {
    // 统计数据
    totalAnniversaries: 0,
    upcomingDays: 0,
    
    // 纪念日列表
    anniversaryList: [],
    
    // 添加纪念日表单
    form: {
      title: '',
      date: '',
      description: '',
      isYearly: true,
      isImportant: false
    },
    
    // 弹窗控制
    showAdd: false,
    showDatePicker: false,
    showDetail: false,
    
    // 日期选择器
    currentDate: new Date().getTime(),
    minDate: new Date(2000, 0, 1).getTime(),
    maxDate: new Date(2100, 11, 31).getTime(),
    
    // 当前选中的纪念日
    currentAnniversary: null
  },

  onLoad: function() {
    this.loadAnniversaryList()
  },

  onShow: function() {
    this.loadAnniversaryList()
  },

  // 加载纪念日列表
  loadAnniversaryList: function() {
    // 模拟数据
    const anniversaryList = [
      {
        id: 1,
        title: '恋爱纪念日',
        date: '2023-01-01',
        description: '我们在一起的第一天',
        days: 365,
        isYearly: true,
        isImportant: true
      },
      {
        id: 2,
        title: '第一次约会',
        date: '2023-02-14',
        description: '情人节第一次约会',
        days: 280,
        isYearly: true,
        isImportant: true
      },
      {
        id: 3,
        title: '生日',
        date: '2023-05-20',
        description: '亲爱的生日快乐',
        days: 100,
        isYearly: true,
        isImportant: true
      }
    ]
    
    this.setData({
      anniversaryList,
      totalAnniversaries: anniversaryList.length,
      upcomingDays: this.getUpcomingDays(anniversaryList)
    })
  },

  // 获取最近纪念日天数
  getUpcomingDays: function(list) {
    if (!list || list.length === 0) return 0
    const today = new Date()
    const upcoming = list.reduce((min, item) => {
      const date = new Date(item.date)
      const days = Math.ceil((date - today) / (1000 * 60 * 60 * 24))
      return days > 0 ? Math.min(min, days) : min
    }, Infinity)
    return upcoming === Infinity ? 0 : upcoming
  },

  // 显示添加弹窗
  showAddPopup: function() {
    this.setData({
      showAdd: true,
      form: {
        title: '',
        date: '',
        description: '',
        isYearly: true,
        isImportant: false
      }
    })
  },

  // 隐藏添加弹窗
  hideAddPopup: function() {
    this.setData({ showAdd: false })
  },

  // 显示日期选择器
  showDatePicker: function() {
    this.setData({ showDatePicker: true })
  },

  // 隐藏日期选择器
  hideDatePicker: function() {
    this.setData({ showDatePicker: false })
  },

  // 日期选择确认
  onDateConfirm: function(e) {
    const date = new Date(e.detail)
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    this.setData({
      'form.date': formattedDate,
      showDatePicker: false
    })
  },

  // 表单输入处理
  onTitleChange: function(e) {
    this.setData({ 'form.title': e.detail })
  },

  onDescriptionChange: function(e) {
    this.setData({ 'form.description': e.detail })
  },

  onYearlyChange: function(e) {
    this.setData({ 'form.isYearly': e.detail })
  },

  onImportantChange: function(e) {
    this.setData({ 'form.isImportant': e.detail })
  },

  // 提交表单
  submitForm: function() {
    const { title, date, description } = this.data.form
    if (!title || !date) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return
    }

    // 模拟添加纪念日
    const newAnniversary = {
      id: Date.now(),
      ...this.data.form,
      days: this.calculateDays(date)
    }

    this.setData({
      anniversaryList: [...this.data.anniversaryList, newAnniversary],
      totalAnniversaries: this.data.totalAnniversaries + 1,
      upcomingDays: this.getUpcomingDays([...this.data.anniversaryList, newAnniversary]),
      showAdd: false
    })

    wx.showToast({
      title: '添加成功',
      icon: 'success'
    })
  },

  // 计算距离天数
  calculateDays: function(dateStr) {
    const today = new Date()
    const date = new Date(dateStr)
    const days = Math.ceil((date - today) / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 0
  },

  // 显示纪念日详情
  showDetail: function(e) {
    const { id } = e.currentTarget.dataset
    const anniversary = this.data.anniversaryList.find(item => item.id === id)
    if (anniversary) {
      this.setData({
        currentAnniversary: anniversary,
        showDetail: true
      })
    }
  },

  // 隐藏纪念日详情
  hideDetail: function() {
    this.setData({ showDetail: false })
  },

  // 删除纪念日
  deleteAnniversary: function() {
    const { currentAnniversary } = this.data
    if (!currentAnniversary) return

    wx.showModal({
      title: '提示',
      content: '确定要删除这个纪念日吗？',
      success: (res) => {
        if (res.confirm) {
          const newList = this.data.anniversaryList.filter(item => item.id !== currentAnniversary.id)
          this.setData({
            anniversaryList: newList,
            totalAnniversaries: newList.length,
            upcomingDays: this.getUpcomingDays(newList),
            showDetail: false
          })

          wx.showToast({
            title: '删除成功',
            icon: 'success'
          })
        }
      }
    })
  }
}) 
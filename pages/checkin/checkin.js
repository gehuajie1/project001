const app = getApp()

Page({
  data: {
    // 统计数据
    totalDays: 0,
    continuousDays: 0,
    completionRate: 0,
    
    // 日历数据
    weekdays: ['日', '一', '二', '三', '四', '五', '六'],
    currentMonth: '',
    days: [],
    
    // 打卡记录
    records: [],
    
    // 添加记录表单
    form: {
      title: '',
      content: '',
      images: []
    },
    
    // 弹窗控制
    showAdd: false,
    
    // 当前选中的日期
    currentDate: new Date()
  },

  onLoad: function() {
    this.initCalendar()
    this.loadCheckinData()
  },

  // 初始化日历
  initCalendar: function() {
    const date = new Date()
    this.setData({
      currentDate: date,
      currentMonth: `${date.getFullYear()}年${date.getMonth() + 1}月`
    })
    this.generateCalendarDays(date)
  },

  // 生成日历天数
  generateCalendarDays: function(date) {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const firstDayWeek = firstDay.getDay()
    const totalDays = lastDay.getDate()
    
    const days = []
    const today = new Date()
    
    // 添加上个月的日期
    for (let i = 0; i < firstDayWeek; i++) {
      const prevDate = new Date(year, month, -i)
      days.unshift({
        date: this.formatDate(prevDate),
        day: prevDate.getDate(),
        isCurrentMonth: false,
        isToday: false,
        isChecked: this.isDateChecked(prevDate)
      })
    }
    
    // 添加当前月的日期
    for (let i = 1; i <= totalDays; i++) {
      const currentDate = new Date(year, month, i)
      days.push({
        date: this.formatDate(currentDate),
        day: i,
        isCurrentMonth: true,
        isToday: this.isSameDay(currentDate, today),
        isChecked: this.isDateChecked(currentDate)
      })
    }
    
    // 添加下个月的日期
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i)
      days.push({
        date: this.formatDate(nextDate),
        day: i,
        isCurrentMonth: false,
        isToday: false,
        isChecked: this.isDateChecked(nextDate)
      })
    }
    
    this.setData({ days })
  },

  // 格式化日期
  formatDate: function(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  },

  // 判断是否是同一天
  isSameDay: function(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate()
  },

  // 判断日期是否已打卡
  isDateChecked: function(date) {
    // 这里应该从服务器获取打卡数据
    // 模拟数据
    const checkedDates = ['2024-03-01', '2024-03-02', '2024-03-03']
    return checkedDates.includes(this.formatDate(date))
  },

  // 加载打卡数据
  loadCheckinData: function() {
    // 模拟数据
    const mockData = {
      totalDays: 30,
      continuousDays: 3,
      completionRate: 80,
      records: [
        {
          id: 1,
          title: '早起打卡',
          time: '2024-03-01 07:00',
          content: '今天又是元气满满的一天！',
          images: []
        },
        {
          id: 2,
          title: '运动打卡',
          time: '2024-03-02 18:30',
          content: '跑步5公里，感觉身体更健康了！',
          images: ['https://example.com/image1.jpg']
        }
      ]
    }
    
    this.setData({
      totalDays: mockData.totalDays,
      continuousDays: mockData.continuousDays,
      completionRate: mockData.completionRate,
      records: mockData.records
    })
  },

  // 上个月
  prevMonth: function() {
    const date = new Date(this.data.currentDate)
    date.setMonth(date.getMonth() - 1)
    this.setData({
      currentDate: date,
      currentMonth: `${date.getFullYear()}年${date.getMonth() + 1}月`
    })
    this.generateCalendarDays(date)
  },

  // 下个月
  nextMonth: function() {
    const date = new Date(this.data.currentDate)
    date.setMonth(date.getMonth() + 1)
    this.setData({
      currentDate: date,
      currentMonth: `${date.getFullYear()}年${date.getMonth() + 1}月`
    })
    this.generateCalendarDays(date)
  },

  // 点击日期
  handleDayClick: function(e) {
    const { date } = e.currentTarget.dataset
    // 这里可以添加点击日期的处理逻辑
    console.log('点击日期：', date)
  },

  // 显示添加记录弹窗
  showAddRecord: function() {
    this.setData({
      showAdd: true,
      form: {
        title: '',
        content: '',
        images: []
      }
    })
  },

  // 隐藏添加记录弹窗
  hideAddPopup: function() {
    this.setData({ showAdd: false })
  },

  // 表单输入处理
  onTitleChange: function(e) {
    this.setData({ 'form.title': e.detail })
  },

  onContentChange: function(e) {
    this.setData({ 'form.content': e.detail })
  },

  // 选择图片
  chooseImage: function() {
    wx.chooseImage({
      count: 9 - this.data.form.images.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          'form.images': [...this.data.form.images, ...res.tempFilePaths]
        })
      }
    })
  },

  // 删除图片
  removeImage: function(e) {
    const { index } = e.currentTarget.dataset
    const images = [...this.data.form.images]
    images.splice(index, 1)
    this.setData({ 'form.images': images })
  },

  // 预览图片
  previewImage: function(e) {
    const { urls, current } = e.currentTarget.dataset
    wx.previewImage({
      urls,
      current
    })
  },

  // 提交表单
  submitForm: function() {
    const { title, content } = this.data.form
    if (!title || !content) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return
    }

    // 模拟添加记录
    const newRecord = {
      id: Date.now(),
      title,
      time: new Date().toLocaleString(),
      content,
      images: this.data.form.images
    }

    this.setData({
      records: [newRecord, ...this.data.records],
      showAdd: false
    })

    wx.showToast({
      title: '添加成功',
      icon: 'success'
    })
  }
}) 
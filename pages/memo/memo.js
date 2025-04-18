const app = getApp()

Page({
  data: {
    stats: {
      total: 0,
      completed: 0,
      progress: 0
    },
    memos: [],
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
    currentMemo: null,
    priorityOptions: ['高优先级', '中优先级', '低优先级'],
    currentDate: new Date().getTime(),
    minDate: new Date().getTime()
  },

  onLoad() {
    this.loadMemos()
  },

  // 加载备忘录列表
  loadMemos() {
    // 模拟数据
    const mockMemos = [
      {
        id: 1,
        title: '完成项目报告',
        description: '需要完成项目进度报告，包括本周的工作总结和下周的计划',
        priority: 'high',
        priorityText: '高优先级',
        createTime: '2024-01-01',
        targetDate: '2024-01-15',
        status: 'in_progress'
      },
      {
        id: 2,
        title: '购买生日礼物',
        description: '为朋友挑选生日礼物，预算500元以内',
        priority: 'medium',
        priorityText: '中优先级',
        createTime: '2024-01-05',
        targetDate: '2024-01-20',
        status: 'in_progress'
      },
      {
        id: 3,
        title: '整理房间',
        description: '整理卧室和书房，清理不需要的物品',
        priority: 'low',
        priorityText: '低优先级',
        createTime: '2024-01-10',
        targetDate: '2024-01-25',
        status: 'completed'
      }
    ]

    // 计算统计数据
    const total = mockMemos.length
    const completed = mockMemos.filter(item => item.status === 'completed').length
    const progress = Math.round((completed / total) * 100)

    this.setData({
      memos: mockMemos,
      stats: {
        total,
        completed,
        progress
      }
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
    const memo = this.data.memos.find(item => item.id === id)
    this.setData({
      showDetailPopup: true,
      currentMemo: memo
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
        title: '请输入备忘录标题',
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

    // 模拟添加新备忘录
    const newMemo = {
      id: Date.now(),
      title,
      description,
      priority,
      priorityText: this.data.form.priorityText,
      createTime: this.formatDate(new Date()),
      targetDate,
      status: 'in_progress'
    }

    this.setData({
      memos: [newMemo, ...this.data.memos],
      showAddPopup: false,
      stats: {
        total: this.data.stats.total + 1,
        completed: this.data.stats.completed,
        progress: Math.round((this.data.stats.completed / (this.data.stats.total + 1)) * 100)
      }
    })

    wx.showToast({
      title: '添加成功',
      icon: 'success'
    })
  },

  // 删除备忘录
  deleteMemo() {
    wx.showModal({
      title: '提示',
      content: '确定要删除这个备忘录吗？',
      success: (res) => {
        if (res.confirm) {
          const { currentMemo } = this.data
          const memos = this.data.memos.filter(item => item.id !== currentMemo.id)
          const completed = memos.filter(item => item.status === 'completed').length
          
          this.setData({
            memos,
            showDetailPopup: false,
            stats: {
              total: memos.length,
              completed,
              progress: Math.round((completed / memos.length) * 100)
            }
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
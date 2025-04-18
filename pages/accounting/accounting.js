const app = getApp()

Page({
  data: {
    // 统计数据
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    
    // 当前类型
    currentType: 'expense',
    
    // 表单数据
    form: {
      amount: '',
      category: '',
      date: '',
      remark: ''
    },
    
    // 分类数据
    categories: [
      { id: 1, name: '餐饮', type: 'expense' },
      { id: 2, name: '交通', type: 'expense' },
      { id: 3, name: '购物', type: 'expense' },
      { id: 4, name: '娱乐', type: 'expense' },
      { id: 5, name: '工资', type: 'income' },
      { id: 6, name: '奖金', type: 'income' },
      { id: 7, name: '兼职', type: 'income' },
      { id: 8, name: '其他', type: 'both' }
    ],
    
    // 记录列表
    records: [],
    
    // 弹窗控制
    showCategory: false,
    showDate: false,
    
    // 日期选择器
    currentDate: new Date().getTime(),
    minDate: new Date(2000, 0, 1).getTime(),
    maxDate: new Date(2100, 11, 31).getTime()
  },

  onLoad: function() {
    this.loadAccountingData()
  },

  // 加载记账数据
  loadAccountingData: function() {
    // 模拟数据
    const mockData = {
      totalIncome: 10000,
      totalExpense: 5000,
      balance: 5000,
      records: [
        {
          id: 1,
          type: 'expense',
          amount: 50,
          category: '餐饮',
          date: '2024-03-01',
          remark: '午餐'
        },
        {
          id: 2,
          type: 'income',
          amount: 10000,
          category: '工资',
          date: '2024-03-01',
          remark: '本月工资'
        },
        {
          id: 3,
          type: 'expense',
          amount: 200,
          category: '购物',
          date: '2024-03-02',
          remark: '日用品'
        }
      ]
    }
    
    this.setData({
      totalIncome: mockData.totalIncome,
      totalExpense: mockData.totalExpense,
      balance: mockData.balance,
      records: mockData.records
    })
  },

  // 切换收支类型
  switchType: function(e) {
    const type = e.currentTarget.dataset.type
    this.setData({
      currentType: type,
      'form.category': ''
    })
  },

  // 显示分类选择器
  showCategoryPicker: function() {
    this.setData({ showCategory: true })
  },

  // 隐藏分类选择器
  hideCategoryPicker: function() {
    this.setData({ showCategory: false })
  },

  // 选择分类
  selectCategory: function(e) {
    const category = e.currentTarget.dataset.category
    this.setData({
      'form.category': category,
      showCategory: false
    })
  },

  // 显示日期选择器
  showDatePicker: function() {
    this.setData({ showDate: true })
  },

  // 隐藏日期选择器
  hideDatePicker: function() {
    this.setData({ showDate: false })
  },

  // 日期选择确认
  onDateConfirm: function(e) {
    const date = new Date(e.detail)
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    this.setData({
      'form.date': formattedDate,
      showDate: false
    })
  },

  // 表单输入处理
  onAmountChange: function(e) {
    this.setData({ 'form.amount': e.detail })
  },

  onRemarkChange: function(e) {
    this.setData({ 'form.remark': e.detail })
  },

  // 添加记录
  addRecord: function() {
    const { amount, category, date, remark } = this.data.form
    if (!amount || !category || !date) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return
    }

    // 模拟添加记录
    const newRecord = {
      id: Date.now(),
      type: this.data.currentType,
      amount: parseFloat(amount),
      category,
      date,
      remark
    }

    // 更新统计数据
    const totalIncome = this.data.totalIncome + (this.data.currentType === 'income' ? parseFloat(amount) : 0)
    const totalExpense = this.data.totalExpense + (this.data.currentType === 'expense' ? parseFloat(amount) : 0)
    const balance = totalIncome - totalExpense

    this.setData({
      records: [newRecord, ...this.data.records],
      totalIncome,
      totalExpense,
      balance,
      form: {
        amount: '',
        category: '',
        date: '',
        remark: ''
      }
    })

    wx.showToast({
      title: '添加成功',
      icon: 'success'
    })
  }
}) 
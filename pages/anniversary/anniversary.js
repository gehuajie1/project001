const app = getApp()
const { request,http } = require('../../utils/request')

Page({
  data: {
    // 统计数据
    totalAnniversaries: 0,
    upcomingDays: 0,
    
    // 纪念日列表
    anniversaryList: [],
    
    // 添加纪念日表单
    form: {
      name: '',
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
    minDate: new Date('1900-01-01').getTime(),
    maxDate: new Date('2100-12-31').getTime(),
    
    // 当前选中的纪念日
    currentAnniversary: null
  },

  onLoad() {
    console.log('页面加载，初始数据:', this.data)
    this.loadAnniversaryList()
  },

  onShow: function() {
    // 移除这里的loadAnniversaryList调用
    // this.loadAnniversaryList()
  },

  // 计算从纪念日到现在已经过去的天数
  calculatePassedDays(date) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // 解析日期字符串
    const [year, month, day] = date.split('-').map(Number)
    const anniversary = new Date(year, month - 1, day)
    anniversary.setHours(0, 0, 0, 0)
    
    const diffTime = today - anniversary
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    return diffDays
  },

  // 计算距离最近纪念日的天数
  calculateUpcomingDays(date) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // 解析日期字符串
    const [year, month, day] = date.split('-').map(Number)
    const anniversary = new Date(today.getFullYear(), month - 1, day)
    anniversary.setHours(0, 0, 0, 0)
    
    // 如果今年的纪念日已经过去，计算明年的
    if (anniversary < today) {
      anniversary.setFullYear(today.getFullYear() + 1)
    }
    
    const diffTime = anniversary - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    console.log('日期计算:', {
      today: today.toISOString(),
      anniversary: anniversary.toISOString(),
      diffDays
    })
    
    return diffDays
  },

  // 加载纪念日列表
  async loadAnniversaryList() {
    try {
      wx.showLoading({ title: '加载中...' })
      const res = await request({
        url: '/anniversary/list',
        method: 'GET'
      })

      if (res && res.state === 'success' && res.data) {
        // 处理纪念日数据
        const processedList = res.data.map(item => {
          // 检查必要字段
          if (!item.id || !item.name || !item.date) {
            console.error('纪念日数据缺少必要字段:', item)
            return null
          }

          return {
            id: item.id,
            name: item.name,
            date: item.date,
            description: item.description || '',
            isYearly: item.isYearly || false,
            isImportant: item.isImportant || false,
            days: this.calculatePassedDays(item.date),
            upcomingDays: this.calculateUpcomingDays(item.date)
          }
        }).filter(item => item !== null) // 过滤掉无效数据

        // 按距离下一个纪念日的天数排序
        processedList.sort((a, b) => a.upcomingDays - b.upcomingDays)

        this.setData({
          anniversaryList: processedList,
          totalAnniversaries: processedList.length,
          upcomingDays: processedList.length > 0 ? processedList[0].upcomingDays : 0
        })
      } else {
        throw new Error(res?.message || '加载失败')
      }
    } catch (error) {
      console.error('加载纪念日列表失败:', error)
      wx.showToast({
        title: error.message || '加载失败',
        icon: 'none'
      })
    } finally {
      wx.hideLoading()
    }
  },

  // 显示添加弹窗
  showAddPopup() {
    this.setData({
      showAdd: true,
      form: {
        name: '',
        date: '',
        description: '',
        isYearly: true,
        isImportant: false
      }
    })
  },

  // 隐藏添加弹窗
  hideAddPopup() {
    this.setData({ showAdd: false })
  },

  // 显示日期选择器
  showDatePicker() {
    this.setData({ showDatePicker: true })
  },

  // 隐藏日期选择器
  hideDatePicker() {
    this.setData({ showDatePicker: false })
  },

  // 日期选择确认
  onDateConfirm(e) {
    const date = new Date(e.detail)
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    this.setData({
      'form.date': formattedDate,
      showDatePicker: false
    })
  },

  // 表单字段变更
  onTitleChange(e) {
    this.setData({ 'form.name': e.detail })
  },

  onDescriptionChange(e) {
    this.setData({ 'form.description': e.detail })
  },

  onYearlyChange(e) {
    this.setData({ 'form.isYearly': e.detail })
  },

  onImportantChange(e) {
    this.setData({ 'form.isImportant': e.detail })
  },

  // 提交表单
  async submitForm() {
    const { name, date, description, isYearly, isImportant } = this.data.form
    if (!name) {
      wx.showToast({ title: '请输入标题', icon: 'none' })
      return
    }
    if (!date) {
      wx.showToast({ title: '请选择日期', icon: 'none' })
      return
    }

    try {
      wx.showLoading({ title: '保存中...' })
      const res = await request({
        url: getApp().globalData.baseUrl + '/anniversary/add',
        method: 'POST',
        data: {
          name,
          date,
          description,
          isYearly,
          isImportant,
        }
      })
      
      if (res && res.state === 'success') {
        wx.showToast({ title: '添加成功' })
        this.hideAddPopup()
        this.loadAnniversaryList()
      } else {
        throw new Error(res.message || '添加失败')
      }
    } catch (error) {
      console.error('添加纪念日失败:', error)
      wx.showToast({
        title: error.message || '添加失败',
        icon: 'none'
      })
    } finally {
      wx.hideLoading()
    }
  },

  // 显示详情
  async showDetail(e) {
    const id = e.currentTarget.dataset.id
    console.log('开始加载纪念日详情，ID:', id)
    
    try {
      wx.showLoading({ title: '加载中...' })
      const res = await request({
        url: getApp().globalData.baseUrl + `/anniversary/detail/${id}`,
        method: 'GET'
      })
      
      console.log('获取到的纪念日详情响应:', res)
      
      if (!res) {
        console.error('返回数据为空')
        throw new Error('返回数据为空')
      }
      
      if (res.state === 'success' && res.data) {
        console.log('纪念日详情数据:', res.data)
        this.setData({
          showDetail: true,
          currentAnniversary: {
            ...res.data,
            days: this.calculateUpcomingDays(res.data.date)
          }
        })
      } else {
        console.error('返回数据格式错误:', res)
        throw new Error(res.message || res.msg || '加载失败')
      }
    } catch (error) {
      console.error('加载纪念日详情失败:', error)
      console.error('错误详情:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      })
      wx.showToast({
        title: error.message || '加载失败',
        icon: 'none'
      })
    } finally {
      wx.hideLoading()
    }
  },

  // 隐藏详情
  hideDetail() {
    this.setData({ showDetail: false })
  },

  // 删除纪念日
  async deleteAnniversary() {
    if (!this.data.currentAnniversary) return

    try {
      const res = await wx.showModal({
        title: '提示',
        content: '确定要删除这个纪念日吗？'
      })

      if (res.confirm) {
        wx.showLoading({ title: '删除中...' })
        const deleteRes = await http.delete(`/anniversary/delete/${this.data.currentAnniversary.id}`)
        if (deleteRes.state === 'success') {
          wx.showToast({ title: '删除成功' })
          this.hideDetail()
          this.loadAnniversaryList()
        } else {
          wx.showToast({
            title: deleteRes.msg || '删除失败',
            icon: 'none'
          })
        }
      }
    } catch (error) {
      console.error('删除纪念日失败:', error)
      wx.showToast({
        title: '删除失败',
        icon: 'none'
      })
    } finally {
      wx.hideLoading()
    }
  }
}) 
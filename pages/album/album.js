const app = getApp()

Page({
  data: {
    // 统计数据
    totalPhotos: 0,
    totalAlbums: 0,
    totalVideos: 0,
    
    // 相册列表
    albums: [],
    albumNames: [],
    
    // 最近照片
    recentPhotos: [],
    
    // 新建相册表单
    albumForm: {
      name: '',
      description: '',
      cover: ''
    },
    
    // 添加照片表单
    photoForm: {
      albumId: null,
      albumName: '',
      photos: []
    },
    
    // 弹窗控制
    showAddAlbum: false,
    showAddPhoto: false,
    showAlbumPicker: false
  },

  onLoad: function() {
    this.loadAlbumData()
  },

  // 加载相册数据
  loadAlbumData: function() {
    // 模拟数据
    const mockData = {
      totalPhotos: 50,
      totalAlbums: 5,
      totalVideos: 3,
      albums: [
        {
          id: 1,
          name: '旅行相册',
          description: '记录我们的旅行时光',
          cover: '/images/album1.jpg',
          count: 20
        },
        {
          id: 2,
          name: '生活点滴',
          description: '日常生活的美好瞬间',
          cover: '/images/album2.jpg',
          count: 15
        },
        {
          id: 3,
          name: '美食记录',
          description: '我们一起吃过的美食',
          cover: '/images/album3.jpg',
          count: 10
        }
      ],
      recentPhotos: [
        {
          id: 1,
          url: '/images/photo1.jpg',
          date: '2024-03-15'
        },
        {
          id: 2,
          url: '/images/photo2.jpg',
          date: '2024-03-14'
        },
        {
          id: 3,
          url: '/images/photo3.jpg',
          date: '2024-03-13'
        }
      ]
    }
    
    this.setData({
      totalPhotos: mockData.totalPhotos,
      totalAlbums: mockData.totalAlbums,
      totalVideos: mockData.totalVideos,
      albums: mockData.albums,
      recentPhotos: mockData.recentPhotos,
      albumNames: mockData.albums.map(item => item.name)
    })
  },

  // 打开相册
  openAlbum: function(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/album/detail?id=${id}`
    })
  },

  // 预览照片
  previewPhoto: function(e) {
    const { url } = e.currentTarget.dataset
    wx.previewImage({
      urls: this.data.recentPhotos.map(item => item.url),
      current: url
    })
  },

  // 显示新建相册弹窗
  showAddAlbum: function() {
    this.setData({
      showAddAlbum: true,
      albumForm: {
        name: '',
        description: '',
        cover: ''
      }
    })
  },

  // 隐藏新建相册弹窗
  hideAddAlbum: function() {
    this.setData({ showAddAlbum: false })
  },

  // 显示添加照片弹窗
  showAddPhoto: function() {
    this.setData({
      showAddPhoto: true,
      photoForm: {
        albumId: null,
        albumName: '',
        photos: []
      }
    })
  },

  // 隐藏添加照片弹窗
  hideAddPhoto: function() {
    this.setData({ showAddPhoto: false })
  },

  // 显示相册选择器
  showAlbumPicker: function() {
    this.setData({ showAlbumPicker: true })
  },

  // 隐藏相册选择器
  hideAlbumPicker: function() {
    this.setData({ showAlbumPicker: false })
  },

  // 相册表单输入处理
  onAlbumNameChange: function(e) {
    this.setData({ 'albumForm.name': e.detail })
  },

  onAlbumDescriptionChange: function(e) {
    this.setData({ 'albumForm.description': e.detail })
  },

  // 选择相册封面
  chooseCover: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          'albumForm.cover': res.tempFilePaths[0]
        })
      }
    })
  },

  // 选择照片
  choosePhoto: function() {
    wx.chooseImage({
      count: 9 - this.data.photoForm.photos.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          'photoForm.photos': [...this.data.photoForm.photos, ...res.tempFilePaths]
        })
      }
    })
  },

  // 移除照片
  removePhoto: function(e) {
    const { index } = e.currentTarget.dataset
    const photos = [...this.data.photoForm.photos]
    photos.splice(index, 1)
    this.setData({ 'photoForm.photos': photos })
  },

  // 确认选择相册
  onAlbumConfirm: function(e) {
    const { value, index } = e.detail
    const album = this.data.albums[index]
    this.setData({
      'photoForm.albumId': album.id,
      'photoForm.albumName': album.name,
      showAlbumPicker: false
    })
  },

  // 提交相册
  submitAlbum: function() {
    const { name, description, cover } = this.data.albumForm
    if (!name || !cover) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return
    }

    const newAlbum = {
      id: Date.now(),
      name,
      description,
      cover,
      count: 0
    }

    this.setData({
      albums: [newAlbum, ...this.data.albums],
      albumNames: [name, ...this.data.albumNames],
      totalAlbums: this.data.totalAlbums + 1,
      showAddAlbum: false
    })

    wx.showToast({
      title: '创建成功',
      icon: 'success'
    })
  },

  // 提交照片
  submitPhoto: function() {
    const { albumId, photos } = this.data.photoForm
    if (!albumId || photos.length === 0) {
      wx.showToast({
        title: '请选择相册和照片',
        icon: 'none'
      })
      return
    }

    // 模拟上传照片
    const newPhotos = photos.map((url, index) => ({
      id: Date.now() + index,
      url,
      date: new Date().toISOString().split('T')[0]
    }))

    // 更新相册照片数量
    const albums = this.data.albums.map(item => {
      if (item.id === albumId) {
        return {
          ...item,
          count: item.count + photos.length
        }
      }
      return item
    })

    this.setData({
      albums,
      recentPhotos: [...newPhotos, ...this.data.recentPhotos],
      totalPhotos: this.data.totalPhotos + photos.length,
      showAddPhoto: false
    })

    wx.showToast({
      title: '上传成功',
      icon: 'success'
    })
  }
}) 
const app = getApp()
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    imgTitle :'',
    imgUrls: [
      "http://ruqc6jqdu.hn-bkt.clouddn.com/2c01239dc43e680221358a905b9f6bd4.jpeg",
      "http://ruqc6jqdu.hn-bkt.clouddn.com/49ec1695e0a62159a9652e79e3bc6b8b.jpeg",
      "http://ruqc6jqdu.hn-bkt.clouddn.com/e3cf6b5ace26b55cfb57b76853cb55ee.jpeg"
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgTitle : app.globaData.imgTitle,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})

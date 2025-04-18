// 常量定义
const WISH_STATUS = {
  PENDING: 0,
  COMPLETED: 1
};

const DEFAULT_WISH_PROPORTION = 3;
const MAX_WISH_CONTENT_LENGTH = 20;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 页面状态
    choose: WISH_STATUS.PENDING,
    show: false,
    show1: false,
    show2: false,

    // 图片资源
    treeImg:'http://ruqc6jqdu.hn-bkt.clouddn.com/wishTree.jpg',


    wishPoolImg:'http://ruqc6jqdu.hn-bkt.clouddn.com/wish.png',
    wishPoolImg1:'http://ruqc6jqdu.hn-bkt.clouddn.com/wish1.png',

    // 心愿数据
    wishList:[
      {id:0,wishContent:'挣一百万',wishProportion:3,},
      {id:1,wishContent:'挣一百万',wishProportion:1,},
      {id:2,wishContent:'挣一百万',wishProportion:4,},
    ],
    wishIcon:"http://ruqc6jqdu.hn-bkt.clouddn.com/gift.png",
    completeIcon:"http://ruqc6jqdu.hn-bkt.clouddn.com/complete.png",
    
    wishlocal: [
      [12, 45, 1],
      [20, 39, -5],
      [23, 25, 7],
      [25, 53, -3],
      [28, 35, 0],
      [32, 20, 7],
      [32, 49, 1],
      [37, 33, -6],
      [38, 60, 5],
      [40, 17, -2],
      [43, 48, -8],
      [44, 28, 2],
      [49, 13, 7],
      [49, 59, -4],
      [50, 40, 7],
      [53, 26, 0],
      [55, 72, 4],
      [58, 10, 2],
      [58, 40, 5],
      [60, 24, -2],
      [60, 56, -4],
    ],

    id:'',
    wishImg:'http://ruqc6jqdu.hn-bkt.clouddn.com/Magic.png',
    wishImg1:'http://ruqc6jqdu.hn-bkt.clouddn.com/Magic1.png',

    wishList1:[
        {userName:"大雄",wishContent:"挣一百万",submitTime:"2022.5.5"},
        {userName:"大雄",wishContent:"挣一百万",submitTime:"2022.5.5"},
        {userName:"大雄",wishContent:"挣一百万",submitTime:"2022.5.5"},
        {userName:"大雄",wishContent:"挣一百万",submitTime:"2022.5.5"},
        {userName:"大雄",wishContent:"挣一百万",submitTime:"2022.5.5"},
        {userName:"大雄",wishContent:"挣一百万",submitTime:"2022.5.5"},
        {userName:"大雄",wishContent:"挣一百万",submitTime:"2022.5.5"},
        {userName:"大雄",wishContent:"挣一百万",submitTime:"2022.5.5"},
        {userName:"大雄",wishContent:"挣一百万",submitTime:"2022.5.5"},
    ],


    show:false,
    wishContent:'',
    wishProportion:3,


    show1:false,
    show2:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    
  },
  addWish(){
    this.setData({
      choose:0
    })
  },
  completeWish(){
    this.setData({
      choose:1
    })
  },
  showPopup(){
    this.setData({
      show:true
    })
  },
  onClose(){
    this.setData({
      show:false,
      wishContent:'',
      wishProportion:3,
    })
  },
  onClickShow(data){
    this.setData({
      show1:true,
      id:data.currentTarget.dataset.id,
      wishContent:data.currentTarget.dataset.wishcontent,
      wishProportion:data.currentTarget.dataset.wishproportion,
    })
  },
  onClickHide(){
    this.setData({
      show1:false,
      wishContent:'',
      wishProportion:3,
    })
  }
})
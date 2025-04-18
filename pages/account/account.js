import * as echarts from "../../ec-canvas/echarts"
const app = getApp();
var startX, endX; //首先创建2个变量 来记录触摸时的原点
var moveFlag = true; // 判断执行滑动事件

function initChart_payments(canvas, width, height, dpr) {
    const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // 像素
    });
    canvas.setChart(chart);

    var option = {
        title: {
            text: '支出-收入表',
            top: 'top'
        },
        tooltip: {
            trigger: 'item',
        },
        legend: {
            //   orient: 'vertical',
            // left: 'center'
            bottom: 'bottom'
        },
        series: [{
            name: '账单',
            type: 'pie',
            radius: '50%',
            data: [{
                    value: 1048,
                    name: '收入'
                },
                {
                    value: 735,
                    name: '支出'
                },

            ],
            emphasis: {}
        }]
    };
    chart.setOption(option);
    return chart;
}

function initChart_pay(canvas, width, height, dpr) {
    const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // 像素
    });
    canvas.setChart(chart);

    var option = {
        title: {
            text: '支出表',
            top: 'top'
        },
        tooltip: {
            trigger: 'item'
        },
        xAxis: {
          type: 'category',
          data: ['旅游', '美食', '衣服', '包包', '儿童', '首饰', '父母']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            }
          }
        ]
      };
      
    chart.setOption(option);
    return chart;
}

function initChart_income(canvas, width, height, dpr) {
    const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // 像素
    });
    canvas.setChart(chart);

    var option = {
        title: {
            text: '收入表',
            top: 'top'
        },
        tooltip: {
            trigger: 'item'
        },
        xAxis: {
          type: 'category',
          data: ['工资', '外快', '基金', '淘宝', '其他']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [120, 200, 150, 80, 70],
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            }
          }
        ]
      };
      
    chart.setOption(option);
    return chart;
}



Page({
    /**
     * 页面的初始数据
     */
    data: {
        page: 1,
        ani1: '',
        ani2: '',
        currentab: "0",

        startDate: new Date().getTime(),
        endDate: new Date().getTime(),
        minDate: new Date(2019, 0, 1).getTime(),
        maxDate: new Date().getTime(),

        ec_payments: {
            onInit: initChart_payments
        },

        ec_pay: {
            onInit: initChart_pay
        },
        ec_income: {
            onInit: initChart_income
        },

        deposit:0,
        expenditure:0,

        dialogShow:false,
        recordList:[
        {id:0, time:"2022.6.6",user:"大雄",type:"收入",amount:"1000"},{id:1,time:"2022.6.7",user:"大雄",type:"支出",amount:"500"},{id:2,time:"2022.6.6",user:"大雄",type:"收入",amount:"1000"}, {id:3,time:"2022.6.7",user:"大雄",type:"支出",amount:"500"},
        ],
        spendIcon:"http://ruqc6jqdu.hn-bkt.clouddn.com/Spend.png",
        incomeIcon:"http://ruqc6jqdu.hn-bkt.clouddn.com/earning.png",


        showPicker:false, //是否显示
        clickType:'',
        bookKeep:{
            type:"支出",
            mode:"",
            money:"",
            time:""
        },
        currentDate:new Date().getTime(),
        maxDate:new Date().getTime(),
        columns_type: ['支出', '收入'],
        columns_mode_1: ['旅游','美食','衣服','包包','儿童','父母', '首饰'],
        columns_mode_2: ['工资','外快','基金','淘宝','其他'],
        columns_mode_3: [],

    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            ['bookKeep.time']:this.formatDate( new Date().getTime(), 'Y/M/D'), 
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        this.setData({
            endDate: this.formatDate(this.data.endDate),
            startDate: this.formatDate(this.data.startDate)
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {},

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },
    /**
     * 详情与售后左滑右滑事件
     */

    // touchStart: function (e) {

    //     startX = e.touches[0].pageX; // 获取触摸时的原点

    //     moveFlag = true;

    // },
    // 触摸移动事件
    // touchMove: function (e) {
    //     endX = e.touches[0].pageX; // 获取触摸时的原点
    //     if (moveFlag) {
    //         if (endX - startX > 50) {
    //             console.log("move right");
    //             this.move2right();
    //             moveFlag = false;
    //         }
    //         if (startX - endX > 50) {
    //             console.log("move left");
    //             this.move2left();
    //             moveFlag = false;
    //         }
    //     }
    // },
    // 触摸结束事件
    // touchEnd: function (e) {
    //     moveFlag = true; // 回复滑动事件
    // },
    clicktab1: function (e) {
        this.move2right();
        this.setData({
            currentab: 0
        })
    },
    clicktab2: function (e) {
        this.move2left();
        this.setData({
            currentab: 1
        })
    },
    //向左滑动操作
    move2left() {
        var that = this;
        if (this.data.page == 2) {
            return
        }
        var animation = wx.createAnimation({
            duration: 1000,
            timingFunction: 'ease',
            delay: 100
        });
        animation.opacity(0.2).translate(-500, 0).step()
        this.setData({
            ani1: animation.export()
        })
        setTimeout(function () {
            that.setData({
                page: 2,
                ani2: '',
                currentab: 1
            });
        }, 300)
    },

    //向右滑动操作
    move2right() {
        var that = this;
        if (this.data.page == 1) {
            return
        }
        var animation = wx.createAnimation({
            duration: 1000,
            timingFunction: 'ease',
            delay: 100
        });
        animation.opacity(0.2).translate(500, 0).step()
        this.setData({
            ani2: animation.export()
        })
        setTimeout(function () {
            that.setData({
                page: 1,
                ani1: '',
                currentab: 0
            });
        }, 300)
    },
    bindstartDateChange(e) {
        this.setData({
            startDate: e.detail.value
        })
    },
    bindendDateChange(e) {
        this.setData({
            endDate: e.detail.value
        })
    },
    formatDate(date) {
        date = new Date(date) //从时间选择器中得到的时间格式为时间戳,因此需要转换为标准制式时间单位
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDate() //这里只表现到日,时,分,秒自习行添加方法!
        return [year, month, day].map(this.formatNumber).join('-') //转换为产品经理想要的展示形式
    },
    formatNumber(n) {
        n = n.toString()
        return n[1] ? n : '0' + n //加0操作!
    },

    showPopup(data){
        let type = data.currentTarget.dataset.name
        this.setData({
            showPicker:true,
            clickType:type
        })
    },
    onClose(){
        this.setData({
            showPicker:false,
            clickType:''
        })
    },
    onConfirm(e) { 
        var value=e.detail.value;
        //console.info("确认选择:"+value)
        if(this.data.clickType =='type'){
            this.setData({ 
                ['bookKeep.type']:value, 
                showPicker: false,
                clickType:''
               });
        }
        if(this.data.clickType =='mode'){
            this.setData({ 
                ['bookKeep.mode']:value, 
                showPicker: false,
                clickType:''
               });
        }
        
      },
      changePicker(e){
        if(this.data.clickType =="type"){
            this.setData({
                ['bookKeep.mode']:'', 
            })
        }
    },

    inputValue(e) { 
        var value=e.currentTarget.dataset.name; //字段名 
        this.setData({
            ['bookKeep.mode']:value, 
        })
    },
    confirmTime(value){
        this.setData({
            ['bookKeep.time']: this.formatDate(value.detail, 'Y/M/D'), ///'Y/M/D'为了提示自己时间格式
            currentDate: value.detail,
            showPicker: false
        })
    },

    deleteRecord(e){
        let id = e.currentTarget.dataset.id  
        wx.showModal({
            title: '',
            content: '确认删除该记录吗？',
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
    },
    tapDialog(){
        this.setData({
            dialogShow:true
        })
    }
})
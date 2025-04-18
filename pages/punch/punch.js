var QQMapWX = require('../../mapsdk/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js');
var qqmapsdk;
// 声明一个数组数组
var dataArray = new Array()
Page({

    data: {
        latitude: '',
        longitude: '',
        addListShow: false,
        showAddress:false,

        suggestion: [],
        nearList: [],
        keyword: '',

        //打卡数据
        remark:{
            remarks:"",
            address:"",
            latitude:"",
            longitude:"",
            img:""
        },
        inputAdress:'',

        // 标注的数组, 这个markers最终会在 .wxml中直接被使用, 初始为空, 后面会通过setData方法对他进行赋值.
        markers: [],
        // 地图上控件数组
        controls: [{
            // id号 方便找到是哪个控件
            id: 2000,
          
            position: {
                left: 375 - 120,
                top: 50,
                width: 100,
                height: 40
            },
            // 是否可以点击
            clickable: true
        }]
    },
    // header: {'content-type': 'application/json'}
    onLoad: function () {
        var that = this
        qqmapsdk = new QQMapWX({
            key: 'CTKBZ-ILSCW-QWLR7-OE6W6-7FG3O-OAF4S'
        });
        wx.getLocation({
            type: 'wgs84',
            success(res) {
                that.setData({
                    latitude: res.latitude,
                    longitude: res.longitude,
                })
            }
        })
    },
    // 地图相关动作的几个方法
    regionchange(e) {
        // console.log(e.type)
    },
    // markers的点击事件
    markertap(e) {
        // 点击相应的坐标点取出相应的信息
        // console.log(dataArray[e.markerId])
        // console.log(e.markerId)
    },
    // control的点击事件
    controltap(e) {
        // console.log(e.controlId)
    },

    showAddList() {
        this.setData({
            addListShow: true
        })
    },
    tapAddrress(){
        this.setData({
            showAddress:true
        })
    },
    back(){
        this.setData({
            addListShow: false
        })
    },
    //调用关键词提示接口
    getsuggest: function (e) {
        var _this = this;
        var keyword = e.detail.value;
        _this.setData({
          addListShow: true
        })
        //调用关键词提示接口
        qqmapsdk.getSuggestion({
          //获取输入框值并设置keyword参数
          keyword: keyword, //用户输入的关键词，可设置固定值,如keyword:'KFC'
          location: _this.data.latitude + ',' + _this.data.longitude,
          page_size: 20,
          page_index: 1,
          //region:'北京', //设置城市名，限制关键词所示的地域范围，非必填参数
          success: function (res) {//搜索成功后的回调
            //console.log(res);
            var sug = [];
            for (var i = 0; i < res.data.length; i++) {
              sug.push({ // 获取返回结果，放到sug数组中
                title: res.data[i].title,
                id: res.data[i].id,
                addr: res.data[i].address,
                province: res.data[i].province,
                city: res.data[i].city,
                district: res.data[i].district,
                latitude: res.data[i].location.lat,
                longitude: res.data[i].location.lng
              });
            }
            _this.setData({ //设置suggestion属性，将关键词搜索结果以列表形式展示
              suggestion: sug,
              nearList: sug,
              keyword: keyword
            });
          },
          fail: function (error) {
            //console.error(error);
          },
          complete: function (res) {
            //console.log(res);
          }
        });
      },
      backfill: function (e) {
        var id = e.currentTarget.id;
        let name = e.currentTarget.dataset.name;
        for (var i = 0; i < this.data.suggestion.length; i++) {
          if (i == id) {
            //console.log(this.data.suggestion[i])
            this.setData({
              centerData: this.data.suggestion[i],
              showAddress: false,
            ['remark.address'] : `${name}-${this.data.suggestion[i].addr}`,
            ['remark.latitude']  : this.data.suggestion[i].latitude,
            ['remark.longitude']  : this.data.suggestion[i].longitude
            }); 
            //this.nearby_search();
            console.log(this.data.remark);
            return;
            //console.log(this.data.centerData)
            
          }
        }
        
      },
})
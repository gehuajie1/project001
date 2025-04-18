var myFunction={
    formatTime(date) {
        date = new Date(date) //从时间选择器中得到的时间格式为时间搓,因此需要转换为标准制式时间单位
    
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDate() //这里只表现到日,时,分,秒自习行添加方法!
        return [year, month, day].map(this.formatNumber).join('-') //转换为产品经理想要的展示形式
    },
    formatNumber(n) {
        n = n.toString()
        return n[1] ? n : '0' + n //加0操作!
    },
    formatter(type, value) { //展示的格式处理
        if (type === 'year') {
            return `${value}年`
        }
        if (type === 'month') {
            return `${value}月`
        }
        if (type === 'day') {
            return `${value}日`
        }
        return value
    }
}

module.exports={
    myFunction:myFunction 
  }
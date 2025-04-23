const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatTime1 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
 
  return `${[year, month, day].map(formatNumber).join('/')}`
}
const getWeekByDate = dates => {
  let show_day = new Array('日', '一', '二', '三', '四', '五', '六');
  let date = new Date(dates);
  date.setDate(date.getDate());
  let day = date.getDay();
  return show_day[day];
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}



module.exports = {
  formatTime,
  formatTime1,
  getWeekByDate
}

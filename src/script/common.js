/**
 * common 全局函数及变量
 */
import axios from 'axios'
import { ucBaseUrl, UcServerUrl } from '@/script/editor/psde/config'
var common = {}


common.newUcHttp = ucBaseUrl + ':10000/dist'; // uc线上新地址
common.ucJumpUrl = common.newUcHttp  + '/#/userCenter'; // Uc跳转地址

common.getNewUser = function (newType, newUrl, sendData, correctCallback, errorCallback) {
  let url = `${UcServerUrl}${newUrl}?token=${common.getItem("token")}`
  axios.get(url).then(function (res) {
    correctCallback(res.data)
  }).catch(function (res) {
    errorCallback(res.data)
  })
}

common.exitUser = { // 退出登陆
  requestOutUser() {
    common.getNewUser('get', '/account/logout', {},()=>this.clearUser()); 
  },
  clearUser: function () {
    common.exitUser.exitUser()
    common.exitUser.exitAddress()
  },
  exitUser: function (vueThis) {
    localStorage.removeItem('token')

  },
  exitAddress: function (httpVal) {
    window.location.href = `${common.newUcHttp}/#/login?service=${window.location.protocol}//${window.location.host}${window.location.pathname}`
  }
}
common.getMine = function (id) { // 判断是否是我自己的
  if (id == common.getInfo('id'))
    return true
  else
    return false
}

common.setItem = function (name, val) { // 设置cookie
  return localStorage.setItem(name, val)
}
common.getItem = function (name) { // 获取cookie
  return localStorage.getItem(name)
}
common.setInfo = function (name, val) { // 设置cookie
  if(typeof window.user !=='object') window.user = {};
  window.user[name] = val
}
common.getInfo = function (name) { // 获取cookie
  return !window.user ? '' : window.user[name]
}
common.getAvatar = function (avatar) { // 获取用户头像
  if (avatar) {
    return UcServerUrl+ '/avatar/' + avatar
  }else {
    return '../static/images/default-user-avatar.png'
  }
}
common.setUserInfo = function (data) {
  for ( let i in data) {
    common.setInfo(i, data[i])
  };
  sessionStorage.setItem('user',JSON.stringify(window.user));
  // localStorage.setItem('user',JSON.stringify(window.user));
  // console.log(window.user)
}
common.TimeShift = function (timeStamp, select) { // 时间戳格式转换日期
  if (timeStamp == '') {
    var time = new Date()
  }else {
    var time = new Date(JSON.parse(timeStamp))
  }
  var year = time.getFullYear()
  var month = time.getMonth() + 1
  var date = time.getDate()
  var hour = time.getHours()
  var minute = time.getMinutes()
  if (select == 5) {
    return month + '月' + date + '日'
  }
  var second = time.getSeconds(); // + "   " + hour + ":" + minute + ":" + second
  hour < 10 ? hour = '0' + hour : ''
  minute < 10 ? minute = '0' + minute : ''
  second < 10 ? second = '0' + second : ''
  month < 10 ? month = '0' + month : ''
  date < 10 ? date = '0' + date : ''

  if (select == 4) {
    return month + '.' + date
  }
  if (select == 3) {
    return {date: (year + '.' + month + '.' + date),time: (hour + ':' + minute + ':' + second)}
  }
  if (select == 2) {
    return {
      'year': year,
      'month': month,
      'date': date,
      'hour': hour,
      'minute': minute,
      'second': second
    }
  }
  if (select == 1) {
    return {date: (year + '-' + month + '-' + date),time: (hour + ':' + minute + ':' + second)}
  }
  if (select == 0) {
    return {date: (year + '-' + month + '-' + date),time: (hour + ':' + minute)}
  }
  return year + '.' + month + '.' + date
}



export default common

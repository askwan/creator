/**
 * common 全局函数及变量
 */
import {ucBaseUrl,UcServerUrl} from "@/psde/config";
var common = {};
common.fileUploadSize = 200;//任务上传文件的大小MB
common.ucJumpUrl = ucBaseUrl+":10000/dist/#/userCenter";//Uc跳转地址
common.newUcHttp = ucBaseUrl + ":10000/dist";//uc线上新地址
common.newUcServerUrl = UcServerUrl; //新uc获取数据地址
common.getNewUser = function(newType, newUrl, sendData, correctCallback, errorCallback) {
  this.getPromise(newType,common.newUcServerUrl,newUrl, sendData, correctCallback, errorCallback);
}
common.getPromise = function(newType,startAddress,newUrl, sendData, correctCallback, errorCallback){
  new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    let str = "";
    for( let i in sendData ){
      str+=`${i}=${sendData[i]}&`;
    }
    if( !sendData.passToken ){
      str+=`token=${common.getItem("token")}`;
    }
    if( newType.toLowerCase() == "get" ){
      xhr.open(newType, startAddress+newUrl+"?"+str);
    }else{
      xhr.open(newType, startAddress+newUrl);
    }
    xhr.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    xhr.onload = () => resolve(JSON.parse(xhr.responseText));
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send(str);
  }).then((data)=>{
    switch (data.status) {
      case 200:
      correctCallback != undefined ? correctCallback(data.data) : "";
      break;
      case 450:
      // 令牌无效
      common.exitUser.clearUser();
      break;
      case 504:
      errorCallback != undefined ? errorCallback(data.data) : "";
      break;
      default:
      errorCallback != undefined ? errorCallback(data) : maxVue.$message.error(data.message);
      break;
    }
  });
}
common.exitUser = { //退出登陆
  requestOutUser(){
    common.getNewUser("get","/account/logout",{},function(){
       common.exitUser.clearUser();
     })
  },
  clearUser : function(){
    common.exitUser.exitUser();
    common.exitUser.exitAddress();
  },
  exitUser: function(vueThis) {
    common.removeItem("token");
  },
  exitAddress : function(httpVal){
    // window.location.href=common.loginUrl+window.location.protocol+"//"+window.location.host+"/#/token";
    window.location.href= `${common.newUcHttp}/#/login?service=${window.location.protocol}//${window.location.host}${window.location.pathname}`;
  }
}
common.getMine = function(id){     // 判断是否是我自己的
    if( id == common.getInfo("id") )
      return true;
    else
      return false;
}
common.removeItem = function(name){//删除cookie
 return  localStorage.removeItem(name);
}
common.setItem = function(name,val){//设置cookie
 return  localStorage.setItem(name,val);
}
common.getItem = function(name){//获取cookie
 return  localStorage.getItem(name);
}
common.setInfo = function(name,val){//设置cookie
 window.user[name] = val;
}
common.getInfo = function(name){//获取cookie
 return !window.user ? "" : window.user[name];
}
common.getAvatar = function(avatar){//获取用户头像
  if( avatar ){
    return common.newUcServerUrl+"/avatar/"+avatar
  }else{
    return "../static/images/default-user-avatar.png"
  }
}
common.setUserInfo = function(data){
  for( let i in data ){
    common.setInfo(i,data[i])
  }
}
common.TimeShift = function(timeStamp,select) { //时间戳格式转换日期
  if( timeStamp == "" ){
   var time = new Date();
 }else{
   var time = new Date(JSON.parse(timeStamp));
 }
 var year = time.getFullYear();
 var month = time.getMonth() + 1;
 var date = time.getDate();
 var hour = time.getHours();
 var minute = time.getMinutes();
  if( select == 5 ){
     return month+"月"+date+"日";
  }
 var second = time.getSeconds(); //+ "   " + hour + ":" + minute + ":" + second
  hour < 10 ? hour = "0" + hour : '';
  minute < 10 ? minute = "0" + minute : '';
  second < 10 ? second = "0" + second : '';
  month < 10 ? month = "0" + month : '';
  date < 10 ? date = "0" + date : '';
 
  if( select == 4 ){
     return month+"."+date;
  }
  if( select == 3 ){
     return {date:(year + "." + month + "." + date),time:(hour+":"+minute+":"+second)}
  }
  if( select == 2 ){
    return {
      "year":year,
      "month":month,
      "date":date,
      "hour":hour,
      "minute":minute,
      "second":second,
    }
  }
  if( select == 1 ){
    return {date:(year + "-" + month + "-" + date),time:(hour+":"+minute+":"+second)}
  }
  if(select == 0){
    return {date:(year + "-" + month + "-" + date),time:(hour+":"+minute)}
  }
  return year + "." + month + "." + date;
}
common.tagFilter = function(a) { //转义过的字符串转换成html格式
  a = "" + a;
  return a.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
}
common.replaceHtml = function(str){ //删除html元素
  str = this.tagFilter(str)
  if( str ){
    str = str.replace(/<[^<>]+>/g,"");
    str = str == "null" ? "" : str;
    return str;
  }else{
    return "";
  }
}
common.message = function(mes,type="success"){
  //error,caver
  let oDiv = document.createElement("div");
  oDiv.classList.add("message-box")
  oDiv.classList.add("message-show");
  oDiv.classList.add(type)
  oDiv.innerHTML=`${mes}`;
  document.body.appendChild(oDiv)
  setTimeout(()=>{
    oDiv.classList.remove("message-show");
    oDiv.classList.add("message-hide");
    setTimeout(()=>{
     oDiv.remove();
    },1000)
  },3000)
}
common.textOmitted = function(str,num){
  var str = str ? str : "";
  if( str.length <= num ){
    return str;
  }else{
    return str.substring(0,num)+"...";
  }
}
common.firstUpperCase = function(str) {//首字母大写
  return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
}
common.userLevelShow = function(level){//显示等级
  return parseInt(level)-1 < 0 ? 0 : parseInt(level)-1;
}
common.sortArray = function(arr,accordance,direction){
  //arr数组accordance要匹配那个参数direction方向
  // return arr.sort(function(a,b){return a.createTime < b.createTime})
  for(var i=0;i<arr.length-1;i++){  
      for(var j=i+1;j<arr.length;j++){  
          if( direction ){
            if(arr[i][accordance] < arr[j][accordance]){//如果前面的数据比后面的大就交换  
                var temp=arr[i];  
                arr[i]=arr[j];  
                arr[j]=temp;  
            }  
          }else{
            if(arr[i][accordance] > arr[j][accordance]){//如果前面的数据比后面的大就交换  
              var temp=arr[i];  
              arr[i]=arr[j];  
              arr[j]=temp;  
          }   
          }
      }  
  }   
  return arr;  
}
common.getById = function(list,name){
		for( let one of list ){
			if( one.id == name ){
				return one;
			}
		}
}
common.strLength = function(str)
{
var sStr,iCount,i,strTemp ;
iCount = 0 ;
sStr = str.split("");
for (i = 0 ; i < sStr.length ; i ++)
{
strTemp = escape(sStr[i]);
if (strTemp.indexOf("%u",0) == -1) // 表示是汉字
{
iCount = iCount + 1 ;
}
else
{
iCount = iCount + 2 ;
}
}
return iCount ;
}
common.userLevelName = [//个人等级
  {name:"默默无闻"},
  {name:"初学乍练"},
  {name:"登堂入室"},
  {name:"圆转纯熟"},
  {name:"除窥堂奥"},
  {name:"略有小成"},
  {name:"渐入佳境"},
  {name:"炉火纯青"},
  {name:"已臻大成"},
  {name:"登峰造极"},
  {name:"神功盖世"}
]
common.characterCode = {
  "读权限" : 1,
  "作业权限" : 2,
  "质检权限" : 4,
  "调度权限" : 8,
  "管理权限" : 16
}
common.editorOption = {//富文本编辑器配置
  toolbar: [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{
    'list': 'ordered'
  }, {
    'list': 'bullet'
  }],
  [{
    'indent': '-1'
  }, {
    'indent': '+1'
  }],
  [{
    'color': []
  }, {
    'background': []
  }],
  [{
    'align': []
  }],
  ['link', 'image', ]
  ]
};
common.searchTime = 200;
common.founder = "/founder";
common.manager = "/manager";
common.scheduling = "/scheduling";
common.work = "/work";
common.groupManagerCode = 32;//创建者
common.managerCode = 16;//管理
common.schedulerCode = 8;//调度员
common.operatorCode = 6;//作业人员
common.readWriteCode = 1;//只读权限
common.auth={
  MatchRole : function(role){
    if( role == null ) return 0;
    var match = role&2;
    if( (role&common.groupManagerCode) > match ){return (role&common.groupManagerCode);}
    else if( (role&common.managerCode) > match ){return (role&common.managerCode);}
    else if( (role&common.schedulerCode) > match ){return (role&common.schedulerCode);}
    else if( (role&common.operatorCode) > match ){return (role&common.operatorCode);}
    else { return match; }
  },
  IsGroupManager : function(role) {//是否是创始人
    if( role == null ) return 0;
    else return (role & common.groupManagerCode);
  },
  IsManager : function(role) {//是否是管理员
    if( role == null ) return 0;
    else return (role & common.managerCode);
  },
  IsScheduler : function(role) {//是否是调度员
    if( role == null ) return 0;
    else return (role & common.schedulerCode);
  },
  IsOperator : function(role) {//是否是作业人员
    if( role == null ) return 0;
    else return (role & common.readWriteCode);
  },
  MatchRoleName : function(currentRole){//通过role查找名字
        if ( common.auth.IsGroupManager(currentRole)  ) { return "/founder";}//创建者
        if ( common.auth.IsManager(currentRole)  ) { return "/manager";}//管理
        if ( common.auth.IsScheduler(currentRole)  ) { return "/scheduling";}//调度
        if ( common.auth.IsOperator(currentRole)  ) { return "/work";}//质检
        if (  currentRole > 0 && currentRole<=3 ) {  return "/work";}//权限等级低于质检高于0只读权限
      },
  MatchRolePage : function(currentRole){//通过role查找页面
        if ( common.auth.IsGroupManager(currentRole)  ) { return common.founder+"/order";}//创建者
        if ( common.auth.IsManager(currentRole)  ) { return common.manager+"/craft";}//管理
        if ( common.auth.IsScheduler(currentRole)  ) { return common.scheduling+"/order";}//调度
        if ( common.auth.IsOperator(currentRole)  ) { return common.work+"/task";}//质检
        if (  currentRole > 0 && currentRole<=3 ) {  return common.work+"/task";}//权限等级低于质检高于0只读权限
      },
  MatchNameRole : function(name){//通过名字查找是否能打开此页面
    switch(name){
      case "/founder":
      return common.auth.IsGroupManager(common.getInfo("role"));
      break;
      case "/manager":
      return common.auth.IsManager(common.getInfo("role"));
      break;
      case "/scheduling":
      return common.auth.IsScheduler(common.getInfo("role"));
      break;
      case "/work":
      return common.auth.IsOperator(common.getInfo("role"));
      break;
      default:
      break;
    }
  }
};
common.deleteSpace = function(text){
  var reg = /[^\S]/ig;//过滤空格
  return text.replace(reg,"");
}
common.isMy = function(id){
  if( common.getInfo('id') == id ){
    return true;
  }else{
    return false;
  }
}
export default common;

import axios from 'axios';
//import common from '@/jscript/common.js';
var common = {
  getItem(name) { //获取token
    return localStorage.getItem(name);
  }
}

let apiConfig = {
  "Field": "ofield",
  "OType": "otype",
  "SDomain": "sdomain",
  "Spatialref": 'spatialref',
  "Connector": "oconnector",
  "FormStyle": "oformstyle",
  "GetDict": "/dict/getDict",
  "ModelDef": "modeldef",
  "Relation": "orelation",
  "Model": "model",

  "Diagram": "diagram",
}

//const psdeBaseUrl = "http://10.17.18.27:8080";
// const psdeBaseUrl = "http://192.168.1.177:8001";
// const psdeBaseUrl = "http://47.104.96.210:8080";
const psdeBaseUrl = 'http://bt1.geosts.ac.cn/api/dae';

//const psdeBaseUrl = "http://192.168.1.113:8001";
//const psdeBaseUrl = "http://localhost:8001";
// const psdeBaseUrl = "http://192.168.1.188:8080";
// const psdeHost = psdeBaseUrl;
const psdeHost = psdeBaseUrl + '/datastore';

const psdeUrl = psdeHost + "/rest/v0.1.0/datastore/";

const modelUrl = "http://bt1.geosts.ac.cn/api/bim";
//const modelUrl = "http://bt1.geosts.ac.cn/api/dae";//模型上传下载显示基础地址
const ucBaseUrl = "http://116.62.28.103";//UC基础地址
const UcServerUrl = "http://bt1.geosts.ac.cn/api/uc/api/v2";//UC获取数据地址

let psdeApi = axios.create({
  baseURL: psdeUrl
});
let psdeApiGet = axios.create({
  baseURL: psdeUrl + "dict/getDict/"
});
//上传图片地址
let psdeImgUpload = {
  baseURL: psdeUrl + "image/upload?token=" + common.getItem("token")
};
//显示图片地址
let psdeImgShow = {
  baseURL: psdeUrl + "image/show?token=" + common.getItem("token") + "&imageUrl="
};
//用户头像显示地址
let userImgShow = {
//	baseURL: ucBaseUrl + "/usercenter/v1"
	baseURL: UcServerUrl
};
//上传文件地址
let fileUpload = {
  baseURL: modelUrl + "/block/blockserver/save?token=" + common.getItem("token")
};
//上传模型文件地址
let modelFileUpload = {
	baseURL: modelUrl + "/bim-service/api/onegis/file/upload?"
//baseURL: modelUrl + "/block/api/onegis/file/upload?token=" + common.getItem("token")
};
//模型列表
let queryModelFile = {
	baseURL: modelUrl + "/bim-service/api/onegis/file/query?token=" + common.getItem("token")
//baseURL: modelUrl + "/block/api/onegis/file/query?token=" + common.getItem("token")
};
//模型下载
let downloadFile = {
	baseURL: modelUrl + "/bim-service/api/onegis/file/download"
//baseURL: modelUrl + "/block/api/onegis/file/download"
};

//对象建模，业务建模跳转地址
let modelJump = {
  loc: window.location.href,
  hreGo() {
    var regular = /designer.html.*/;
    var cur = this.loc.replace(regular, "business.html");
    return cur;
  },
  hreBack() {
    var regular = /business.html.*/;
    var cur = this.loc.replace(regular, "designer.html");
    return cur;
  }
};

export {
  apiConfig,
  psdeApi,
  psdeApiGet,
  psdeImgUpload,
  psdeImgShow,
  userImgShow,
  fileUpload,
  modelFileUpload,
  queryModelFile,
  downloadFile,
  modelJump,
  ucBaseUrl,
  UcServerUrl,
  psdeUrl,
  psdeHost,
  behaviorFile,
  behaviorQuery,
  behaviorDelete,
  behaviorUpdate,
  modelUrl
};

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

// const psdeBaseUrl = "http://192.168.1.133:8001";
//const psdeBaseUrl = "http://localhost:8001";
// const psdeBaseUrl = "http://192.168.1.188:8080";
// const psdeHost = psdeBaseUrl;
const psdeHost = psdeBaseUrl + '/datastore';

const psdeUrl = psdeHost + "/rest/v0.1.0/datastore/";

// const modelUrl = "http://bt1.geosts.ac.cn/api/bim";
const modelUrl = "http://bt1.geosts.ac.cn/api/dae";//模型上传下载显示基础地址
const ucBaseUrl = "http://116.62.28.103";//UC基础地址
const UcServerUrl = "http://bt1.geosts.ac.cn/api/uc/api/v2";//UC获取数据地址

let psdeApi = axios.create({
  baseURL: psdeUrl
});
let psdeApiGet = axios.create({
  baseURL: psdeUrl + "dict/getDict/"
});


export {
  apiConfig,
  psdeApi,
  psdeApiGet,
  fileUpload,
  modelFileUpload,
  queryModelFile,
  ucBaseUrl,
  UcServerUrl,
  psdeUrl,
  psdeHost,
};

import CoreData from "./CoreData"
import {
  psdeApi,
  apiConfig,
  psdeApiGet
} from './config'
// import common from '@/script/common.js'
// import Vue from 'vue'

// let message = new Vue();
/**
 * 代理接口
 * 
 * @class Proxy
 */
class Proxy extends CoreData {
  constructor() {
    super()
  }
  insert(options=this) {
    let promise = this.getApi().post(`${this.getUrlName()}/insert?token=${this.getToken()}`, options)
    return this.createPromise(promise);
  }
  update(options=this) {
    let promise = this.getApi().post(`${this.getUrlName()}/update?token=${this.getToken()}`, options);
    return this.createPromise(promise);
  }
  delete(condition) {
    let promise = this.getApi().post(`${this.getUrlName()}/delete?token=${this.getToken()}`, condition);
    return this.createPromise(promise);
  }
  getApi() {
    return psdeApi;
  }
  getUrlName() {
    //let oname = apiConfig[this.constructor.name];
    let className=this.className;
    return className;
  }
  getToken(){
    // return common.getItem("token")
  }
  exitUser(){
    // common.exitUser.clearUser()
  }
   /**
   * 根据顾虑器查询数据
   * 
   * @param {any} filter 
   * @returns 
   * @memberof Proxy
   */
  query(filter,query="query") {
    let promise = this.getApi(psdeApi).get(`${this.getUrlName()}/${query}?token=${this.getToken()}`, {
    	params:filter
    })
    return this.createPromise(promise);
  }
  
  /*query(filter) {
    let promise = this.getApi().get(`${this.getUrlName()}/query?token=${this.getToken()}`, {params: filter})
    return this.createPromise(promise)
  }*/
  
  static from(name) {
    let proxy = Object.create(Proxy.prototype);
    Object.assign(proxy, {
      getUrlName: function () {
        return name;
      }
    })
    return proxy;
  }
  static query(name,filter) {
    return new Promise(function (resolve, reject) {
      Proxy.from(name).query(filter).then(function (response) {
          resolve(response);
      }).catch(function (error) {
        reject(error);
      });
    });
  }
 
  /**
   * 查询选择器数据
   * 
   * @param {any} str 
   * @returns 
   * @memberof Proxy
   */
  acquire(str){
    return this.getApi(psdeApiGet).get(str)
  }
  createPromise(promise){
    return new Promise((resolve,reject)=>{
      promise.then(res=>{
        if(res.data.status==200){
          resolve(res.data.data);
        }else if(res.data.status==500){
          reject(res)
          // message.$message({message:"内部错误",type:"error",showClose:true});
        }else if(res.data.status==450){
          // common.exitUser.clearUser();
        }else{
          reject(res);
          // message.$message({message:res.data.message,type:"error",showClose:true});
        }
      }).catch(err=>{
        reject(err)
        // message.$message({message:err,type:"error",showClose:true});
      })
    })
  }

}
export default Proxy

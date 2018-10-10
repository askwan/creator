import axios from 'axios'
import { psdeUrl } from './config'
import SObject from './psdm/SObject'
import { rejects } from 'assert';

class Proxy {
  constructor(url, classType, defaultFilter){
    this.url = url
    this.classType = classType,
    this.defaultFilter = defaultFilter
  }
  save(params){
    let url = `${this.url}/save?token=${getToken()}`;
    return new Promise(function(resolve, reject){
      axios.post(url,params).then(res=>{
        resolve(res);
      },err=>{
        reject();
      })
    })
  }
  delete(params){
    let url = `${this.url}/delete?token=${getToken()}`;
    return new Promise(function(resolve, reject){
      axios.post(url,params).then(res=>{
        resolve(res);
      },err=>{
        reject();
      })
    })
  }
  query(params){
    let url = `${this.url}/query?token=${getToken()}`;
    return new Promise(function(resolve, reject){
      axios.get(url,{params:params}).then(res=>{
        resolve(res);
      },err=>{
        reject();
      })
    })
  }
  update(params){
  	let url = `${this.url}/update?token=${getToken()}`;
    return new Promise(function(resolve, reject){
      axios.post(url,params).then(res=>{
        resolve(res);
      },err=>{
        reject();
      })
    })
  }
}


let behaviorService = new Proxy(`${psdeUrl}/actionprocess`,null,{});

// behaviorService.save = function(params){
//   return this.query(params);
// }
// behaviorService.query = function(params){
//   return this.query(params);
// }
// behaviorService.delete = function(params){

// }





function getToken () {
  return localStorage.getItem('token')
}

export default behaviorService;
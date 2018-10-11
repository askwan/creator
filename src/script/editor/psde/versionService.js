import axios from 'axios'
import { psdeUrl } from './config'

class Proxy {
  constructor(){
    this.url = psdeUrl;
  }
  query(params){
    let url = `${this.url}version/list/query`;
    return new Promise(function(resolve, reject){
      axios.get(url,{params:params}).then(res=>{
        if(res.status==200){
          resolve(res.data);
        }else{
          reject(res);
        }
      },err=>{
        reject(res);
      })
    })
  }
}

let versionServer = new Proxy();


export default versionServer


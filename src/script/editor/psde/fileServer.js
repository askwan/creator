import axios from 'axios'
import { modelUrl } from './config'

class Proxy {
  constructor(url=modelUrl){
    this.baseUrl = url;
  }
  uploadMode(option){
    let headers = {headers: {"Content-Type": "multipart/form-data"}};
    let formData= new FormData();
    formData.append('file',option.file.raw);
    let url = this.baseUrl+'/model-service/model/rest/v0.1.0/datastore/slave/model/file/upload'+`?name=${option.name}&desc=${option.desc}`
    return new Promise((resove,reject)=>{
      axios.post(url,formData,headers).then(res=>{
        if(res.status==200) {
          resove(res.data);
        }else{
          reject(res)
        }
      },(err)=>{
        reject(err)
      })
    })
  }
}

export const fileServer = new Proxy();


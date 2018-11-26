import Base from './Base'
import {psdeBaseUrl} from '../config'

class ModelServer extends Base {
  constructor(){
    super();
    this.url = psdeBaseUrl +'/dae/model-service/model/rest/v0.1.0/datastore/slave/model/file';
    
  }
  getModel(option={}){
    return new Promise((resolve,reject)=>{
      this.get('/query',option).then(res=>{
        resolve(res);
      })
      .catch(err=>{
        reject(err)
      })
    })
  }
  upload(option){
    return new Promise((resolve,reject)=>{
      this.upload('/upload',option).then(res=>{
        resolve(res);
      })
      .catch(err=>{
        reject(err);
      })
    })
  }
  getUploadUrl(){
    return this.url+'/upload';
  }
}

export default new ModelServer();
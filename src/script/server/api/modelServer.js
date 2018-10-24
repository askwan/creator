import Base from './Base'
import {psdeBaseUrl} from '../config'

class ModelServer extends Base {
  constructor(){
    super();
    this.url = psdeBaseUrl +'/bim';
  }
  getModel(option={}){
    return new Promise((resolve,reject)=>{
      this.get('/bim-service/api/onegis/file/query',option).then(res=>{
        resolve(res);
      })
      .catch(err=>{
        reject(err)
      })
    })
  }
  upload(option){
    return new Promise((resolve,reject)=>{
      this.upload('/bim-service/api/onegis/file/upload',option).then(res=>{
        resolve(res);
      })
      .catch(err=>{
        reject(err);
      })
    })
  }
  getUploadUrl(){
    return this.url+'/bim-service/api/onegis/file/upload';
  }
}

export default new ModelServer();
import Base from './Base'
import {psdeUrl} from '../config'

class ObjectServer extends Base {
  constructor(){
    super();
    this.url = psdeUrl+'object'
  }
  query(option){
    return new Promise((resolve,reject)=>{
      this.get(option).then(res=>{
        resolve(res);
      })
      .catch(err=>{
        reject(err)
      })
    })
  }
  save(option){
    return new Promise((resolve,reject)=>{
      this.post('/saveObject',option).then(res=>{
        resolve(res)
      })
      .catch(err=>{
        reject(err)
      })
    })
  }
}

export default new ObjectServer();
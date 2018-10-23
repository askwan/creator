import Base from './Base'
import {psdeUrl} from '../config'

class ObjectServer extends Base {
  constructor(){
    super();
    this.url = psdeUrl+'object/'
  }
  getObjects(option){
    return new Promise((resolve,reject)=>{
      this.query(option).then(res=>{
        resolve(res);
      })
      .catch(err=>{
        reject(err)
      })
    })
  }
  saveObject(option){
    return new Promise((resolve,reject)=>{
      this.save(option).then(res=>{
        resolve(res)
      })
      .catch(err=>{
        reject(err)
      })
    })
  }
}

export default new ObjectServer();
import Base from './Base'
import {psdeUrl} from '../config'

class ObjectServer extends Base {
  constructor(){
    super();
    this.url = psdeUrl+'object'
  }
  query(option){
    return new Promise((resolve,reject)=>{
      this.get('/query',option).then(res=>{
        if(res.status==200){
          // res.data.list.forEach()
          resolve(res.data);
        }else{
          reject(res)
        }
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
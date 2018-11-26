import Base from './Base'
import {psdeUrl} from '../config'

class ObjectServer extends Base {
  constructor(){
    super();
    this.url = psdeUrl+'object'
  }
  query(option={}){
    let user = sessionStorage.getItem('user');
    user = JSON.parse(user);
    Object.assign(option,{uids:`'${user.id}'`});
    console.log(option,123);
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
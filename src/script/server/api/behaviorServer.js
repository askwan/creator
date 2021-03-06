import Base from './Base'
import {psdeUrl} from '../config'

class BehaviorServer extends Base {
  constructor(){
    super();
    this.url = psdeUrl +'model';
  }
  getBehaviors(options={}){
    return new Promise((resolve,reject)=>{
      this.get('/query',options).then(res=>{
        resolve(res);
      })
      .catch(err=>{
        reject(err);
      })
    })
  }
}

export default new BehaviorServer();
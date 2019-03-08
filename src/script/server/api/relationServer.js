import Base from './Base';
import {psdeUrl} from '../config'
class RelationServer extends Base {
  constructor(){
    super();
    this.url = psdeUrl +'orelation';
    let token = this.getToken;
    this.defaultOption = {
      loadField:true,
      loadForm:true,
      loadConnector:true,
      loadModel:true,
      orderType:"ID",
      descOrAsc:true,
      token:token
    }
  }
  getRelationByName(name){
    
    let opt = Object.assign({},this.defaultOption,{names:name});
    return new Promise((resolve,reject)=>{
      this.get('/query',opt).then(res=>{
        if(res.status==200){
          resolve(res.data);
        }else{
          reject(res)
        }
      }).catch(err=>reject(err))
    })
  }
  getList(option={}){
    let opt = Object.assign({},this.defaultOption,option);
    return new Promise((resolve,reject)=>{
      this.get('/query',opt).then(res=>{
        if(res.status==200){
          resolve(res.data);
        }else{
          reject(res);
        }
      }).catch(err=>reject(err));
    })
  }
}

export default new RelationServer();
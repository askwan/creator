import Base from './Base'
import {psdeUrl} from '../config'

class DiagramServer extends Base {
  constructor(){
    super();
    this.url = psdeUrl + 'diagram/'
  }
  query(option={}){
    return new Promise((reslove,reject)=>{
      this.get("query",option).then(res=>{
        if(res.status==200){
          reslove(res.data.list);
        }else{
          reject(res);
        }
      })
      .catch(err=>{
        reject(err);
      })
    })
  }
  /**
   * 通过用户id获取diagram
   * @param {object} option 
   */
  queryByUserid(option={}){
    let options = {
      loadField:true,
      loadModel:true,
      loadForm:true,
      loadParentField:true,
      loadParents:true,
      loadConnector:true,
      uid:option.userId,
      token:'',
    }
    return this.query(options)
  }
}

export default new DiagramServer();
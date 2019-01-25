import Base from './Base'
import {psdeUrl} from '../config'

class ObjectServer extends Base {
  constructor(){
    super();
    this.url = psdeUrl+'object'
  }
  query(option={}){
    let user = sessionStorage.getItem('user')||"{}";
    user = JSON.parse(user);
    option = Object.assign({uids:`'${user.id}'`},option);
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
  ByNameAndOTName(option={}){
    let defaultOption = {
      loadAttr: true,
      loadForm: true,
      loadObjType: true,
      orderType: 'ID',
      descOrAsc: true
    }
    let _options = Object.assign(defaultOption,option);
    return this.query(_options);
  }
  getChangesets(option={}){
    return new Promise((resolve,reject)=>{
      this.get('/changeset/list/query',option).then(res=>{
        if(res.status==200){
          resolve(res.data);
        }else{
          reject(res);
        }
      })
      .catch(err=>{
        reject(err)
      })
    })
  }
  queryBySobjectId(sobjectId){
    let option = {
      loadAttr:true,
      loadForm:true,
      ids:sobjectId,
      loadVersion:true,
      geoEdit:true,
      loadNetwork:true,
      loadCompose:true
    };
    return this.query(option)
  }
  queryByBbox(bbox){
    let option = {
      loadForm:true,
      geoEdit:true,
      loadNetwork:true,
      geoWkt:bbox,
      loadAttr:true,
    };
    return this.query(option);
  }
}

export default new ObjectServer();
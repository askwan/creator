import axios from 'axios'
export default class Base {
  constructor(){}
  query(options){
    return new Promise((resolve,reject) => {
      axios.get(this.url,{
        params:options
      })
      .then(res=>{
        if(res.status==200){
          resolve(res.data)
        }else{
          reject(res);
        }
      })
      .catch(err=>{
        reject(err)
      })
    })
  }
  save(options){
    let url = this.url+'?token='+this.getToken();
    return new Promise((resolve,reject)=>{
      axios.post(url,options)
        .then(res=>{
          if(res.status==200){
            resolve(res.data)
          }else{
            reject(res);
          }
        })
        .catch(err=>{
          reject(err)
        })
    })
  }
  update(){

  }
  delete(){

  }
  getToken(){
    return localStorage.getItem('token') || ''
  }
}
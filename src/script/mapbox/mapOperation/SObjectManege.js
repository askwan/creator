import SObject from './SObject'

class SObjectManege{
  constructor() {
    this.sobjectList={}
  }
  addList(sobject){
    if(this.sobjectList[sobject.id]){

    }else{
      this.sobjectList[sobject.id]=new SObject(sobject)
    }
  }
  haveOrNot(id){
    if(this.sobjectList[id]){
      return true
    }else{
      return false
    }
  }
}
let sObjectManege=new SObjectManege()
export default sObjectManege
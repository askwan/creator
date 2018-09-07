import AObject from '../psdm/AObject'

class Relation extends AObject {
  constructor() {
    super()
    this.className = "orelation"
    /**
     * 对应关系1 : 1, 1 : M,M : 1, M : N
     */
    this.defineProperty("name", '')
    this.defineProperty("mappingType", '')
    this.defineProperty("fields", {fields:[]})
    this.defineProperty("uid",1)
    this.defineProperty("model",{})
  }
  valueChange(a,b,c){
    // console.log("changed");
    // console.log(a,b,c)
  }
}

export default Relation

import CoreData from "../CoreData"
/**
 * 
 * 
 * @class FDomain
 */
class FDomain extends CoreData {
  constructor() {
    super()
    this.defineProperty("domain", "")
  }
}

class CDomain extends FDomain {
  constructor() {
    super()
    this.defineProperty("domainType", "code")
    this.defineProperty("codedValues", [])

  
  }
  addCode(code) {
    this.codedValues.push(code)

    this.updateDomain();
  }
  deleteCode(code){
    this.codedValues.splice(this.codedValues.indexOf(code),1);
    this.updateDomain();
  }
  updateDomain(){
    this.domain = JSON.stringify({
      domainType: this.domainType,
      codedValues: this.codedValues
    });
  }

}

class RDomain extends FDomain {
  constructor() {
    super()
    this.defineProperty("domainType", "range")
    this.defineProperty("maxValue", 0)
    this.defineProperty("minValue", 0)
  }
  valueChange(key) {
    if (key != 'domain') {
      this.domain = JSON.stringify({
        domainType: this.domainType,
        maxValue: this.maxValue,
        minValue: this.minValue
      });
    }

  }
}
export {
  FDomain,
  CDomain,
  RDomain
}

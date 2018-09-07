import OBase from './OBase'
/**
 * 
 * 时间域
 * @class TDomain
 * @extends {OBase}
 */
class TDomain extends OBase {
  constructor() {
    super()
    this.defineProperty("trs", {id:0})
     this.defineProperty("sTime", "")
      this.defineProperty("eTime", "")
  }
}

export default TDomain

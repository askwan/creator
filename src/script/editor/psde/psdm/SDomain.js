import TDomain from './TDomain'
/**
 * 空间域
 * 
 * @class SDomain
 * @extends {TDomain}
 */
class SDomain extends TDomain {
  constructor() {
    super()
	this.className = "sdomain"
	
    this.defineProperty("minx", 0)
    this.defineProperty("miny", 0)
    this.defineProperty("minz", 0)
    this.defineProperty("maxx", 0)
    this.defineProperty("maxy", 0)
    this.defineProperty("maxz", 0)
    this.defineProperty("des", "")
    this.defineProperty("srs", {id:0})
   
  }
}
export default SDomain;
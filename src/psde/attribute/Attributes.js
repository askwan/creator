import CoreData from '../CoreData'
/**
 * 属性集
 * 
 * @class Attributes
 */
class Attributes extends CoreData {
  constructor() {
    super()
    /**
     * 属性集合
     */
    this.defineProperty("attributes", [])
  }
}
export default Attributes
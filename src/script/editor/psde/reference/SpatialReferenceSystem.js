import CoreData from '../CoreData'
/**
 * 空间参考
 * 
 * @class SpatialReferenceSystem
 * @extends {CoreData}
 */
class SpatialReferenceSystem extends CoreData {
  constructor() {
    super()
    /**
     * 编码
     */
    this.defineProperty("id", "")
    /**
     * 名称
     */
    this.defineProperty("name", "")
    /**
     * 内容
     */
    this.defineProperty("content", "")
  }
}
export default SpatialReferenceSystem

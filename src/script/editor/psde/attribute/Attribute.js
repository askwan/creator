import CoreData from '../CoreData'
/**
 * 属性
 * 
 * @class Attribute
 * @extends {CoreData}
 */
class Attribute extends CoreData {
  constructor(option) {
    super()
    /**
     * 字段
     */
    this.defineProperty("fid", option.fid || 0)
    /**
     * 名称
     */
    this.defineProperty("name", option.name || "")
    /**
     * 值
     */
    this.defineProperty("value", option.value || "")

  }
}
export default Attribute

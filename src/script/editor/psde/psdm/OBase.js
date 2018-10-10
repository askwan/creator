import AObject from './AObject'
import Version from './Version'
/**
 * 基础对象
 * 
 * @class OBase
 * @extends {AObject}
 */
class OBase extends AObject {
  constructor() {
    super()
    
    this.defineProperty("uuid", 0)
      /**
     * 来源
     */
    this.defineProperty("from", 0)

    /**
     * 对象的父对象
     */
    this.defineProperty("parents", [])

    /**
     * 子对象
     */
   // this.defineProperty("children", 0)
     /**
     * 创建版本
     */
   // this.defineProperty("cversion", new Version())
    /**
     * 消亡版本
     */
   // this.defineProperty("dversion", new Version())
     /**
     * 当前版本
     */
  //  this.defineProperty("version", new Version())
     /**
     * 数据权限级别
     */
  //  this.defineProperty("level", 0)
  }
  addParents(parent) {
    this.parents.push({ id: parent });

  }
}
export default OBase;

import AObject from '../psdm/AObject'
import Relation from './Relation'
import OType from '../psdm/OType'

/**
 * 对象类连关系
 * 
 * @class Connector
 * @extends {AObject}
 */
class Connector extends AObject {
  constructor() {
    super()
    this.className = "oconnector"
    /**
     * 连接类型
     */
    this.defineProperty("type", '')
    /**
     * 关系
     */
    this.defineProperty("relation", new Relation())
    /**
     * 目标类模板
     */
    this.defineProperty("toType", new OType())
    /**
     * 源类模板
     */
    this.defineProperty("fromType", new OType())
  }
}
export default Connector

import OBase from './OBase'
import OType from './OType'
import Attributes from '../attribute/Attributes'
import TimeReferenceSystem from "../reference/TimeReferenceSystem"
/**
 * 
 * 数据对象
 * @class DObject
 * @extends {OBase}
 */
class DObject extends OBase {
  constructor() {
    super()

    this.defineProperty("trs", new TimeReferenceSystem())

    this.defineProperty("code", "")

    /**
     * 对象所属类
     */
    this.defineProperty("otype", new OType(), OType)

    /**
     * 对象的属性信息
     */
    this.defineProperty("attributes", [])
    
    this.defineProperty("dataRef", "")
    
  }
  addAttribute(attribute){
    this.attributes.push(attribute);
  }
  
}
export default DObject

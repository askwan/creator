import AObject from '../psdm/AObject'
import {
  FDomain,
  CDomain,
  RDomain
} from "./FDomain"
/**
 * 
 * 字段类
 * 
 * @class field
 */
class Field extends AObject {
  constructor() {
    super()
    this.className = "ofield"
    /**
     * 标题
     */
    this.defineProperty("caption", "")
    /**
     * 描述
     */
    this.defineProperty("des", "")
    /**
     * 图标
     */
    this.defineProperty("icon", "")
    /**
     * 字段类型
     */
    this.defineProperty("type", "")
    /**
     * 字段输入UI类型
     */
    this.defineProperty("uitype", "")
    /**
     * 值域
     * this.defineProperty("fdomain", new FDomain())
     */
    this.defineProperty("domain", "")
  }
//$fdomain(pvalue, value) {
//  if (value&&!(value instanceof FDomain)) {
//    let domain = null;
//    if (value.domainType == "range") {
//      domain = new RDomain();
//    } else {
//      domain = new CDomain();
//    }
//    domain.createObject(value);    
//    this.fdomain=domain;     
//  }    
//}
$icon(ovalue, nvalue) {
    console.log(ovalue + "," + nvalue)
}
  
}
export default Field;

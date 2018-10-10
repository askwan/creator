import AObject from '../psdm/AObject'
/**
 * 形态样式
 * 
 * @class FormStyle
 * @extends {AObject}
 */
class FormStyle extends AObject {
  constructor() {
    super()
    this.className = "oformstyle"
    /**
     * 形态描述
     */
    this.defineProperty("des", "")
    /**
     * 形态样式类型
     * sld、svg、css、3ds、etc.
     */
    this.defineProperty("style", "")   
    /**
     * 样式内容
     */
    this.defineProperty("data", "")
    /**
     * 形态类型
     */
    this.defineProperty("type", "")
  }
}
export default FormStyle;
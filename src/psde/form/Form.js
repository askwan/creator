import AObject from '../psdm/AObject'
import FormStyle from './FormStyle'
/**
 * 形态
 * 
 * @class Form
 * @extends {AObject}
 */
class Form extends AObject {
  constructor() {
    super()
    /**
     * 形态样式
     */
    this.defineProperty("formStyle", new FormStyle())
    /**
     * 最小可见
     */
    this.defineProperty("minGrain", "")
    /**
     * 最大可见
     */
    this.defineProperty("maxGrain", "")
  }
}
export default Form;
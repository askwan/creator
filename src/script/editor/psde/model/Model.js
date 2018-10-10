import AObject from '../psdm/AObject'
import ModelDef from './ModelDef'
/**
 * 模型（行为）
 * 
 * @class Model
 * @extends {AObject}
 */
class Model extends AObject {
  constructor() {
    super()
	this.className = "model"
    /**
     * 初始化数据
     */
    this.defineProperty("initData", "")
    /**
     * 输入类型
     */
    this.defineProperty("inTypes", "")
    /**
     * 输出类型
     */
    this.defineProperty("outTypes", "")
    /**
     * 模型类别
     */
    this.defineProperty("mdef", new ModelDef())
  }
}
export default Model;
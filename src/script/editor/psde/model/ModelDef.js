import AObject from '../psdm/AObject'
/**
 * 模型类别（行为类别）
 * 
 * @class ModelDef
 * @extends {AObject}
 */
class ModelDef extends AObject {
  constructor() {
    super()
    this.className = "modeldef"
    /**
     * 标签
     */
    this.defineProperty("tags", "")
    /**
     * 类型
     */
    this.defineProperty("type", "")
    /**
     * 描述
     */
    this.defineProperty("des", "")
    /**
     * 图标
     */
    this.defineProperty("icon", "")
  }
}
export default ModelDef;
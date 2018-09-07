import CoreData from '../CoreData'
/**
 * 版本
 */
class Version extends CoreData {
  constructor() {
    super()
    /**
     * 主键id
     */
    this.defineProperty("vid", 0)
    /**
     * 版本内容
     */
    this.defineProperty("msg", 0)
    /**
     * 操作类型
     * 说明：该操作是所有相关Action中operation的或
     * 例如：值为ADDING|MODIFY
     */
    this.defineProperty("operate", 0)
    /**
     * 对象id
     */
    this.defineProperty("rvid", 0)
    /**
     * 操作动作集合
     * 注意：只有在查询某个版本所包含的Action时才有值，否则都为空
     */
    this.defineProperty("oactions", [])
  }
}

export default Version

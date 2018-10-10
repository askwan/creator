import CoreData from "../CoreData"

/**
 *对象的关系网络
 */
class Network extends CoreData {
  constructor() {
    super()
    /**
     * 定义关系节点
     */
    this.defineProperty("nodes", [])
  }
}
export default Network

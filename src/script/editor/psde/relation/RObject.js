import CoreData from "../CoreData"

/**
 *关联对象
  auth:zffp
 */
class RObject extends CoreData {
  constructor() {
    super()

    this.defineProperty("id", 0)
    this.defineProperty("relatedObjectId", 0)
    this.defineProperty("label", "")
    this.defineProperty("properties", {})
  }
}

export default RObject

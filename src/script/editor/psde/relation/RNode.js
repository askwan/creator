import RObject from "./RObject"
import REdge from "./REdge"

class RNode extends RObject {
  constructor() {
    super()

    this.defineProperty("edge", new REdge())
  }
}

export default RNode

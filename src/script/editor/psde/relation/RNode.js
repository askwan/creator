import RObject from "./RObject"
import REdge from "./REdge"

class RNode extends RObject {
  constructor() {
    super()

    this.defineProperty("edge", new REdge());
    this.point = {};
    this.properties = {};
    this.oType = {};
  }
}

export default RNode

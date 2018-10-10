import RObject from "./RObject"

class REdge extends RObject {
  constructor() {
    super()

    this.defineProperty("relation", {})
    this.defineProperty("intensity", 0)
    this.defineProperty("rules", [])
  }
}
export default REdge

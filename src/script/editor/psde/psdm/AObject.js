import Proxy from "../Proxy"

/**
 * 
 * @class AObject
 */
class AObject extends Proxy {
  constructor() {
    super()
    /**
     * id
     */
    this.defineProperty("id", "")
    this.defineProperty("name", "")
    //操作变量
    this.defineProperty("actions",[]);
  }
  addAction(action){
    this.actions.push(action);
  }
}

export default AObject;

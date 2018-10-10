import CoreData from '../CoreData'



class Action extends CoreData {
  constructor(id, operation) {
    super();
    this.defineProperty("id", id || 0);
    this.defineProperty("operation", operation || 0)
  }
}


// 操作方式
Action.ADDING = 1;
Action.DELETE = 2;
Action.MODIFY = 4;
Action.COPY = 8;

// 对象属性的编辑标记
Action.BASE = 32;
Action.ATTRIBUTE = 64;
Action.FORM = 128;
Action.RELEATION = 256;
Action.COMPOSE = 512;
Action.MODEL = 1024;

export default Action;

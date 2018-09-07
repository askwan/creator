import {
  psdeApi
} from '../config'
/**
 * 数据枚举
 */
class DataEnums {
  constructor() {

  }

  static async getDict(dictType) {
    const result = await psdeApi.get('/dict/getDict/' + dictType);
    return result.data.data;
  }
  /**
   * 形态集合
   */
  static form() {
    return this.getDict('form');
  }
  static connector() {
    return this.getDict('connector');
  }
  static fieldInput() {
    return this.getDict('fieldInput');
  }
}

export default DataEnums;

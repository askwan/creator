/**
 * 定义私有变量
 */
let $data = null;

/**
 * 核心数据类
 * 
 * @class CoreData
 */
class CoreData {
  constructor() {
    $data = {};
  }
  defineProperty(key, value,dataType) {
    let data = $data;
    data[key] = value;
    Object.defineProperty(this, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveGetter() {
        const value = data[key]
        return value
      },
      set: function reactiveSetter(newVal) {
        if (dataType) {
          data[key] = Object.assign(new dataType(), newVal);
        } else {
          data[key] = newVal;
        }

        if (this[`$${key}`]) {
          this[`$${key}`](data[key], newVal)
        }

        if (this['valueChange']) {
          this['valueChange'](key, data[key], newVal)
        }
       
      }
    })
  }
  setDataValue(key,value){
    $data[key] = value
  }
  createObject(data) {  
    Object.assign(this, data);   
  }


}
export default CoreData;

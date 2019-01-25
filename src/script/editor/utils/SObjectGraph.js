import psde from '../psde'
let idcount = 1

/**
空间对象图
 */
class SObjectGraph {
  constructor () {
    // 当前编辑的sobject几何
    this.sobjectList = Object.create({})
  }
  clearSobject () {
    this.sobjectList = Object.create({})
  }
  /**
   *添加空间对象
   * @param {any} sobject
   */
  addSObject (sobject) {
    // console.log(this.sobjectList,'dsfdfsfd')
    this.sobjectList[sobject.id] = sobject
  }
  /**
   * 更新空间对象
   * @param {any} sobject
   */
  updateSObject (sobject) {
    this.sobjectList[sobject.id] = sobject
    sobject.modifyObject(sobject)
  }

  createFormByStyle (style) {
    let form = new psde.AForm()
    form.id = idcount++
    form.dim = style.dim
    form.minGrain = style.minGrain
    form.maxGrain = style.maxGrain
    // 设置几何数据类型
    // geometryForm.addGeom(feature.geometry)
    form.type = style.type
    if(style.positions&&style.positions.length>0){
      form.geotype = style.positions[0]
    }
    if(form.type>30){
      form.style = [{
        scale: 1,
        smallPX: 0,
        x: 0,
        y: 0,
        z: 0,
        h:0
      }];
    }
    return form
  }

  createSobjectByOsmEntityId (entityId, otype, formType, geoType) {
    // console.log(otype, formType, 'abd111')

    let form = this.createFormByStyle(formType);
    // 该处需要注意，如果是几何osm的形态，formref与posref是同一个值，如果是其它类型的形态，则为不同的内容
    // 其他类型，如模型形态，formref是模型引用id，posref是该模型的位置，
    form.formref.refid = entityId
    form.geom = entityId
    form.type = formType
    form.geotype = geoType
    form.geomref = entityId
    form.maxGrain = form.maxGrain || 0
    form.minGrain = form.minGrain || 0
    let sobject = new psde.SObject();
    console.log('createObject')
    sobject.createObject({forms:[form]});
    sobject.otype = otype;
    // sobject.attributes = attributes;
    // 创建动作

    // 添加form形态

    // sobject.addForm(form)
    // 创建自动增长id
    let id = idcount++;
    sobject.id = String(id);
    this.sobjectList[sobject.id] = sobject;
    // feature.id = 'f' + form.id + '_' + sobject.id

    return sobject
  }
}

export default SObjectGraph

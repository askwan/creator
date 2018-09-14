import psde from '@/psde'
import wkt from '../wkt'
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
  /**
   * 更新形态位置
   * @param {any} feature
   */
  updateSobjectForm (feature) {
    let words = feature.id.substring(1).split('_')
    let sid = words[1]
    let fid = words[0]
    let sobject = this.getSobjectById(feature.id)
    if (sobject != null) {
      for (let i = 0; i < sobject.forms.length; i++) {
        let form = sobject.forms[i]
        if (form.id == fid) {
          // console.log(form,feature.geometry,456)
          // console.log(wkt(form.geom))
          // form.addGeom(feature.geometry)
          form.geom = feature.geometry

          // sobject.forms[i] = this.createForm(feature)

          return true
        }
      }
    }
    return false
  }
  /**
   * 删除空间对象
   * @param {any} sobject
   */
  deleteSobject (sobject) {

    // delete this.sobjectList[sobject.id]
  }
  /**
 * feature转换为形态
 * @param {any} feature
 */
  createForm (feature, style) {
    let geometryForm = new psde.GeometryForm()
    geometryForm.id = idcount++

    geometryForm.dim = style.dim
    geometryForm.minGrain = style.minGrain
    geometryForm.maxGrain = style.maxGrain

    // 设置几何数据类型
    geometryForm.addGeom(feature.geometry)
    geometryForm.type = style.type
    return geometryForm
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
   
    console.log(form, style, 'cdeafl')
    return form
  }
  /**
   * 创建sobject
   * @param {any} feature
   */
  createSObject (feature, otype, style) {
    let form = this.createForm(feature, style)
    let sobject = new psde.SObject()
    sobject.createObject({})
    sobject.otype.id = otype.id

    // 创建动作

    // 添加form形态

    sobject.addForm(form)
    // 创建自动增长id
    sobject.id = idcount++
    this.sobjectList[sobject.id] = sobject

    feature.id = 'f' + form.id + '_' + sobject.id

    return sobject
  }

  createSobjectByOsmEntityId (entityId, otype, formType, geoType) {
    // console.log(otype, formType, 'abd111')

    let form = this.createFormByStyle(formType)

    // 该处需要注意，如果是几何osm的形态，formref与posref是同一个值，如果是其它类型的形态，则为不同的内容
    // 其他类型，如模型形态，formref是模型引用id，posref是该模型的位置，
    form.formref.refid = entityId
    form.geom = entityId
    form.type = formType
    form.geotype = geoType

    form.maxGrain = form.maxGrain || 0
    form.minGrain = form.minGrain || 0
    let sobject = new psde.SObject()
    sobject.createObject({})
    sobject.otype.id = otype.id

    // 创建动作

    // 添加form形态

    sobject.addForm(form)
    // 创建自动增长id
    sobject.id = idcount++
    this.sobjectList[sobject.id] = sobject
    // feature.id = 'f' + form.id + '_' + sobject.id

    return sobject
  }

  getSobjectById (id) {
    let words = id.substring(1).split('_')
    let sid = words[1]
    if (this.sobjectList[sid]) {
      return this.sobjectList[sid]
    }
    return null
  }
  /**
   * 将sobject转化为features进行编辑
   */
  toFeatures (loadSobjectList) {
    let features = []
    let ids = {}
    for (let key in this.sobjectList) {
      let sobject = this.sobjectList[key]
      ids[sobject.id] = true
      this.sobjectToFeature(sobject, features)
    }
    for (let key in loadSobjectList) {
      let sobject = loadSobjectList[key]
      // console.log(sobject.forms,'forms')
      // sobject.forms.forEach((el,k)=>{
      // if(!el.geom){
      //   sobject.forms.splice(k,1)
      // }
      // })
      if (!ids[sobject.id]) {
        this.sobjectToFeature(sobject, features)
      }
    // if(!this.sobjectList[sobject.id]) this.sobjectList[sobject.id] = sobject
    }
    return features
  }
  sobjectToFeature (sobject, features) {
    for (let i = 0; i < sobject.forms.length; i++) {
      let form = sobject.forms[i]
      let geometry = null

      if (!form.geom || form == '') {
        continue
      }

      if (typeof (form.geom) == 'string') {
        geometry = wkt(form.geom)
        form.geom = geometry
        if (geometry == null) {
          sobject.forms.splice(i, 1)
          continue
        }
      } else {
        geometry = form.geom
      }

      let properties = {}
      properties['oid'] = sobject.id
      properties['fid'] = form.id

      let feature = {
        'id': 'f' + form.id + '_' + sobject.id,
        'type': 'Feature',
        'properties': properties,
        'geometry': geometry
      }
      features.push(feature)
    }
  }
  findByOsmId (change) {
    for (let key in this.sobjectList) {
      let sobj = this.sobjectList[key]

      sobj.forms.forEach(el => {
        if (el.geom == change.entity.id) {
          el.geom = change
        }
      })
    }
    return this
  }
  findByOsmId1 (entityId) {
    for (let key in this.sobjectList) {
      let sobj = this.sobjectList[key]

      for (let i = 0;i < sobj.forms.length;i++) {
        let form = sobj.forms[i]
        if (form.geom == entityId) {
          return [sobj, form]
        }
      }
    }
    return []
  }
}

export default SObjectGraph

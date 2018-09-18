import psde from '@/psde'
import { vm, operate } from '@/script/operate'
const field = new psde.Field()
const otype = new psde.OType()
const dict = new psde.GetDict()

var allOtype = {

}
var orgCollection = []
var otypesCollection = []
var fieldsCollection = []
var dictCollection = []

allOtype.orginData = function (arr) {
  if (!arguments.length) return orgCollection
  orgCollection = arr
  getAllOtypes(arr)
  return orgCollection
}
allOtype.otypes = function () {
  return otypesCollection
}
allOtype.fields = function () {
  return fieldsCollection
}
allOtype.getDiagram = function (id) {
  let diagram = orgCollection.find(el => el.id == id)
  if (diagram) return diagram.otypes
  return otypesCollection
}
allOtype.dict = function(){
  return dictCollection;
}

function getAllOtypes (arr) {
  // arr.forEach(el=>{
  //   el.otypes.forEach(item=>{
  //     item.fields.fields = item.fields.fields||[]
  //     item.fields.fields.forEach(field=>{
  //       var index = fieldsCollection.findIndex(el=>el.id==field.id)
  //       if(index==-1){
  //         fieldsCollection.push(field)
  //       }
  //     })
  //   })

  // })
  // return
  arr.forEach(el => {
    el.otypes.forEach(item => {
      let index = otypesCollection.findIndex(e => e.id == item.id)
      if (index == -1) otypesCollection.push(item)
    })
  })
  getAllFields()
}

function getAllFields () {
  otypesCollection.forEach(el => {
    el.fields = el.fields || {fields: []}
    el.fields.fields.forEach(field => {
      let index = fieldsCollection.findIndex(e => e.id == field.id)
      if (index == -1) fieldsCollection.push(field)
    })
  })
}

var num = 1
let otypes
allOtype.compair = function (fn) {
  if (num == 1) {
    num++
    dict.query(null, 'form').then(res => {
      dictCollection = res
      num = 1
      fn(fieldsCollection, otypesCollection, res)
    })
  }
}
var relations = [];
const relationArr = (relation)=>{
  if(!relation) return relations;
  let index = relations.findIndex(el=>el.id==relation.id);
  if(index==-1) relations.push(relation);
}
const clearRelationArr = ()=>{
  relations = [];
}


function allOtypes () {
  return otypesCollection
}
function getOtypeById (id) {
  for (let i = 0;i < otypesCollection.length;i++) {
    let otype = otypesCollection[i]

    if (otype.id == id) {
      //console.log('chenggong')
      return otype
    }
  }
  return null
}
function getOtypeByName (otypeName) {
  for (let i = 0;i < otypesCollection.length;i++) {
    let otype = otypesCollection[i]
    if (otype.name == otypeName) {
      return otype
    }
  }
  return null
}
function getGerm (arr, type) {
  let obj = arr.find(item => item.value == type)

  if (obj) {
    if (obj.value == 11) {
      return 'point'
    }else if (obj.value == 12) {
      return 'line'
    }else if (obj.value == 13) {
      return 'area'
    }else {
      return 'point'
    }
  }
  return 'point'
}
const typeList = {
  'Text': 'text',
  'Number': 'number',
  'Date': 'text',
  'DateTime': 'text',
  'RichText': 'text',
  'UploadFile': 'text',
  'UploadImg': 'text',
  'Select': 'combo',
  'Radio': 'radio',
  'Checkbox': 'check',
  'Switch': 'radio',
  'Slider': 'radio',
  'Rate': 'number',
  'ColorPicker': 'text',
  'Textarea': 'textarea'
}
function getType (key) {
  return typeList[key] || 'text'
}

export { allOtype }
// export { compair }
export { getGerm, typeList, getType, allOtypes, getOtypeById,getOtypeByName,relationArr,clearRelationArr }

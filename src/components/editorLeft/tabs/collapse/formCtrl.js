import _cloneDeep from 'lodash-es/cloneDeep'
// 下拉添加位置
const fromlist = [{
  label: 'Node',
  value: 11
}, {
  label: 'Way',
  value: 12,
  sign: 'add'
}, {
  label: 'Relation',
  value: 13,
  sign: 'add'
}, {
  label: 'Point',
  value: 21,
  sign: 'add'
}, {
  label: 'Linestring',
  value: 22,
  sign: 'add'
}, {
  label: 'Polygon',
  value: 23,
  sign: 'add'
},{
  label: 'Polygon',
  value: 24,
  sign: 'add'
}, {
  label: 'Isohypse',
  value: 31,
  sign: 'add'
}, {
  label: 'Dem',
  value: 32,
  sign: 'add'
}, {
  label: 'Tin',
  value: 33,
  sign: 'add'
},
 {
  label: 'Bim模型',
  value: 40,
  sign: 'add'
},
 {
  label: '3D模型',
  value: 50,
  sign: 'add'
}, {
  label: 'ShapeBlock',
  value: 61,
  sign: 'add'
}
]

function getAddFromList (otype) {
  let result = []
  if (otype && otype.formStyles) {
    for (let i = 0;i < otype.formStyles.styles.length;i++) {
      let formstyle = otype.formStyles.styles[i]
      let from = getFromByType(formstyle.type)
      if (from) {
        result.push( from )
      }
    }
  }
  return result
}

/**
获取otype中样式类型
 */
function geOtypeFromStyle (otype, type) {
  if (otype && otype.formStyles) {
    for (let i = 0;i < otype.formStyles.styles.length;i++) {
      let formstyle = otype.formStyles.styles[i]
      if (formstyle.type == type) {
        return formstyle
      }
    }
  }
  return null
}

function getFromByType (ftype) {
  for (let i = 0;i < fromlist.length;i++) {
    if (fromlist[i].value == ftype) {
      return _cloneDeep(fromlist[i])
    }
  }
  return null
}

export { fromlist, getAddFromList, getFromByType, geOtypeFromStyle }

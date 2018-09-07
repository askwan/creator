import axios from 'axios'
import { psdeUrl } from './config'
import SObject from './psdm/SObject'

class QueryProxy {
  constructor (url, classType, defaultFilter) {
    this.url = url
    this.classType = classType,
    this.defaultFilter = defaultFilter
  }
  query (filter) {
    let T = this.classType
    let url = `${this.url}query?token=${getToken()}`

    let defaultFilter = this.defaultFilter

    return new Promise(function (resolve, reject) {
      let params = Object.assign(filter, defaultFilter)

      axios.get(url, {params: params})
        .then(function (response) {
          let datalist = response.data.data
          let resultList = []
          for (let i = 0; i < datalist.list.length; i++) {
            let item = datalist.list[i]
            let typeData = new SObject()

            let sobject = typeData.copyObject(item)
            resultList.push(sobject)
          }
          datalist.list = resultList
          resolve(datalist)
        })
        .catch(function (error) {
          reject(error)
        })
    })
  }
  save () {}
}

function getToken () {
  return localStorage.getItem('token')
}

let objectQuery = new QueryProxy(`${psdeUrl}object/`, SObject)

/**
根据名称与类模板的名称查询对象集合
 */
objectQuery.ByNameAndOTName = new QueryProxy(`${psdeUrl}object/`, SObject, {
  loadAttr: true,
  loadForm: false,
  loadObjType: false,
  orderType: 'ID',
descOrAsc: true})

objectQuery.getDetailById = new QueryProxy(`${psdeUrl}object/`, SObject, {
  loadForm: true,
  loadObjType: true,
  // loadVersion: true,
  loadAction: true,
  loadNetwork: true
})

objectQuery.getBoxSObject = function (minx, maxx, miny, maxy) {
  let filter = {
    loadForm: true,
    loadNetwork: true,
    // loadObjType:true,
    geoWkt: `BBOX(${minx} ${maxx} ${miny} ${maxy})`
  }
  return this.query(filter)
}

export { objectQuery }

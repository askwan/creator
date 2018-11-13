import dictServer from './api/dictServer'
import otypeServer from './api/otypeServer'
import modelServer from './api/modelServer'
import imageServer from './api/imageServer'
import objectServer from './api/objectServer'
import diagramServer from './api/diagramServer'
import styleServer from './api/styleServer'
import behaviorServer from './api/behaviorServer'

import {
  psdeBaseUrl,
  psdeHost,
  psdeUrl,
  ucBaseUrl,
  UcServerUrl,
  token
} from './config.js'




export {
  diagramServer,
  objectServer,
  otypeServer,
  modelServer,
  dictServer,
  psdeUrl,
  imageServer,
  styleServer,
  behaviorServer
}

// const myEvent = new CustomEvent('hello',{
//   detail:{name:'askwan'}
// });

// window.addEventListener('hello',event=>{
//   console.log(event,event.detail,'obj')
// })
// console.log(789789);
// setTimeout(() => {
//   window.dispatchEvent(myEvent);
// }, 5000);

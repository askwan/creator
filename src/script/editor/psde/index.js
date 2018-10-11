import Field from './attribute/Field'
import Attribute from './attribute/Attribute'
import Attributes from './attribute/Attributes'
import FormStyle from './form/FormStyle'
import AForm from './form/AForm'
import GeometryForm from './form/GeometryForm'
import Model from './model/Model'
import ModelDef from './model/ModelDef'

import AObject from './psdm/AObject'
import DObject from './psdm/DObject'
import OBase from './psdm/OBase'
import OType from './psdm/OType'
import Position from './psdm/Position'
import SDomain from './psdm/SDomain'
import SObject from './psdm/SObject'
import TDomain from './psdm/TDomain'
import User from './psdm/User'
import Version from './psdm/Version'
import Spatialref from './psdm/Spatialref'
import GetDict from './psdm/GetDict'
import Action from './psdm/Action'

import SpatialReferenceSystem from './reference/SpatialReferenceSystem'
import TimeReferenceSystem from './reference/TimeReferenceSystem'

import Connector from './relation/Connector'
import Relation from './relation/Relation'
import Network from './relation/Network'
import REdge from './relation/REdge'
import RNode from './relation/RNode'
import RObject from './relation/RObject'

import { FDomain, CDomain, RDomain } from './attribute/FDomain'

import Diagram from './diagram/Diagram'
import Proxy from './Proxy'

import { objectQuery } from './objectService'
import {psdeApi} from './config'
import versionServer from './versionService'

export default {
  Field,
  FDomain,
  CDomain,
  RDomain,
  Attribute,
  Attributes,
  FormStyle,
  Model,
  ModelDef,
  AObject,
  DObject,
  OBase,
  OType,
  Position,
  SDomain,
  SObject,
  TDomain,
  User,
  Version,
  SpatialReferenceSystem,
  TimeReferenceSystem,
  Connector,
  Relation,
  Spatialref,
  GetDict,
  Action,
  GeometryForm,
  AForm,
  Diagram,
  Proxy,
  Network,
  REdge,
  RNode,
  RObject,
  psdeApi,
  objectQuery,
  versionServer
}

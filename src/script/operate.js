import Vue from "vue"

const operate = {
  /**
   * 操作侧边
   * {hideLeft:boolean,hideRight:boolean}
   */
  changeSlider:"changeSlider",
  /**
   * 操作类模板编辑菜单
   * {status:boolean,loc:{x:Number,y:Number}
   */
  operateEditMenu:"operateEditMenu",
  /**
   * 
   */
  openInstant:"openInstant",
  /**
   * 获取实例化对象{object:Object}
   */
  instantOtype:"instantOtype",
  /*
   * 拖动tab页
   */
  pageSize:"pageSize",

  /**
   * 选择类视图
   */
  chooseDiagram:'chooseDiagram',

  /**
   * 
   * 进入编辑
   */
  ifEdit:'ifEdit',
  exitEdit:'exitEdit',
  /**
   * fly
   */
  fly:'fly',

  showLeft:'showLeft',
  flyTo:'flyTo',
  /**
   * 关闭右键菜单
   */
  closeRightMenu: 'closeRightMenu',
  /**
   * 添加对象之间关系选择列表
   */
  addObjectRalation: 'addObjectRalation',
  /**
   * 点击对象时所触发的事件
   */
  currentObject:'currentObject',
  /**
   * 编辑普通几何
   */
  generalEdit:'generalEdit',
  /**
   * 删除树节点时所触发的事件
   */
	deleteTreeNode: 'deleteTreeNode',
	/**
   * 添加对象关系的时候搜索与当前对象有关系的对象列表
   */
  relationSearchObject: 'relationSearchObject',

  /**
   * 
   */
  getOsmType:'getOsmType',

  /**
   * 当前点击的对象的当前形态
   */
  currentForm:'currentForm',
  /**
   * 3D模型上传模型
   */
  modelUploadEvent:'modelUploadEvent',
  /**
   * 左边栏编辑与显示状态下内容的切换
   */
  leftContentChange:'leftContentChange',
  /**
   * 点击历史后的内容的切换
   */
  viewHistoryEvent:'viewHistoryEvent',

  mapBoxZoom:'mapBoxZoom',

}
let context;
const getContext = (_)=>{
  if(!_) return context;
  context = _;
  return context;
}

const vm = new Vue();
export { vm , operate,getContext}
/**
 * tab项及窗口
 */
import {
  vm,
  operate
} from "@/script/operate.js"
class TabItem {
  constructor(name, id, isShow, isCompontent, compontentName) {
    this.name = name;
    this.id = id;
    this.compontentName = compontentName;
    //默认显示
    this.isShow = isShow;
    //tab页是否显示
    this.isCompontent = isCompontent;
    //是否浮动
    this.isFloat = false
    //最大化窗口
    this.isMaximize = false;
    //浮动时的位置
    this.x = 0;
    this.y = 0;
    //浮动时窗口的高宽
    this.width = 800;
    this.height = 400;

    this.zIndex = 500;
  }
  getWidth() {
    if (!this.isFloat || this.isMaximize) {
      return "100%"
    }
    return `${this.width}px`;
  }
  getHeight() {
    if (!this.isFloat || this.isMaximize) {
      return "100%"
    }
    return `${this.height}px`;
  }
  getX() {
    if (this.isFloat && this.isMaximize) {
      return "0px";
    }

    return `${this.x}px`;
  }
  getY() {
    if (this.isFloat && this.isMaximize) {
      return "0";
    }
    return `${this.y}px`;
  }
  /**
   * 设置窗口大小
   * @param {*} offsetX 
   * @param {*} offsetY 
   */
  setSizeByOffsetXY(offsetX, offsetY) {
    this.width += offsetX;
    this.height += offsetY;
    tabManage.sizeChanges();
  }

  /**
   * 移动title
   * @param {*} offsetX 
   * @param {*} offsetY 
   */
  movePosOffset(offsetX, offsetY) {
    this.x += offsetX;
    this.y += offsetY;
  }
  /**
   *设置窗口位置
   * @param {*} x 
   * @param {*} y 
   */
  setPos(x, y) {
    this.x = x;
    this.y = y;
  }
  /**
   *设置窗口宽高
   * @param {*} w 
   * @param {*} h
   */
  setSize(w, h) {
    this.width = w;
    this.height = h;
    tabManage.sizeChanges();
  }
  /**
   * tab页是否显示
   */
  isTabShow() {
    return this.isShow && !this.isFloat
  }
  /**
   * tab是否激活
   */
  isTabActive() {
    return tabManage.activeTabItem == this.id || this.isFloat
  }
  /**
   * 是否浮动
   */
  isFloatItem() {
    return this.isFloat;
  }
  /**
   * 浮动item
   */
  floatItem() {
    this.isFloat = true;
    this.setZIndexTop()
    if (tabManage.activeTabItem == this.id) {
      tabManage.popTabItem()
    }
  }
  /**
   * 激活item
   */
  activeItem() {
    if (!this.isFloat) {
      tabManage.activeTabItem = this.id;
      this.isShow = true;
    }
  }
  getzIndex() {
    return this.zIndex;
  }
  /**
   * 设置zindex置顶
   */
  setZIndexTop() {
    //获取最大的zindex
    let zindex = 0;
    for (let i = 0; i < childrenList.length; i++) {
      let czindex = childrenList[i].zIndex;
      zindex = Math.max(czindex, zindex);
    }
    if (this.zIndex <= zindex) {
      this.zIndex = zindex + 1;
    }
  }

}
let childrenList = [
//new TabItem("地图编辑", "main", true, true),
//new TabItem("数据对象", "objectData", false, true, "object-data"),

//new TabItem("对象查询", "objectQuery", false, true, "object-query"),
//new TabItem("行为列表", "behaviorList", false, true, "behavior-list"),
//new TabItem("样式列表", "styleList", false, true, "o-style-list"),
//new TabItem("对象管理", "objectManager", false, true, "object-manager"),
//new TabItem("模型管理", "modelManager", false, true, "model-manager"),
//new TabItem("团队", "team", false, false, "bt-team")
]

let tabItemHistory = [];
/**
 * tab页面管理
 */
let tabManage = {
  /**
   * 当前激活tabitem
   */
  activeTabItem: "objectData",
  /**
   * 
   */
  maxIndex: 500,
  /**
   * 上一个显示的tab
   */
  popTabItem() {
    if (tabItemHistory.length > 0) {
      let lastIdx = tabItemHistory.length - 1;
      let tabItem = tabItemHistory[lastIdx];
      tabItemHistory.splice(lastIdx, 1);
      this.activeTabItem = tabItem;
    } else {
      this.activeTabItem = "main";
    }
  },
  /**
   * 移除指定tab历史
   * @param {*} itemName 
   */
  removeHistoryByItem(itemName) {
    let newHistory = [];
    for (let i = 0; i < tabItemHistory.length; i++) {
      if (tabItemHistory[i] != itemName) {
        newHistory.push(tabItemHistory[i]);
      }
    }
    tabItemHistory = newHistory;
  },
  /**
   * 设置当前tab页面
   */
  setTabItem(item) {
    if (this.activeTabItem == item.id || item.isFloatItem()) {
      return
    }
    /**
     * 记录上一个显示的tab
     */
    tabItemHistory.push(this.activeTabItem);
    this.activeTabItem = item.id;
    item.isShow = true;
  },
  /**
   * 关闭tabitem
   * @param {*} item 
   */
  closeTabItem(item) {
    let isFloat = item.isFloat;
    item.x = 0;
    item.y = 0;
    item.zIndex = 500;
    item.isShow = false;
    item.isFloat = false;
    this.removeHistoryByItem(item.id);
    //非浮动状态下切换tab页
    if (!isFloat && this.activeTabItem == item.id) {
      this.popTabItem();
    }
  },

  /**
   * 复位窗口
   */
  minimize(item) {
    console.log("最小化？")
    item.x = 0;
    item.y = 0;
    item.zIndex = 500;
    item.isFloat = false;
    this.setTabItem(item);
    tabManage.sizeChanges();
  },
  /**
   * 最大化窗口
   */
  maximize(item) {
    tabManage.sizeChanges();
    item.isMaximize = !item.isMaximize;
    if (item.isMaximize) {
      //zindex置顶
      item.setZIndexTop();
    };
    console.log(item, 'item')
  },
  /**
   * 根据itemid查询item
   * @param {*} itemId 
   */
  getItemById(itemId) {
    for (let i = 0; i < childrenList.length; i++) {
      if (childrenList[i].id == itemId) {
        return childrenList[i];
      }
    }
    return null
  },
  sizeChanges() {
    console.log("改变")
    vm.$emit(operate.pageSize)
  },
  getDesignerChildren() {
    return childrenList;
    var designerArr = [];
    for (var i = 0; i < 7; i++) {
      designerArr.push(childrenList[i]);
    }
    designerArr.push(childrenList[childrenList.length - 2]);
    designerArr.push(childrenList[childrenList.length - 1]);
    return designerArr;
  },
  getBusinessChildren() {
    var businessArr = [];
    for (var i = 7; i < childrenList.length; i++) {
      businessArr.push(childrenList[i]);
    }
    return businessArr;
  }
}
export {
  childrenList,
  tabManage
}

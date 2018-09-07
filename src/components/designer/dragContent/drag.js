//import * as d3 from 'd3';
import {
  select as d3_select,
  event as d3_event,
} from "d3-selection";
import {
  drag as d3_drag
} from "d3-drag";
import {
  tabManage
} from '../tabmanage'
class titleDrag {
  constructor(item) {
    this.item = item;
    this.initTabDragEvent(this.item.id);
    this.initTitleDragEvent(this.item.id);
    this.dragSize(this.item.id);
  }
  createDrag(callback) {
    let startPt = {};
    return d3_drag()
      .on("start", function (d) {
        startPt.x = d3_event.x;
        startPt.y = d3_event.y;
      })
      .on("drag", function (d) {
        let offsetX = d3_event.x - startPt.x;
        let offsetY = d3_event.y - startPt.y;
        callback(offsetX, offsetY, d3_event, d3_select(this));
      }).on("end", function (d) {

      });
  }
  /**
   * 初始化tab页拖动
   * @param {*} elId 
   */
  initTabDragEvent(elId) {
    let _this = this;
    let startPt = {};
    var drag = this.createDrag((offsetX, offsetY, event) => {
      if (offsetX > 10 || offsetY > 10) {
        tabManage.sizeChanges();
        if (!this.item.isFloatItem()) {
          this.item.floatItem();
        }
      }
      if (this.item.isFloatItem()) {
        this.item.setPos(event.x-200, event.y + 40)
      }
    })
    d3_select(`#${elId}`).call(drag);

  }
  /**
   * 初始化标题拖动
   * @param {*} elId 
   */
  initTitleDragEvent(elId) {
    let startPt = {};
    let drag = this.createDrag((offsetX, offsetY, event, target) => {
      let itemId = target.attr("itemId");
      let item = tabManage.getItemById(itemId);
      if (item) {
        item.movePosOffset(offsetX, offsetY);
      }
    })
    d3_select(`#dragtitle${elId}`).call(drag);

    d3_select(`#dragtitle${elId}`).on("click", () => {
      console.log(this.item.setZIndexTop());
    })
  }
  /**
   * 更改窗口大小
   * @param {*} elId 
   */
  dragSize(elId) {
    let startPt = {};
    let drag = d3_drag()
      .on("start", function (d) {
        startPt.x = d3_event.x;
        startPt.y = d3_event.y;
      })
      .on("drag", function (d) {
       
        let offsetX = d3_event.x - startPt.x;
        let offsetY = d3_event.y - startPt.y;
        let itemId = d3_select(this).attr("itemId");
        let item = tabManage.getItemById(itemId);
        if (item) {
          item.setSizeByOffsetXY(offsetX, offsetY);
        }
        startPt.x = d3_event.x;
        startPt.y = d3_event.y;
      }).on("end", function (d) {

      });
    d3_select(`#dragSize${elId}`).call(drag);
  }
}
export default titleDrag;

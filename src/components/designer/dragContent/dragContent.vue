<template>
  <div class="drag-content-box" :id="'dragcontent'+item.id" 
    ref="dragBox" :class="{'drag-fixed':item.isFloatItem()}"
    :style="{ left: item.getX(), top: item.getY() , width: item.getWidth() , height: item.getHeight() ,zIndex:item.getzIndex()}">
    <div class="drag-title" :id="'dragtitle'+item.id"  :itemId="item.id" >
      <div class="drag-title-fl" ref="dragTit">{{item.name}}</div>
      <div class="drag-fn">
        <a href="javascript:;" class="iconfont icon-zuixiaohua" title="最小化" @click.stop="minimizeFn"></a>
         <a href="javascript:;" class="iconfont icon-zuidahua" title="最大化" @click.stop="maximizeFn"></a>
         <a href="javascript:;" class="iconfont icon-guanbi1" title="关闭" @click.stop="closeFn"></a>
      </div>
    </div>
    <div class="drag-content" 
    :class="{
      'h-change-line1':isWidth<740,
      'h-change-line2':isWidth<960&&isWidth>740,
      'h-change-line3':isWidth<1300&&isWidth>960,
      'h-change-line4':isWidth<1600&&isWidth>1300,
      'h-change-line5':isWidth<2300&&isWidth>1600}">
      <slot></slot>
    </div>
    <div class="drag-size" ref="dragSize" :id="'dragSize'+item.id" :itemId="item.id"></div>
  </div>
</template>
<script>
import {vm,operate} from '@/script/operate'
import { tabManage } from "../tabmanage";
import titleDrag from "./drag.js";
export default {
  props: ["item"],
  data() {
    return {
      drag: null,
      isWidth:0,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.drag = new titleDrag(this.item);
      let el = document.getElementById('dragcontent'+this.item.id)
      setTimeout(()=>{
        this.isWidth = this.getIsWidth();
      })
      vm.$on(operate.pageSize,()=>{
        setTimeout(()=>{
          this.isWidth = this.getIsWidth();
        },100);
      })
    });
  },
  methods: {
    getIsWidth(){
      let el = document.getElementById('dragcontent'+this.item.id)
      if( el ){
        return el.offsetWidth;
      }
    },
    minimizeFn() {
      tabManage.minimize(this.item);
    },
    maximizeFn(e) {
      tabManage.maximize(this.item);
    },
    closeFn() {
      tabManage.closeTabItem(this.item);
    }
  }
};
</script>
<style lang="less" scoped>
.drag-content-box {
	/*transition : all .2s linear 0s;*/
   /*transition: width,height 0.2s ease;*/
  .drag-title {
    display: none;
    line-height: 50px;
    height: 50px;
    border-bottom: 1px solid #e6e8eb;
    .drag-title-fl {
      font-size: 16px;
      color: #333;
      padding: 0 0 0 15px;
      cursor: move;
      user-select: none;
    }
    .drag-fn {
      position: absolute;
      top: 0;
      right: 15px;
      .iconfont {
        color: #ccc;
        font-size: 14px;
        margin: 0 0 0 5px;
        text-decoration: none;
      }
      .icon-guanbi1 {
        font-size: 13px;
      }
    }
  }
}
div.drag-fixed {
  position: fixed;
  width: 700px;
  height: 700px;
  box-shadow: 0 0 15px 0px #e0e0e0;
  background: #fff;
  z-index: 200;
  .drag-title {
    display: block;
  }
  .drag-size {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 10px;
    height: 10px;
    overflow: hidden;
    cursor: se-resize;
    background-color: #ccc;
    user-select: none;
  }
  .drag-box {
    .domain-box {
      top: 50px;
      overflow: scroll;
    }
  }
  .drag-content {
    position: absolute;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 0px;
    // overflow: scroll;
  }
}
</style>



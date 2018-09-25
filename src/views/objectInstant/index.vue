<template>
<div id="creator-box">
  <div class="nav_bar">
    <head-content></head-content>
  </div>
  <!-- <bk-tabs :activeTab="activeTab" @chooseOne="getCurrentTarget"></bk-tabs> -->
  <div class="class-box">

  
  <div class="root" :class="{'left-hide':hideLeft&&!hideRight,'default':!hideLeft&&!hideRight,'right-hide':hideRight&&!hideLeft,'hide-both':hideLeft&&hideRight}">
    <div class="left">
      <left-content></left-content>
    </div>
    <div class="middle" >
      <middle-content :dataId="activeTab" childName="地图编辑" childValue="main" :class="{zindex:true}"></middle-content>
				<!-- <object-query childName="对象查询" childValue="objectQuery" v-if="tabManage.getItemById('objectQuery').isShow" :class="{zindex:tabManage.getItemById('objectQuery').isTabActive()}"></object-query>
    		<object-data childName="数据对象" childValue="objectData" v-if="tabManage.getItemById('objectData').isShow" :class="{zindex:tabManage.getItemById('objectData').isTabActive()}"></object-data>
    		<behavior-list childName="行为列表" childValue="behaviorList" v-if="tabManage.getItemById('behaviorList').isShow" :class="{zindex:tabManage.getItemById('behaviorList').isTabActive()}"></behavior-list> -->
    </div>
    <div class="right">
      <!-- <right-content :hideRight="hideRight"></right-content> -->
    </div>
  </div>
  </div>
</div>
  
</template>

<script>
import { vm, operate } from "@/script/operate";
import { allOtype } from "@/script/allOtype";
import _dispatch from "@/script/dispatchEvent";

import loadingPage from "@/components/loadingPage";
import { tabManage } from "@/components/designer/tabmanage";

export default {
  data() {
    return {
      hideLeft: false,
      hideRight: true,
      pageDelay: 200,
      pageTimeout: 5000,
      activeTab: null,
      tabManage: tabManage
    };
  },
  components: {
 
    headContent: () => import("@/views/headContent/mainContent"),
    middleContent: () => ({
      component: import("./middle/middleContent"),
      loading: loadingPage,
      delay: this.pageDelay,
      timeout: this.pageTimeout
    }),
    bkTabs: () => ({
      component: import("@/views/objectInstant/middle/bkTabs"),
      loading: loadingPage,
      delay: this.pageDelay,
      timeout: this.pageTimeout
    }),
  /*   objectData: () => ({
      component: import("./middle/middleContent/objectData"),
      loading: loadingPage,
      delay: this.pageDelay,
      timeout: this.pageTimeout
    }), */
    objectQuery: () => ({
      component: import("./middle/middleContent/objectQuery"),
      loading: loadingPage,
      delay: this.pageDelay,
      timeout: this.pageTimeout
    }),
    behaviorList: () => ({
      component: import("./middle/middleContent/behaviorList"),
      loading: loadingPage,
      delay: this.pageDelay,
      timeout: this.pageTimeout
    })
  },
  mounted() {
    this.listenEvent();
  },
  methods: {
    getCurrentTarget(id) {
      this.activeTab = id;
    },
    toggleLeft() {
      this.hideLeft = !this.hideLeft;
    },
    toggleRight() {
      this.hideRight = !this.hideRight;
    },
    listenEvent() {
      vm.$on(operate.changeSlider, data => {
        for (let key in data) {
          this[key] = data[key];
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@left: 300px;
@right: 300px;
@transition: all 0.2s linear;
#creator-box {
  position: relative;
  width: 100%;
  height: 100%;
  .nav_bar {
    width: 100%;
    height: 53px;
    position: relative;
    /*z-index: 35;*/
  }
}
.root(@left:0px,@right:0px) {
  position: relative;
  width: 100%;
  height: calc(~"100% - 13px");
  z-index: 20;
  .left {
    width: @left;
    height: 100%;
    float: left;
    
    overflow: hidden;
    /*position: absolute;
    box-shadow: 0 -1px 5px #999;
    left:0;*/
    transition: @transition;
    background-color: #fff;
    border-top: 1px solid #f1f1f1;
  }
  .middle {
    height: 100%;
    width: calc(~"100% - " @left + @right);
    /*width: 100%;*/
    float: left;
    transition: @transition;
    position: relative;
    z-index: 20;
  }
  
  .right {
    position: relative;
    z-index: 300;
    width: @right;
    height: 100%;
    float: right;
    background-color: #fff;
    transition: @transition;
    border-top: 1px solid #f1f1f1;
  }
  .user {
    position: absolute;
    width: 330px;
    height: 76px;
    right: calc(~"20px + " @right);
    top: 20px;
    z-index: 30;
    border-radius: 3px;
    cursor: pointer;
    transition: @transition;
  }
}
.default {
  .root(@left,@right);
}
.left-hide {
  .root(0px,@right);
}
.right-hide {
  .root(@left,0px);
}
.hide-both {
  .root(0px,0px);
}
/*::-webkit-scrollbar-thumb{
    background-clip:none !important;
  }*/
.class-box {
  /*position: absolute;
  float: left;
  transition: @transition;
  z-index: 1000;*/
  /*
   * 如果加上tab页，则需要减40px
   * height: calc(~'100% - 40px');*/
  height: 100%;
  width: 100%;
}
.zindex {
  z-index: 115;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
}
</style>



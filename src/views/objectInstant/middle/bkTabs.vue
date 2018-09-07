<template>
  <div id='tabs'>
    <ul class="tabs-list float-left" >
      <li v-for="(item,index) in lists" :key="index" :class="{actived:tabManage.activeTabItem===item.id}"  
          :id="item.id" @click.prevent="chooseChild(item, $event)" v-show="item.isTabShow()" class="float-left children-tab">
        <p>{{item.name}}</p>
        <div class="close" v-if="index!=0&&tabManage.activeTabItem===item.id" @click.stop="closeTarget(item,index)">
          <i class="iconfont icon-guanbi1"></i>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { tabManage } from "@/components/designer/tabmanage";
export default {
  data() {
    return {
      lists: tabManage.getDesignerChildren(),
      tabManage: tabManage
    };
  },
  props: ["activeTab"],
  components: {},
  mounted() {
    this.tabManage.setTabItem(this.lists[0]);
  },
  watch: {
    activeTab(val){
      console.log(val,'val')
    }
  },
  computed: {},
  methods: {
    chooseChild(item, event) {
      this.tabManage.setTabItem(item);
    },
    closeTarget(item, index) {
      this.tabManage.closeTabItem(item);
    }
  }
};
</script>

<style lang="less" scoped>
 
/*tab公共页样式*/
#tabs {
    height: 40px;
    width: 100%;
    background-color: #f5f7fa;
    position: relative;
    z-index: 30;
  .fixed-active {
    position: fixed;
    width: 300px;
    height: 50px;
    line-height: 50px;
  }
  .tabs-list {
    justify-content: flex-start;
    width: 100%;
    height: 40px;
    display: flex;
  }
  .tabs-list > li {
    width: 155px;
    height: 100%;
    border-right: 1px solid #e1e3e6;
    border-bottom: 1px solid #e1e3e6;
  }
  .tap {
    width: 100%;
    height: 30px;
    background-color: #f5f5f5;
    position: absolute;
    top: 40px;
    display: flex;
    cursor: pointer;
    align-items: center;
    border-bottom: 1px solid #f1f1f1;
  }
  .tap-content {
    width: 155px;
    /* height: 100%; */
    /* margin: 10px 0; */
    text-align: center;
    font-size: 12px;
    color: #333;
    /* background-color: red; */
    justify-content: space-between;
    padding-left: 20px;
    padding-right: 12px;
    border-right: 1px solid #f1f1f1;
  }
  .tap-content i {
    font-size: 12px;
    color: #333;
  }
  .tap-content p {
    width: 70px;
    text-align: center;
  }
  .height {
    width: 100%;
    height: 40px !important;
    font-size: 12px;
    line-height: 40px;
    text-align-last: center;
    cursor: pointer;
  }
  .main {
    height: 40px;
  }
  .children-list {
    width: 10%;
    position: relative;
    /* z-index: 101; */
  }
  .children-list li {
    background-color: #fff;
  }
  .children-tab {
    position: relative;
    z-index: 100;
    background-color: #f2f4f7;
    cursor: pointer;
  }

  .border-bottom {
    border-bottom: 1px solid #e1e3e6;
  }
  .children-tab  {
    // border-left: 1px solid rgba(0,0,0,0);
    // border-right: 1px solid rgba(0,0,0,0);
    transition: all 0.2s ease;
    p {
    text-align: center;
    position: absolute;
    top: 50%;
    width: 100%;
    transform: translateY(-50%);
    color: #999;
    // border-left: 1px solid #e1e3e6;
    }
    em {
      position: absolute;
      top: 13px;
      left: 0;
      width: 1px;
      height: 15px;
      display: block;
      background: #e1e3e6;
      transition: all 0.2s ease;
    }
  }
  .children-tab:nth-of-type(1) em{
    opacity: 0;
  }
  .close {
    position: absolute;
    right: 5px;
    color: #999;
    top: 18px;
    font-size: 10px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    text-align: center;
    line-height: 20px;
    transform: scale(0.8) translateY(-50%);
  }
  .close:hover{
    background-color: #999;
    color: #fff;
  }
  .close i{
    font-size: 10px;
    // transform: scale(0.5);
  }
  .posirelate {
    position: relative;
    width: 180px;
  }
  .posirelate p {
    width: 150px;
  }
  .list {
    position: absolute;
    top: 41px;
    z-index: -1;
  }
  .slider-enter-active,
  .slider-leave-active {
    transition: all 0.5s;
  }
  .slider-enter,
  .slider-leave-to {
    transform: translateY(-100%);
    opacity: 0;
  }

  li.actived {
    background-color: #f7f9fc;
    border-bottom: 1px solid #f7f9fc;
    p {
        color: #333;
    }
  }
}


.no-data {
    position: relative;
    width: 100%;
    height: 400px;
   .no-data-m {
       position: absolute;
       top: 50%;
       left: 50%;
       transform: translate(-50%,-50%);
       color: #c6c8cc;
       font-size: 14px;
       text-align: center;
       .no-data-img {
        width: 120px;
        height: 120px;
        /*background: #fff url(../../../static/images/no-data.png) center no-repeat;*/
        background-size: 100% 100%;
        margin-bottom: 10px;
       }
   }
} 
 

</style>
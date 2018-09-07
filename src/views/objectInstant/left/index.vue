<template>
  <div class='left-content'>
    <object-list v-show="!ifEdit"></object-list>
    <otype-list v-show="ifEdit" :diagrams="diagrams"></otype-list>
    <ul class="tag-menu" v-show="false">
      <li @click="showLeft('object')" :class="{current:currentTab=='object'}">
        <i class="iconfont icon-lifangti-shixin"></i>
        <p>对象</p>
        <div></div>
      </li>
      <li @click="showLeft('otype')" :class="{current:currentTab=='otype'}">
        <i class="iconfont icon-shujuyuanguanli"></i>
        <p>类模板</p>
        <div></div>
      </li>
    </ul>
  </div>
</template>
<script>
import psde from "@/psde";
import ImageManage from "@/psde/ImageManage";
import { allOtype } from "@/script/allOtype";
import { vm, operate } from "@/script/operate";
import objectService from "@/request/object.service.js";
export default {
  data() {
    return {
      ifEdit:false,
      otypes:[],
      currentTab:'object',
    };
  },
  props: ['diagrams'],
  components: {
    objectList:()=>import('./objectList'),
    otypeList:()=>import('./otypeList')
  },
  computed: {},
  mounted() {
    this.listenEvent()
  },
  methods: {
    listenEvent(){
      vm.$on(operate.ifEdit,obj=>{
        this.ifEdit = obj.status;
        if(this.ifEdit){
          this.currentTab = 'otype'
        }else{
          this.currentTab = 'object';
        }
      });
      vm.$on(operate.showLeft,str=>{
        if(str=='otype'){
          this.ifEdit = true;
        }else{
          this.ifEdit = false;
        }
      });
      vm.$on(operate.generalEdit,obj=>{
        if(obj.status){
          this.currentTab = 'otype';
          this.ifEdit = true;
        }else{
          // this.currentTab = 'object';
        }
      })
    },
    showLeft(str){
      this.currentTab = str;
      vm.$emit(operate.showLeft,str)
    },
  }
};
</script>
<style lang='less' scoped>
.left-content {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  border-right: 1px solid #e1e3e6;
  .tag-menu{
  position: absolute;
  width: 45px;
  height: 120px;
  background-color: #fff;
  z-index: 500;
  left: 300px;
  top: 39px;
  border-right: 1px solid #e1e3e6;
  border-bottom: 2px solid #e1e3e6;
  li{
    height: 60px;
    // text-align: center;
    // line-height: 50px;
    border-bottom: 1px solid #f5f7fa;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 5px;
    color: #999;
    i{
      font-size: 14px;
      line-height: 10px;
    }
    p{
      font-size: 12px;
      padding: 0;
      margin: 0;
      margin-bottom: 2px
    }
    div{
      width: 14px;
      height: 3px;
      background-color: #176de6;
      opacity: 0;
      border-radius: 1.5;
    }
  }
  .current{
    color: #176de6;
    background-color: #f1f1f1;
    div{
      opacity: 1;
    }
  }
  li:hover{
    background-color: #f1f1f1;
  }
}
}
</style>
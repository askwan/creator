<template>
  <div class='root'>
    <div class="ev-tab" v-for="(tab,i) in comLists" :key="i" :class="{'current':tab.name==currentTab}" @click="chooseTab(i,tab)">
      <i class="iconfont" :class="tab.icon"></i>
      <p>{{tab.text}}</p>
      <div class="bottom-br"></div>
    </div>
  </div>
</template>
<script>
  import {vm,operate} from '@/script/operate'
  export default {
    data(){
      return {
        lists: [
					{ name: 'propertyTab', text: '属性', isDisplay: false,icon:'icon-jibenxinxi' },
					{ name: 'spacetimeTab', text: '时空', isDisplay: false,icon:'icon-diqiu2' },
					{ name: 'formTab', text: '形态', isDisplay: false,icon:'icon-xt' },				
				 	// { name: 'locationTab', text: '位置', isDisplay: false,icon:'icon-weizhi' },
					{ name: 'relationsTab', text: '关系', isDisplay: false,icon:'icon-Group' },
          	{ name: 'behaviorTab', text: '行为', isDisplay: false,icon:'icon-jiantou-copy' },
          // { name: 'versionTab', text: '历史', isDisplay: false,icon:'icon-lishi' },
          // { name: 'relationOperate', text: '创建', isDisplay: false,icon:'icon-lishi' }
        ],
        // currentTab:'propertyTab',
        ifEdit:false
      }
    },
    props:{currentTab:String},
    components:{},
    computed:{
      comLists(){
        // if(this.ifEdit){
        //   // this.currentTab = 0;
        //   this.$emit("chooseCom",{
        //     name:'propertyTab'
        //   });
        //   return this.lists.filter(el=>el.name==='propertyTab')
        // }else{
        //   return this.lists;
        // }
        return this.lists;
      }
    },
    mounted(){
      this.listenEvent();
    },
    methods:{
      chooseTab(i,tab){
        // this.currentTab = i;
        vm.$emit(operate.changeSlider,{hideRight:false});
        this.$emit("chooseCom",{
          name:tab.name
        });
      },
      listenEvent(){
        vm.$on(operate.ifEdit,obj=>{
          this.ifEdit = obj.status;
        })
      }
    
    }
  }
</script>
<style lang='less' scoped>
  .root{
    width: 100%;
  }
  .ev-tab{
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding-top: 5px;
    flex-direction: column;
    transition: all 0.2s linear;
    // background-color: red;
    color:#999;
    user-select: none;
    cursor: pointer;
    i{
      font-size: 14px;
      line-height: 10px;
    }
    p{
      padding: 0;
      margin-bottom: 2px;
    }
    .bottom-br{
      width: 14px;
      height: 3px;
      background-color: #176de6;    
      opacity: 0;
      border-radius: 1.5px;
    }
  }
  
  .current{
    background-color: #f1f1f1;
    color:#176de6;
  }
  .show-br{
    opacity:1 !important;
    transition: opacity .2s linear;
  }
  .ev-tab:hover{
    background-color: #f1f1f5;
  }
</style>
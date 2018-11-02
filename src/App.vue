<template>
  <div id="app" class="fill">
    <nav class="header-box">
      <header-box></header-box>
    </nav>
    <div class="map-content">
      <router-view/>
    </div>
  </div>
</template>

<script>

import {vm,operate} from '@/script/operate'
export default {
  name: 'App',
  mounted(){
    vm.$on(operate.notice,obj=>{
      if(obj.message){
        obj.message = obj.message.slice(0,20);
      }else{
        obj.message = '未知错误'
      };
      obj.type = obj.type || 'info';
      obj.title = obj.title || '提示';
      this.$notify(obj);
    });
    // window.onbeforeunload = function() {
    //     return context.save();
    // };
  },
  methods:{
    history(){
      vm.$emit(operate.openTab,{name:'history'});
    }
  },
  components:{
    'headerBox':()=>import('@/components/header')
  },
}
</script>

<style scoped lang='scss'>
  $height:53px;
  .header-box{
    height: $height;
    border-bottom: 1px solid #ccc;
  }
  .map-content{
    position: absolute;
    left:0;
    right: 0;
    top: $height;
    bottom:0;
  }
  .fade-enter-active, .fade-leave-active {
    transition: all 2s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>

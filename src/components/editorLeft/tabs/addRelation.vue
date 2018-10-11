<template>
  <div class='add-relations fill'>
    <div class="relations-head pd-left-small pd-right-small mg-bottom-small">
      <common-head title="创建关系" @back="back"></common-head>
    </div>
    <div class="relations-operate pd-big">
      <relation-operate></relation-operate>
    </div>
  </div>
</template>
<script>
  import {vm,operate} from '@/script/operate'
  export default {
    data(){
      return {

      }
    },
    props:{},
    components:{
      relationOperate:()=>import('../components/relationOperate.vue'),
      commonHead:()=>import('@/components/common/tabHead.vue')
    },
    computed:{},
    mounted(){

    },
    methods:{
      back(){
        console.log('back');
        vm.$emit(operate.changeTab,{name:'diagramList'})
      }
    }
  }
</script>
<style lang='scss' scoped>
  .add-relations{
    background: #fff;
    .relations-head{
      border-bottom: 1px solid #ccc;
    }
    
  }
  
</style>
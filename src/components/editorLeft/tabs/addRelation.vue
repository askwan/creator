<template>
  <div class='add-relations fill pd-small'>
    <common-head title="创建关系" @back="back"></common-head>
    <relation-operate></relation-operate>
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
  }
  
</style>
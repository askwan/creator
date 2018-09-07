<template>
  <div class='tabs-roots'>
    <ul class="navs-tabs">
      <li class="tabs-left" :class="{active:currentTab==0}" @click="changeTab(0)">对象类</li>
      <li class="tabs-left" :class="{active:currentTab==1}" @click="changeTab(1)">实例化对象</li>
    </ul>
    <div class="content">
      <o-otype v-show="currentTab==0" :calcTop="calcTop"></o-otype>
      <o-otyped v-show="currentTab==1"></o-otyped>
    </div>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        currentTab:0
      }
    },
    props:["calcTop"],
    components:{
      oOtype:()=>import("./oOtype"),
      oOtyped:()=>import("./oOtyped")
    },
    computed:{},
    mounted(){

    },
    methods:{
      changeTab(tab){
        this.currentTab = tab;
      }
    }
  }
</script>
<style lang='less' scoped>
  @nav:40px;
  .tabs-roots{
    position: absolute;
    bottom: 0px;
    left: 0;
    right: 0;
    top: 0px;
  }
  .navs-tabs{
    height: @nav;
    display: flex;
    user-select: none;
    border-top:1.5px solid #e8eaed;
    .tabs-left{
      width: 50%;
      display: flex;
      height: 100%;
      color:#666;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      background: #f0f2f5;
      transition: all .3s linear;
    }
    .tabs-left:nth-of-type(1){
      border-right: 1px solid #f7f7f7;
    }
  }
  .active{
    background: #f7fafc !important;
    color:#333 !important;
  }
  .content{
    position: absolute;
    bottom:0px;
    top: @nav;
    left: 0;
    right: 0;
    box-shadow: none;
    // background-color: red;
    overflow-y: auto;
  }
</style>
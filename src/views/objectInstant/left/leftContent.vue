<template>
  <div class="root-left-content" :class="{'cursor-move':isMove}" @mouseup="end" @mousemove="move">
    <!-- <div class="o-header">
      <o-header></o-header>
    </div> -->
    <div class="o-tree" :style="{height:calcHeight+'px'}">
      <o-tree ></o-tree>
    </div>
    <div class="o-move" @mousedown="begin" ></div>
    <div class="o-tabs" :style="{top:calcTop+'px'}">
      <o-tabs :calcTop="calcTop"></o-tabs>
    </div>
  </div>
</template>

<script>
  import oTree from './tree1'
  import oHeader from './header'
  import oTabs from './tabs'
  export default {
    data(){
      return {
        startY:0,
        moveY:0,
        isMove:false,
        endY:300,
      }
    },
    props:{},
    // components:{
    //   oTree:()=>import("./tree"),
    //   oHeader:()=>import("./header"),
    //   oTabs:()=>import("./tabs")
    // },
    components:{
      oTree,
      oHeader,
      oTabs
    },
    computed:{
      calcHeight(){
        return this.endY+this.moveY - this.startY
      },
      calcTop(){
        return this.endY+120+this.moveY-120 - this.startY
      }
    },
    mounted(){

    },
    methods:{
      begin(event){
        this.isMove = true
        this.startY = event.screenY;
        this.moveY = event.screenY;
      },
      move(event){
        if(this.isMove){
          this.moveY = event.screenY;
          if(this.calcHeight>=120){
            this.moveY = event.screenY
          }else{
            this.moveY =this.startY-this.endY+120;
          }
        }
      },
      end(){
        this.isMove = false;
        this.endY = this.calcHeight;
        this.startY = 0;
        this.moveY = 0;
      }
    }
  }
</script>

<style lang="less" scoped>
  .root-left-content{
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 30;
    background-color: #f7fafc;
  }
  .o-header{
    width:100%;
    height: 110px;
  }
  .o-tree{
    width: 100%;
  }
  .o-move{
    width: 100%;
    height: 10px;
    cursor: n-resize;
    user-select: none;
    position: relative;
    z-index: 30;
    background-color: rgba(0,0,0,0);
  }
  .o-tabs{
    position: absolute;
    bottom:0;
    left:0;
    right: 0;
  }
  .cursor-move{
    cursor: n-resize !important;
  }
</style>
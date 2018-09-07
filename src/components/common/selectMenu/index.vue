<template>
  <div id='list' style="{height:listHight}"  class="pointer" @mouseleave="closeList">
    <div :class="{'list-title':true,'active':isShow,'flex':true}" :style="{'width':listWidth}" @mouseenter="hoverList" @click="clickList">
      <slot><span>{{listName}}</span></slot>
      <div class="icon" :class="{'rotate':isShow,'orgin':!isShow}" v-if="title"><i class="iconfont icon-icon1"></i></div>
    </div>
      <ul class="list-content hidden" >
        <transition name="slider">
          <div v-if="isShow" class="shawoe">
            <li v-for="(list,i) in lists" class="pointer" :class="{actived:i===actived}" :key="list.name" @click="selectList(list,i)" >{{list.name}}</li>
          </div>
        </transition>
      </ul>
  </div>
</template>

<script>
  
  export default {
    data () {
      return {
        isShow:false,
        actived:null
      }
    },
    props:{
      lists:{
        type:Array,
        required:true
      },
      title:{
        type:[String,Boolean,Number]
      },
      width:{
        type:[Number,String],
        default:100
      },
      height:{
        type:[Number,String],
        default:40
      },
      methods:{
        type:String,
        default:"hover"
      }
    },
    computed:{
      listWidth(){
        let width;
        if(this.width*1){
          width = this.width*1+"px";
        }else{
          width = this.width;
        };
        return width
      },
      childrenWidth(){
        let width;
        if(this.width*1){
          width = (this.width-2)*1+"px";
        }else{
          let num = this.width.split("px")[0]*1;
          width = (this.width-2)+"px";
          // width = this.width;
        };
        return width
      },
      listHight(){
        return this.height*1?this.height+"px":this.height;
      },
      listName(){
        let name;
        if(this.lists[this.actived]){
          name = this.lists[this.actived].name||this.title;
        }else{
          name = this.title;
        }
        return name;
      }
    },
    mounted(){
      // console.log(this.listWidth);
    },
    watch:{
      isShow(){
        // console.log(222)
      }
    },
    methods:{
      showList(){
        if(this.methods=="click"){
          this.isShow = true;
        }else if(this.methods=="hover"){
          this.isShow = true;
        }
      },
      hoverList(){
        if(this.methods =="hover") this.showList = true;
        this.isShow =this.methods=="hover"
      },
      clickList(){
        // console.log(this.methods)
        this.isShow = this.methods=="click";
        // console.log(this.isShow)
      },
      closeList(){
        this.isShow = false;
      },
      selectList(list,i){
        this.$emit("select",list);
        this.actived = i;
        this.isShow = false;
      }
    }
  }
</script>

<style scoped lang="less">
  #list{
    position: relative;
    z-index: 1000;
    height: 53px;
  }
  .list-content li{
    // height: 40px;
    text-align: center;
    line-height: 35px;
    font-size: 14px;
    color: #999;
    padding: 0 10px;
  }
  .list-title{
    // line-height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color:#666;
    height: 100%;
  }
  .list-content{
    position: absolute;
    z-index: 100;
    /* top:-2px; */
    // width: 100%;
    left:0;
    width: 120px;
    // overflow: hidden;
  }
  .list-content li:hover{
    background-color: #eee;
  }
  .active{
    background-color: #f1f1f1;
    
  }
  .rotate{
    transition: transform 0.2s;
    transform:rotate(180deg);
  }
  .orgin{
    transition: transform 0.2s;
    transform:rotate(0deg);
  }
  .slider-enter-active, .slider-leave-active {
    transition: all .2s;
    
  }
  .slider-enter, .slider-leave-to{
    transform: translateY(-100%);
    opacity: 0;
  }
  .hidden{
    overflow: hidden;
  }
  .shawoe{
    border: 1px solid #f1f1f1;
    background-color: #fff;
    max-height: 180px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .icon{
    // background-color: blue;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .icon i{
    font-size: 18px;
  }
  .pointer{
    cursor: pointer;
  }
  .actived{
    background-color: #f1f1f1 !important;
    color:#666 !important;
  }
  .flex{
    display: flex;
    align-items: center;
  }
</style>
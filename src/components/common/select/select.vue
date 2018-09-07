<template>
     <div class="select-box" :class="{'show-drop-down':downShow}">
       <!-- {{checked}} -->
       <div class="select-tit" @click="clickTitFn" :class="{'disabled-tit':disabled}">
         <!-- {{currentSelect}} -->
         <a href="javascript:;" v-for="(data,index) in dataList" :key="index" v-if="data[value] == val"><span>{{data[label]}}</span><i :class="{'active':downShow}" class="iconfont icon-shouqi-copy"></i></a>
       </div>
        <transition name="slide-fade">
       <div class="select-down" v-if="downShow">
          <a href="javascript:;" v-for="(data,index) in dataList" :key="index"  @click="selectClick(data)">
            {{data[label]}}
          </a>
       </div>
       </transition>
     </div>
</template>
<script>
export default {
  model: {
    prop: 'modelVal',
    event: 'modeFn'
  },
  props:[
    "modelVal",
    "label",
    "value",
    "dataList",
    "disabled"//是否禁用true为禁用
    ],
  data() {
    return {
      val: this.modelVal,
      downShow:false
    };
  },
  mounted(){
  },
  methods:{
    clickTitFn(){
      if( this.disabled ) return;
      this.downShow = !this.downShow;
      this.$nextTick(()=>{
        document.removeEventListener("click",this.clickOther)
        document.addEventListener("click",this.clickOther)
      })
    },
    clickOther(){
      this.downShow = false;
      this.$nextTick(()=>{
        document.removeEventListener("click",this.clickOther)
      })
    },
   selectClick(item){
     this.val = item.value;
     this.$emit("modeFn",item.value)
     this.$emit("selectClickFn",item);
   }
  }
};
</script>
<style lang="less" scoped>
.slide-fade-enter-active {
  transition: all .1s ease;
}
.slide-fade-leave-active {
  transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter {
  transform: translateY(-20px);
  opacity: 0;
}
 .slide-fade-leave-to {
  transform: translateY(0px);
  opacity: 0;
}
.show-drop-down {
  z-index: 100000;
}
 .select-box {
   position: relative;
   .select-tit {
     line-height: 37px;
     border-bottom: 1px solid #dedede;
     font-size: 14px;
     text-indent: 10px;
     &.disabled-tit{
       background: #f0f0f0;
     }
     a {
       text-decoration: none;
       color: #333;
       display: block;
       position: relative;
       span{
        display: block;
        max-width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
       }
     }
     .iconfont{
      position: absolute;
      top: 0;
      right: 0;
      transition: all .2s;
      transform-origin: center;
      &::before{
        margin-right: 9px;
      }
       &.active{
         transform: rotate(180deg);
       }
     }
   }
   .select-down {
     position: absolute;
     top: 42px;
     left: 0;
     right: 0;
     line-height: 37px;
     border: 1px solid #d1dbe5;
     box-shadow: 0 2px 4px rgba(0,0,0,.12), 0 0 6px rgba(0,0,0,.04);
     max-height: 195px;
     overflow-y: auto;
     background: #fff;
     a {
      display: block;
      text-decoration: none;
      color: #333;
      background: #fff;
      text-indent: 10px;
      font-size: 14px;
      height: 37px;
      word-break: break-all;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
       &:hover {
         background: #e4e8f1;
       }
       &.active {
         background: #20a0ff;
         color: #fff;
       }
     }
   }
 }
</style>

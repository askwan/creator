<template>
  <div class='bt-select' :style="{width:width,height:height}"  >
    <div class="bt-input-box" @click.stop="toggleSelect">
      <input type="text" @input="getSearchVal" :disabled="!filterable" placeholder="请选择" ref="input">
      <div class="down-icon" :class="{'ani-rotate':showSelect}" :style="{width:height,height:height,'line-height':height}">
        <i class="iconfont icon-icon1"></i>
      </div>
    </div>
    <div class="ani-hidden">
      <transition name="slider">
        <ul class="option-box" :style="{'min-height':height}" v-show="showSelect">
          <li v-if='list.length>0' class="option-content" :style="{height:height,'line-height':height}" v-for="(item,i) in list" :key="i" @click="getVal(item,i)" :class="{'bt-choosed':value[type.value]==item[type.value]}">{{item[type.label]}}</li>
          <li v-if="list.length==0" class="option-content">暂无数据</li>
        </ul>
      </transition>
      
    </div>
    
  </div>
</template>
<script>
  export default {
    data(){
      return {
        showSelect:false,
        searchVal:"",
      }
    },
    props:{
      'select-options':Array,
      value:{
        type:[Object]
      },
      type:{
        type:Object,
        default:{vlaue:"vlaue",label:"label"}
      },
      width:{
        type:String,
        default:"100%"
      },
      height:{
        type:String,
        default:"32px"
      },
      filterable:{
        type:Boolean,
        default:false
      }
    },
    components:{},
    computed:{
      list(){
        let arr = this.selectOptions.filter(item=>item[this.type.label]===this.searchVal);
        return arr.length>0?arr:this.selectOptions
      }
    },
    mounted(){
      if(this.value[this.type.label]){
        this.$refs.input.value = this.value[this.type.label];
      }
      
    },
    watch:{
     showSelect(val){
       if(val){
         document.addEventListener("mouseup",this.closeSelect)
       }else{
         document.removeEventListener("mouseup",this.closeSelect);
        //  this.value = {};
        //  this.$refs.input.value = this.value[this.type.label];
       }
     },
     value(val){
         this.$refs.input.value = val[this.type.label];
     }
    },
    methods:{
      toggleSelect(){
        this.showSelect = !this.showSelect;
        this.searchVal = "";
      },
      getVal(aim,i){
        this.showSelect = false;
        this.$emit("input",aim);
        this.searchVal = "";
      },
      closeSelect(){
        this.showSelect = false;
        
      },
      getSearchVal(){
        this.searchVal = this.$refs.input.value;
      }
    }
  }
</script>
<style lang='less' scoped>
  .bt-select{
    position: relative;
    cursor: pointer;
    .bt-input-box{
      padding: 0 8px;
      height: 100%;
      position: relative;
      
      input{
        height: 100%;
        cursor: pointer;
        background-color: #fff;
        display: block;
      }
      .down-icon{
        position: absolute;
        right: 8px;
        top:0;
        line-height: 1;
        transition: all .2s linear;
      }
    }
    .ani-rotate{
      transform:  rotateZ(180deg) !important;
    }
    .option-box{
      // left: 0px;
      // right: 0px;
      min-height: 32px;
      z-index: 500;
      // position: absolute;
      max-height: 160px;
      // margin-top: 5px;
      border-radius: 3px;
      box-shadow: 0 1px 5px #999;
      overflow-y: auto;
      overflow-x: hidden;
      background-color: #fff;
      
      .option-content{
        text-align: center;
        user-select: none;
        color:#666;
      }
      .option-content:hover{
        background-color: #f1f1f3;
        color: #333 !important;
      }
    }
  }
  .ani-hidden{
    overflow: hidden;
    left: 0px;
    right: 0px;
    z-index: 500;
    padding: 0 10px;
    position: absolute;
    margin-top: 5px;
    
  }
  .bt-choosed{
    background-color: #4388e9;
    color: #fff !important;
  }
  .slider-enter-active, .slider-leave-active {
    transition: all .5s;
    
  }
  .slider-enter, .slider-leave-to{
    transform: translateY(-100%);
    opacity: 0;
  }
</style>
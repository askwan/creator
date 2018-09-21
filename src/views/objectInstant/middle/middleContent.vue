<template>
  <div class='root-middle'>
   <div id="id-container"></div>
   <!-- <div class='property-root' id="property-root"></div> -->
   <div class="slider-box" :class="{'hidden-el':isOpen}">
     <transition name="slider">
          <instant-otype @closeOperate="closeOperate"></instant-otype>
      </transition>
   </div>
   
   
  </div>
</template>
<script>
import * as iD from "@/iD-2.7.1/modules"
import {vm,operate,getContext} from '@/script/operate';
import {allOtype} from '@/script/allOtype'
import psde from "@/psde";

import {initUi} from '../left/modes'
import IdEdit from '@/script/id_edit/IdEdit'
var context = {};
var position;
  export default {
    data(){
      return {
        isOpen:false,
        diagram:'',
        posi:{}
      }
    },
    props:["detail"],
    components:{
      instantOtype:()=>import('./instantOtype')
    },
    computed:{},
    watch:{
      posi(val){
        // console.log(val,'var')
      }
    },
    mounted(){
      this.$nextTick(()=>{
      	setTimeout(() => {
      		this.initIdEdit();
      		this.listenEvent();
      	} , 100)
      });

    },
    methods:{
      initIdEdit(){
        context = iD.Context().assetPath("static/");
        context.ui()(document.getElementById("id-container"), ()=>{
          console.log("ready");
//        initUi();
          context.flush();
          IdEdit.initEdit(context);
          getContext(context);
          this.setPosi();
        });
        context.on('selectEle',ele=>{
          vm.$emit(operate.changeSlider,{
            hideRight:false
          });
          let select = Object.assign({},context.entity(ele));
          vm.$emit(operate.instantOtype,select);
        });
      },
      listenEvent(){
        vm.$on(operate.openInstant,()=>{
          this.isOpen = true;
        });

        
      },
      closeOperate(){
        this.isOpen = false;
      },
      complate(){
        vm.$emit(operate.ifEdit,{status:false});
      },
      setPosi(){
				if(!window._POSITION_) return
				let posi = window._POSITION_;
				let map = context.map();
        map.centerZoom(posi.position, posi.zoom);
			},
    },
    destroyed(){
      let map = context.map();
      let posi = {
        position:map.center(),
        zoom:map.zoom()
      };
      window._POSITION_ = posi;
    }
  }
</script>
<style lang='less' scoped>
  .root-middle{
    height: 100%;
    width: 100%;
    position: relative;
    background-color: #f1f1f1;
  }
  .demo{
    position: absolute;
    left: 0px;
    top: 0px;
    // background-color: red;
    width: 80px;
    height: 50px;
    z-index: 1000;
    text-align: center;
    line-height: 50px;
    cursor: pointer;
  }
  .slider-enter-active, .slider-leave-active {
    transition: all .3s;
  }
  .slider-enter, .slider-leave-to{
    transform: translateX(-100%);
    opacity: 0;
  }
  .slider-box{
    position: absolute;
    top:0;
    bottom: 0;
    left: 0;
    right: 100%;
    overflow: hidden;
    transition: all .2s linear;
  }
  .hidden-el{
    right: 45%;
  }
  // .property-root{
  //   position: absolute;
  //   width: 300px;
  //   height: 100%;
  //   background-color: #f6f6f6;
  //   top: 0;
  //   right: 0;
  // }
  #sidebar{
    width: 100%;
  }
  // .width-300{
  //   width:calc(~'100% - 300px');
  // }
  .return{
    position: absolute;
    top: 10px;
    width: 100px;
    height: 40px;
    background-color: #fff;
    text-align: center;
    border-radius: 5px;
    font-weight: bold;
    z-index: 100;
    right: 50px;
    line-height: 40px;
    cursor: pointer;
  }
</style>
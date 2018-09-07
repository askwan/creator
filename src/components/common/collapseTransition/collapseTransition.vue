<template>
  <div >
    <div >
      {{judg}}
      <div class="box" :style="{'height':boxHeight}">
        <div ref="one">
           <slot></slot>
         </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props:['judg'],
  data() {
    return {
        boxHeight:"0px"
    };
  },
  watch:{
    "judg"(){
      console.log(111)
      // this.$nextTick().then(()=>{
          console.dir(this.$refs.one)
          let h = this.$refs.one.offsetHeight;
          if( this.judg ){
            this.boxHeight = h+"px";
          }else{
            this.boxHeight = "0px"
          }
          
      // })
      
    }
  },
  mounted(){
  },
  methods:{
   clickSortFn(){
   }
  }
};
</script>
<style lang="less" scoped>
  .box {
    overflow: hidden;
    transition: all .2s ease;
  }
</style>

<template>
    <div class="sub-menu-box">
       <slot name="title"></slot>
       <div class="down">
         <slot name="down"></slot>
       </div>
    </div>
</template>
<script>
export default {
  props:{
  },
  data() {
    return {
    };
  },
  mounted(){
  },
  methods:{
  }
};
</script>
<style lang="less" scoped>
 .sub-menu-box {
   &:hover {
     .down {
       display: block;
     }
   }
   .down {
     display: none;
   }
 }
</style>

<template>
    <div class="management-box">
      <head-content/>
        <left-content/>
        <div class="main-content-box">
			<middle-content/>
        </div>
    </div>
</template>
<script>
// import leftContent from './leftContent/mainContent'
// import headContent from '@/views/headContent/mainContent'
// import middle from './middle/middle'
export default {
  data() {
    return {};
  },
  components:{
    "left-content":()=>import("./leftContent/mainContent"),
    "middle-content":()=>import("./middle/middle"),
    //  "middle-content":middle,
    "head-content":()=>import("@/views/headContent/mainContent")
  },
  mounted(){
  }
};
</script>
<style lang="less" scoped>

</style>

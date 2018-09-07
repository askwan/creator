<template>
    <div class="left-box" >
      <help-content/>
      <!-- <user-info/> -->
    </div>
</template>
<script>
import titleArea from '@/components/titleArea'
import currentPageStatus from '@/components/currentPageStatus'
import helpContent from './helpContent'
// "title-area" : ()=>import("@/components/titleArea"),
//  "current-page-status" : ()=>import("@/components/currentPageStatus"),
//  "help-content" : ()=>import("./helpContent")
export default {
  data() {
    return {
    };
  },
  components:{
    "title-area" : titleArea,
    "current-page-status" : currentPageStatus,
    "help-content" : helpContent
  },
  mounted(){

  },
  methods:{
   
  }
};
</script>
<style lang="less" scoped>

</style>

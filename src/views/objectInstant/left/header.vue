<template>
  <div class='root'>
    <!-- <title-area/>
    <current-page-status/> -->
  </div>
</template>
<script>
  export default {
    data(){
      return {

      }
    },
    props:{},
    components:{
      titleArea : ()=>import("@/components/titleArea"),
      currentPageStatus : ()=>import("@/components/currentPageStatus"),
    },
    computed:{},
    mounted(){

    },
    methods:{

    }
  }
</script>
<style lang='less' scoped>
  .root{
    width: 100%;
    height: 110px;
    
  }
</style>
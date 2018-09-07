<template>
  <div class='location-root'>
    
  </div>
</template>
<script>
  export default {
    data(){
      return {

      }
    },
    props: ['ifEdit','objectDetail'],
    components:{},
    computed:{},
    activated(){
      console.log(this.objectDetail,'loacation')
    },
    methods:{

    }
  }
</script>
<style lang='less' scoped>

</style>
<template>
  <div class='diagram-list'>
    <otype-list :entityObj="entity"></otype-list>
  </div>
</template>
<script>
  import {State} from '@/script/editor/utils/store'
  export default {
    data(){
      return {
        diagrams:[],
      }
    },
    props:{
      entity:{
        type:Object,
        default:{}
      }
    },
    components:{
      'otype-list':()=>import('../components/otypeList')
    },
    computed:{},
    mounted(){
      this.diagrams = State.diagrams;
    },
    methods:{

    }
  }
</script>
<style lang='scss' scoped>

</style>
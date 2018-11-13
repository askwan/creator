<template>
  <div class='root fill pd-small floor-manage'>
    <el-checkbox-group class="flex check-floor-box" v-model="checkedObjects" @change="handleChanged">
      <el-checkbox v-for="i in 10" border v-model="floor" class="mg-bottom-small mg-left-small" :label="'构筑物'+i" :key="i" :value='i'></el-checkbox>
    </el-checkbox-group>
  </div>
</template>
<script>
  import {State} from '@/script/editor/utils/store'
  import {vm,operate,getEditor} from '@/script/operate';
  let idEditor;
  export default {
    data(){
      return {
        floor:0,
        checkedObjects:[],
      }
    },
    props:['show'],
    components:{},
    computed:{},
    mounted(){
      
    },
    watch:{
      floor(val){
        if(typeof val =='number'){
          console.log(val);
        }
      },
      show(bool){
        console.log(bool)
      }
    },
    methods:{
      handleChanged(val){
        console.log(val,'chage')
      }
    },
    destroyed() {
      console.log('destoryed')
    },
    deactivated() {
      console.log('close')
    },
  }
</script>
<style lang='scss' scoped>
  .floor-manage{
    background-color: #fff;
    overflow-y: auto;
    .check-floor-box{
      flex-direction: column;
      justify-content: flex-start;
    }
  }
</style>
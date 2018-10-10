<template>
  <div class='domain-tab pd-big'>
    <h3 class="font-16 mg-bottom-big align-center">
      对象的时空参照
    </h3>
    <el-form size='mini' label-width="70px">
      <el-form-item label="时间参照">
        <el-input v-model="trs" @change="changeTrs"></el-input>
      </el-form-item>
      <el-form-item label="空间参照">
        <el-input v-model="srs" @change="changeSrs"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import {vm,operate,getEditor} from '@/script/operate';
  export default {
    data(){
      return {
        trs: "",
        srs: ""
      }
    },
    props:["objectDetail"],
    components:{},
    computed:{},
    watch:{
      'objectDetail.id'(){
        this.getData();
      }
    },
    mounted(){
      this.getData();
    },
    activated(){
      this.getData();
    },
    methods:{
      getData(){
        this.trs = '';
        this.srs = '';
        let sobject = this.objectDetail;
        if(sobject.trs){
          this.trs = sobject.trs.id;
        }
        if (sobject.srs) {
          this.srs = sobject.srs.id;
        }
      },
      changeTrs(val){
        let idEdit = getEditor();
        this.objectDetail.trs.id = val;
        idEdit.updateObject(this.objectDetail);
      },
      changeSrs(val){
        let idEdit = getEditor();
        this.objectDetail.srs.id = val;
        idEdit.updateObject(this.objectDetail)
      }
    }
  }
</script>
<style lang='scss' scoped>

</style>
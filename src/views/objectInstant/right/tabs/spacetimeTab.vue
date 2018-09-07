<template>
  <div class='spacetime-root'  v-show="objectDetail.id">   
<h3 >对象的时空参照</h3>
    <el-row :gutter="20">
      <el-col :span="7"><div class="grid-content bg-purple">时间参照</div></el-col>
      <el-col :span="17"><div class="grid-content bg-purple"><el-input :disabled="!ifEdit" v-model="trs" placeholder="请输入时间参照"></el-input></div></el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="7"><div class="grid-content bg-purple">空间参照</div></el-col>
      <el-col :span="17"><div class="grid-content bg-purple"><el-input :disabled="!ifEdit" v-model="srs" placeholder="请输入空间参照"></el-input></div></el-col>
    </el-row>
		
<!-- <h3 >对象类的时空参照</h3>
    <el-row :gutter="20">
      <el-col :span="7"><div class="grid-content bg-purple">时间参照</div></el-col>
      <el-col :span="17"><div class="grid-content bg-purple"><el-input :disabled="!ifEdit" v-model="otypeTrs" placeholder="请输入时间参照"></el-input></div></el-col>
    </el-row>
      <el-row :gutter="20">
      <el-col :span="7"><div class="grid-content bg-purple">空间参照</div></el-col>
      <el-col :span="17"><div class="grid-content bg-purple"><el-input :disabled="!ifEdit" v-model="otypeSrs" placeholder="请输入空间参照"></el-input></div></el-col>
    </el-row> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      trs: "",
      srs: "",
      otypeTrs: "",
      otypeSrs: ""
    };
  },
  watch: {
    objectDetail(val) {
      if(val.id){
        this.getData();
      }
    }
  },
  props: ["ifEdit", "objectDetail"],
  components: {},
  computed: {},
  activated() {
    this.getData();
  },
  methods: {
    getData(){
      let val = this.objectDetail;
      let sobject=val
      if (sobject.tsr) {
        this.trs = val.tsr.id;
      }

      if (sobject.srs) {
        this.srs = sobject.srs.id;
      }

      let otype = sobject.otype;
      if (otype && otype.trs) {
        this.otypeTrs = otype.trs.id;
      }
      if (otype && otype.srs) {
        this.otypeSrs = otype.srs.id;
      }
    }
  }
};
</script>
<style lang='less' scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.spacetime-root {
  margin: 10px;
  text-align: center;
}
</style>
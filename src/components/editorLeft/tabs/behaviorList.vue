<template>
  <div class='behavior-list pd-big'>
    <div v-for="(behavior,i) in lists" :key="i" class="behavior-el radius-2 pointer-shadow pd-small mg-bottom-big flex" @click="selectBehavior(behavior)">
      <div class="el-icon flex-center radius-2 mg-right-small">
        <span class="font-14 font-white">{{behavior.name|spliceStr}}</span>
      </div>
      <div class="el-content">
        <p class="font-black mg-bottom-mini font-14">{{behavior.name}}</p>
        <div>
          <el-tag size="mini mg-right-small">{{filterName(behavior.mdef.type)}}</el-tag>
          <el-tag size="mini" type="warning">{{behavior.mdef.name}}</el-tag>
        </div>
      </div>
    </div>
    <div class="page-footer flex-center">
      <el-pagination
        small
        layout="prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import psde from '@/script/editor/psde'
  import { vm, operate,getEditor } from "@/script/operate";
  export default {
    data(){
      return {
        model:new psde.Model(),
        getDict:new psde.GetDict(),
        searchValue:'',
        total:0,
        page:1,
        typeStyle:['','success','info','warning','danger'],
        lists:[],
        options:[]
      }
    },
    props:{},
    components:{},
    computed:{},
    mounted(){
      
    },
    activated(){
      this.requestList();
      this.getDict.query(null, "modelDefType").then(response => {
        this.options = response;
        console.log(response);
			});
    },
    filters:{
      spliceStr(str){
        return str.slice(0,2);
      }
    },
    methods:{
      requestList(){
        let obj = {};
        obj.names = this.searchValue;
        obj.page = this.page;
        obj.pageSize = 20;
        obj.orderType = "ID";
        obj.descOrasc = true;
        this.model.query(obj).then(res=>{
          this.lists = res.list;
          this.total = res.total;
          console.log(res);
        })
      },
      filterName(type){
        return this.options.find(el=>el.value==type).name;
      },
      selectBehavior(behavior){
        vm.$emit(operate.changeTab,{name:'objectDetail'});
        vm.$emit(operate.selectBehavior,behavior);
      }
    }
  }
</script>
<style lang='scss' scoped>
  .behavior-list{
    .behavior-el{
      border: 1px solid #ccc;
      .el-icon{
        width: 50px;
        height: 50px;
        background: #b2d2ff;
        flex-shrink: 0;
      }
      .el-content{
        flex-grow: 1;
        p{
          width: 150px;
        }
      }
    }
  }
</style>
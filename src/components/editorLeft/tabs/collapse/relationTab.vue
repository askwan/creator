<template>
  <div class='relation-box pd-left-big pd-right-big'>
    <div class="add-content pointer-default flex-center mg-bottom-big" @click="chooseRelation">
      <span class="font-14 no-select">+选择关系对象</span>
    </div>
    <div class="relation-list">
      <el-collapse>
        <el-collapse-item v-for='node in nodes' :key="node.id">
          <template slot="title">
            <!-- <div class="relation-el flex-align">
              <span class="font-14">{{objectDetail.name|formateName}}</span>
              <div class="flex-column">
                <span class="r-name">{{node.edge.relation.name}}</span>
                <div class="flex-center underline-box">
                  <span class="underline"></span>
                  <i class="iconfont icon-zuojiantou"></i>
                </div>
              </div>
              <span class="font-14">{{node.label}}</span>
              <i class="el-icon-delete mg-left-big pointer font-danger font-16"></i>
            </div> -->
            <common-connect :left="objectDetail.name|formateName" :right="node.label" :center="node.edge.relation.name" :id='node.id' @deleteIt="deleteIt"></common-connect>
          </template>
          <div>
            <el-form size="mini" label-width="80px" v-if="node.edge.relation" >
              <el-form-item v-for="(field,k) in node.edge.relation.fields.fields" :key="k" :label="field.caption">
                <el-input v-model="num"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>
<script>
  import {vm,operate,getEditor} from '@/script/operate';
  export default {
    data(){
      return {
        activeNames:['1'],
        parents:[],
        nodes:[],
        num:''
      }
    },
    props:{
      objectDetail:{
        type:Object,
        defalut:{}
      }
    },
    components:{
      commonConnect:()=>import('@/components/common/connect.vue')
    },
    computed:{},
    filters:{
      formateName(str){
        return str?str:'defalut'
      }
    },
    watch:{
      'objectDetail.network.nodes'(){
        this.parents = this.objectDetail.parents;
        this.nodes = this.objectDetail.network.nodes;
        
      }
    },
    mounted(){
      this.parents = this.objectDetail.parents;
      // this.nodes = this.objectDetail.network.nodes;
    },
    activated(){
      this.parents = this.objectDetail.parents;
      console.log(this.objectDetail,7777777777)
      this.nodes = this.objectDetail.network.nodes;
    },
    methods:{
      chooseParent(){
        vm.$emit(operate.changeTab,{name:'objectList'});
      },
      chooseRelation(){
        vm.$emit(operate.changeTab,{name:'relationList'});
      },
      deleteIt(id){
        getEditor().deleteNetwork(this.objectDetail.id,id);
      }
    }
  }
</script>
<style lang='scss' scoped>
  .relation-box{
    .add-content{
      height: 70px;
      background-color: #f5f7fa;
      border: 2px dashed #e1e3e6;
      border-radius: 4px;
    }
    .relation-list{
      .relation-el{
        .r-name{
          margin-bottom: -5px;
        }
        .underline-box{
          margin: -35px 0px 0px; 
          i{
            display: inline-block;
            margin-left: -5px;
            padding-top: 1px;
          }
        }
        
      }
      .underline{
        display: inline-block;
        width: 80px;
        border: 0.5px solid #999;
      }
    }
  }

</style>
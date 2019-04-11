<template>
  <div class='relation-box pd-left-big pd-right-big'>
    <div class="add-content pointer-default flex-center mg-bottom-big" @click="chooseRelation">
      <span class="font-14 no-select">+选择关系对象</span>
    </div>
    <div class="relation-list">
      <el-collapse>
        <el-collapse-item v-for='node in nodes' :key="node.id" v-show="node.show">
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
            <common-connect :left="objectDetail.name|formateName" :right="node|formateNameLabel" :center="node.edge.relation.name" :id='node.id' @deleteIt="deleteIt"></common-connect>
          </template>
          <div>
            <el-form size="mini" label-width="80px" v-if="node.edge.relation" >
              <el-form-item v-for="(field,k) in node.edge.relation.fields.fields" :key="k" :label="field.caption">
                <el-input v-model="field.value" @change="changeFn(node,field)"></el-input>
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
  import {State} from '@/script/editor/utils/store'
  export default {
    data(){
      return {
        activeNames:['1'],
        parents:[],
        nodes:[]
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
      },
      formateNameLabel(node){
        let sobject = State.sobjects[node.relatedObjectId];
        // console.log(sobject.attributes,999);
        if(!sobject){
          return node.label || 'default';
        }
        let nameObj = sobject.attributes.find(el=>el.name=='name'||el.name=='NAME');
        // console.log(nameObj,'nameObj')
        if(nameObj){
          return nameObj.value
        }else{
          return 'default'
        }
        // return State.sobjects[id].name;
      }
    },
    watch:{
      'objectDetail.network.nodes'(){
        this.initNetwork();
      }
    },
    mounted(){
      this.initNetwork();
    },
    activated(){
      this.initNetwork();
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
      },
      changeFn(node,field){
        node.properties[field.name] = field.value;
        getEditor().modifySObjectNetwork(this.objectDetail,node);
      },
      initNetwork(field,value){
        if(this.objectDetail.network&&this.objectDetail.network.nodes instanceof Array){
          this.parents = this.objectDetail.parents;
          this.objectDetail.network.nodes.forEach(node=>{
            // this.$set(node,'show',true);
            if(node.edge.relation){
              node.edge.relation.fields.fields.forEach(field=>{
                field.value = node.properties[field.name];
              })
            }
          })
          this.nodes = this.objectDetail.network.nodes;
          // console.log(State.sobjects[this.nodes[0].relatedObjectId]);
          // relatedObjectId
          // console.log(this.nodes);
        }else{
          this.nodes = [];
        }
        
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
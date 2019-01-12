<template>
  <div class='otypes fill shadow pd-small'>
    <!-- <div v-for="otype in otypes" :key="otype.id">{{otype.name}}</div> -->
    <el-tree
      :data="diagrams"
      :props="defaultProps"
      node-key="id"
      highlight-current
      ref="tree"
    >
      <span class="flex-between" slot-scope="{node}">
        <i v-show="!node.data.otypes" class="el-icon-view font-14 icon-view" :class="{show:filterHidden(node)}" @click="change(node)"></i>
        <span class="font-14">{{node.label}}</span>
        <span class="mg-left-big">
        </span>
      </span>
    </el-tree>
  </div>
</template>
<script>
  import {State} from '@/script/editor/utils/store'
  import {vm,operate,getEditor} from '@/script/operate'
  let IdEditor;
  export default {
    data(){
      return {
        otypes:[],
        defaultProps:{
          label:'name',
          children:'otypes'
        },
        diagrams:[],
        disable:[],
        isFalse:true,
        hiddens:[]
      }
    },
    props:['show'],
    components:{},
    computed:{

    },
    watch:{
      show(bool){
        console.log(bool)
        if(bool&&this.isFalse){
          this.getData();
        }
      }
    },
    mounted(){
      console.log('mounted');
      this.getData();
    },
    activated() {
      console.log('activated')
    },
    methods:{
      // change(a,b,c){
      //   IdEditor.filterObjectByOtype(b.checkedKeys);      
      // },
      getData(){
        let user = JSON.parse(sessionStorage.getItem('user'));
        // console.log(user,'user')
        // this.diagrams = State.userDiagram(user.id);
        this.diagrams = State.diagrams;
        // this.$refs.tree.setCheckedKeys(State.otypeIds);
        IdEditor = getEditor();
        // this.isFalse = false;
      },
      change(node){
        if(this.hiddens.find(el=>node.data.id==el)){
          this.hiddens = IdEditor.enableOtype(node.data.id);
        }else{
          this.hiddens = IdEditor.disableOtype(node.data.id);
        };
        // let arr = IdEditor.getSObjectByOtypes(this.hiddens);
        // arr = arr.map(el=>IdEditor.copySObject(el));
        vm.$emit(operate.hiddenOtypes);
      },
      filterHidden(node){
        return !this.hiddens.find(el=>el==node.data.id);
      }
    }
  }
</script>
<style lang='scss' scoped>
  .otypes{
    width: 300px;
    overflow-y: auto;
    background-color: #fff;
    .icon-view{
      padding-top: 1px;
      padding-right: 5px;
    }
    .show{
      color: #409EFF;
    }
  }
</style>
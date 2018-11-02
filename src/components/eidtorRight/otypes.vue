<template>
  <div class='otypes fill shadow'>
    <!-- <div v-for="otype in otypes" :key="otype.id">{{otype.name}}</div> -->
    <el-tree
      :data="diagrams"
      show-checkbox
      :props="defaultProps"
      node-key="id"
      highlight-current
      ref="tree"
      @check="change"
    ></el-tree>
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
        isFalse:true
      }
    },
    props:['show'],
    components:{},
    computed:{

    },
    watch:{
      show(bool){
        if(bool&&this.isFalse){
          this.getData();
        }
      }
    },
    mounted(){
    },
    activated() {
      console.log('activated')
    },
    methods:{
      change(a,b,c){
        IdEditor.filterObjectByOtype(b.checkedKeys);      
      },
      getData(){
        let user = JSON.parse(sessionStorage.getItem('user'));
			  this.diagrams = State.userDiagram(user.id);
        this.$refs.tree.setCheckedKeys(State.otypeIds);
        IdEditor = getEditor();
        this.isFalse = false;
      }
    }
  }
</script>
<style lang='scss' scoped>
  .otypes{

  }
</style>
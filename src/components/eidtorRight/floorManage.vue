<template>
  <div class='root fill pd-small floor-manage' v-loading="loading">
    <el-tree highlight-current :data="Trees" :props="prop" :expand-on-click-node="false">
      <span class="flex-between" slot-scope="{node,data}">
        <i v-show="node.data.otype&&node.data.attributes.find(el=>el.name=='FLOOR')" class="el-icon-view font-14 icon-view" :class="{show:isView(node)}" @click="changeView(node)"></i>
        <span>{{node.label}}</span>
        <span class="mg-left-big">
        </span>
      </span>
    </el-tree>
  </div>
</template>
<script>
  import {State} from '@/script/editor/utils/store'
  import {vm,operate,getEditor} from '@/script/operate';
  import {connectorServer,objectServer,otypeServer} from '@/script/server'
  let idEditor;
  export default {
    data(){
      return {
        floor:0,
        checkedObjects:[],
        list:[],
        loading:false,
        Trees:[],
        hiddens:[],
        prop:{
          children:'children',
          label:'name'
        },
        rootObj:{
          id:'',
          name:'',
          children:[]
        }
      }
    },
    props:['show','sobject'],
    components:{},
    computed:{},
    mounted(){
      this.getObjects();
    },
    watch:{
      show(bool){
        if(bool){
          this.getObjects();
        }
      },
      'sobject.id'(id){
        this.getObjects();
      }
    },
    methods:{
      handleChanged(val,bool){
        idEditor = getEditor();
        if( !State.sobjects[val.id]) return;
        
        let forms = State.sobjects[val.id].forms;
        if(!bool){
          State.showObject(val);
        }else{
          State.hiddenObject(val);
        };
      },

      getObjects(){
        if(!this.sobject.id) return;
        this.Trees = [];
        this.hiddens = State.hidden;
        let rootObj = {};
        rootObj.name = this.sobject.name;
        rootObj.id = this.sobject.id;
        rootObj.children = [];
        // this.queryChildren(rootObj);
        abc(rootObj);
        console.log("查询递归",rootObj)
        this.Trees.push(rootObj);
      },
      queryChildren(object){
        let list = State.getSobjectByParents(object.id);
        list.forEach(obj=>{
          obj = JSON.parse(JSON.stringify(obj))
          let copy = Object.assign({},obj);
          copy.show = true;
          if(object.children.find(el=>el.id==copy.id)){

          }else{
            object.children.push(copy)
            this.queryChildren(copy);
          }
          
        })
      },
      changeView(node){
        if(node.data.$treeNodeId==1) {
          vm.$emit(operate.notice,{
            message:'不能对root节点进行操作。'
          });
          return
        }
        let aimObj;
        idEditor = getEditor();
        let features = idEditor.idContext.features();
        if(this.hiddens.find(el=>el==node.data.id)){
          idEditor.enableSobject(node.data.id);
          let list = [];
          list.push(idEditor.copySObject(node.data));
          // console.log(this.Trees,'tree');
          aimObj =  State.sobjects[this.Trees[0].id];
          aimObj.children.push(node.data);
          aimObj = idEditor.copySObject(aimObj);
          aimObj.show = true;
        }else{
          idEditor.disableSobject(node.data.id);
          aimObj = State.sobjects[this.Trees[0].id];
          let index = aimObj.children.findIndex(el=>el.id==node.data.id);

          aimObj.children.splice(index,1);
          aimObj = idEditor.copySObject(aimObj);
        }
        let hidden = this.hiddens.find(el=>el==node.data.id);
        this.hiddens = State.hidden;
        State.viewObject = aimObj;
        vm.$emit(operate.hiddenOtypes);
      },
      isView(node){
        if(node.data.parents){
          let hidden = this.hiddens.find(el=>node.data.id==el||node.data.parents.find(parent=>parent.id==el));
          return !hidden;
        }
        
      },
      getChildObjFromTree(root){
        let list = [];
        list.push(root);
        if(root.children){
          root.children.forEach(child=>{
            list = list.concat(this.getChildObjFromTree(child))
          })
        }
        return list;
      }
    }
  }

  const abc = object=>{
    let list = State.getSobjectByParents(object.id);
    list.forEach(obj=>{
      let copy = Object.assign({},obj);
      copy.show = true;
      if(object.children.find(el=>el.id==copy.id)){

      }else{
        object.children.push(copy)
      }
      abc(copy);
    })
  }

</script>
<style lang='scss' scoped>
  .floor-manage{
    width: 300px;
    background-color: #fff;
    overflow-y: auto;
    .check-floor-box{
      flex-direction: column;
      justify-content: flex-start;
    }
    
  }
  .icon-view{
    padding-top: 1px;
    padding-right: 5px;
  }
  .show{
    color: #409EFF;
  }
</style>
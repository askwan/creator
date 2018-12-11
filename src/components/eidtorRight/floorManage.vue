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
      findChildOTypeId(otype){
        let connectors = State.connectors;
        let obj = {};
        Object.assign(obj,otype);
        let aim = connectors.filter(el=>el.fId==otype.id);
        obj.children = obj.children||[];
        obj.children = aim.map(el=>Object.assign({},State.otypes[el.dType.id]));
        obj.children.forEach(el=>{
          this.findChildOTypeId(el)
        });
        return obj;
      },
      getObjects(){
        if(!this.sobject.id) return;
        this.Trees = [];
        let otypes = this.findChildOTypeId(this.sobject.otype);
        this.hiddens = State.hidden;
        let rootObj = {};
        rootObj.name = this.sobject.name;
        rootObj.id = this.sobject.id;
        rootObj.children = [];
        this.queryChildren(rootObj);
        this.Trees.push(rootObj);
      },
      queryChildren(object){
        let list = State.getSobjectByParents(object.id);
        list.forEach(obj=>{
          let copy = Object.assign({},obj);
          if(object.children.find(el=>el.id==copy.id)){

          }else{
            object.children.push(copy)
          }
          this.queryChildren(copy);
        })
      },
      changeView(node){
        if(node.data.$treeNodeId==1) {
          vm.$emit(operate.notice,{
            message:'不能对root节点进行操作。'
          });
          return
        }
        
        idEditor = getEditor();
        let features = idEditor.idContext.features();
        if(this.hiddens.find(el=>el==node.data.id)){
          idEditor.enableSobject(node.data.id);
        }else{
          idEditor.disableSobject(node.data.id);
        }
        let hidden = this.hiddens.find(el=>el==node.data.id);
        this.hiddens = State.hidden;
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
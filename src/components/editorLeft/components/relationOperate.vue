<template>
  <div class='root'>
    
    <el-form size="mini">
      <el-form-item>
        <div class="flex-between">
          <el-select v-model = 'selectRelation' class="select" placeholder="请选择关系" :disabled="Boolean(item.parent)">
            <el-option v-for="(item,i) in mapRelation" :key="i" :label="item.name||item.id" :value="item.id">
            </el-option>
          </el-select>
          <div v-show="item.relation" class="position-btn" @click="position">定位</div>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="flex-between">
          <el-select v-model="role" placeholder="添加角色">
            <el-option label="inner" value="inner"></el-option>
            <el-option laber="outer" value="outer"></el-option>
          </el-select>
          <div v-show="item.relation"  class="delete-btn" @click="deleteRelation">删除</div>
        </div>
      </el-form-item>
      
    </el-form>
  </div>
</template>
<script>

  // import {createRelation,choose,setRole,deleteRole,positionEntity} from './relations'
  import {vm,operate,getEditor} from '@/script/operate';
  // import { allOtype, getOtypeById,relationArr } from '@/script/allOtype'
  import {State} from '@/script/editor/utils/store'
  // import IdEdit from '@/script/id_edit/IdEdit'
  let IdEdit,context;
  export default {
    data(){
      return {
        currentEntity:'',
        relationCollection:[{id:1,name:'新关系',tags:{name:'新关系'}}],
        selectRelation:this.item.relation||'',
        role:this.item.role||'',
        lists:[1,2,3,4]
      }
    },
    props: {
      item:{
        type:[Object],
        default:()=>{
          return {
            relation:'',
            role:'',
            parent:''
          }
        }
      }
    },
    components:{},
    computed:{},
    beforeMount(){
      IdEdit = getEditor();
      context = getEditor().idContext;
      this.initData();
      if(!this.item.relation){
        this.selectRelation = '';
        this.role='';
      }
    },
    mounted(){
      this.initData();
      if(!this.item.relation){
        this.selectRelation = '';
        this.role='';
      }
    },
    activated() {
      this.initData();
      if(!this.item.relation){
        this.selectRelation = '';
        this.role='';
      }
    },
    watch:{
      selectRelation(id,oldId){
        if(id==1){
          this.createRelation();
        }else if(oldId!==1){
          let relation = this.relationCollection.find(el=>el.id==id);
          IdEdit.relationOperate.choose(relation);
        }
      },
      role(val){
        if(val){

          this.addMember(val);
        }
      }
    },
    computed:{
      mapRelation(){
        return this.relationCollection.map(el=>{
          el.name = el.tags.name||el.id;
          return el
        })
      }
    },
    methods:{
    	initData(){
    		
        let relations = State.relations;
        // console.log(this,8888888)
        // console.log(this.relationCollection,666666666666666);
        relations.forEach(el=>{
          let index = this.relationCollection.find(ev=>ev.id==el.id);
          if(!index) this.relationCollection.push(el);
        })
	      // this.relationCollection = this.relationCollection.concat(relations);
    	},
      createRelation(){
        let id = context.selectedIDs()[0];
        if(!id) {
          this.selectRelation = '';
          this.$notify.error({
            title:'警告',
            message:'未找到默认member'
          })
          return
        };
        let type = context.graph().hasEntity(id).type;
        let r;
        var member = {id:id,role:'outer',type:type,index:0}
        r = IdEdit.relationOperate.createRelation(context,member);
        State.cacheRelation(r);
        // this.selectRelation = r;
        // this.relationCollection.push(r);
        this.selectRelation = r.id;
      },
      position(){
        IdEdit.relationOperate.positionEntity(context,this.selectRelation);
      },
      addMember(role){

        if(this.item.parent){
          IdEdit.relationOperate.setRole({id:this.item.relation,index:1,role:role},this.item.parent);
          return
        }

        let id = context.selectedIDs()[0];
        if(!id) {
          return this.$notify.error({
            title: '警告',
            message: '单击几何以选择',
            type: 'warning'
          });
        }
        let type = context.graph().hasEntity(id).type;
        if(!this.selectRelation){
          return this.$notify.error({
            title: '错误',
            message: '未选择relation'
          });
        }
        let re = context.graph().hasEntity(this.selectRelation);
        IdEdit.relationOperate.setRole({id:id,index:re.members.length,role:role,type:type},this.selectRelation,(relation)=>{
          State.cacheRelation(relation);
        });
          let sobject = IdEdit.getSObjectByOsmEntity(id);
          if(sobject){
            let form = sobject.forms.find(el=>el.geom==id);
            form.geom = this.selectRelation
            form.geotype = 24;
            IdEdit.modifyObjectForm(sobject,form)
          }
      },
      deleteRelation(obj){
        let id = context.selectedIDs()[0];
        let relation,index;
        if(!id) {
          return this.$notify.error({
            title: '警告',
            message: '单击几何以选择',
            type: 'warning'
          });
        }
        
        if(this.item.parent){
          relation = context.entity(this.item.parent);
          index = relation.members.findIndex(el=>el.id==this.item.relation);
          this.selectRelation = this.item.parent;
          id = this.item.relation;
        }else{
          relation = context.entity(this.selectRelation);
          index = relation.members.findIndex(el=>el.id==id);
        }
        IdEdit.relationOperate.deleteRole(this.selectRelation,index,(obj)=>{
          this.$emit('delete',{
            relation:this.selectRelation,
            member:id
          });
        })
      }
    }
  }
</script>
<style lang='scss' scoped>
  .root{
		background: #FFFFFF;
    width: calc(100% - 1px);
    box-shadow: 0 0 3px #666;
    margin-bottom: 10px;
    padding: 5px 0px 5px 2px;
    border-radius: 5px;
    .title{
      font-size: 14px;
      margin-bottom: 10px;
    }
    .add-member{
      .btn{
        width:100%;
        padding: 0;
        height: 32px;
      }
    }
    .select-new{
      .select{
        width: 100%;
      }
    }
    .delete-btn{
      cursor: pointer;
      color: #F56C6C;
      font-size: 12px;
      height: 25px;
      padding-right:5px; 
      flex-basis: 40px;
      text-align: right;
    }
    .position-btn{
      cursor: pointer;
      color: #4588e6;
      font-size: 12px;
      height: 25px;
      padding-right:5px; 
      flex-basis: 40px;
      text-align: right;
    }
  }
</style>
<template>
  <div class='root'>
    <div class="delete-btn" @click="deleteRelation">删除</div>
    <el-form>
      <el-form-item>
        <el-select v-model = 'selectRelation' class="select" placeholder="请选择关系">
          <el-option v-for="(item,i) in mapRelation" :key="i" :label="item.name||item.id" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="role" placeholder="添加角色">
          <el-option label="inner" value="inner"></el-option>
          <el-option laber="outer" value="outer"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import {createRelation,choose,setRole,deleteRole} from './relations'
  import {vm,operate,getContext} from '@/script/operate';
  import { allOtype, getOtypeById,relationArr } from '@/script/allOtype'
  import IdEdit from '@/script/id_edit/IdEdit'
  let context,r;
  export default {
    data(){
      return {
        currentEntity:'',
        relationCollection:[{id:1,name:'新关系',tags:{name:'新关系'}}],
        selectRelation:this.item.relation||'',
        role:this.item.role||''
      }
    },
    props: {
      item:{
        type:[Object],
        default:()=>{
          return {
            relation:'',
            role:''
          }
        }
      }
    },
    components:{},
    computed:{},
    mounted(){
      this.initData();
    },
    activated() {
      this.initData();
      this.selectRelation = '';
      this.role='';
    },
    watch:{
      selectRelation(id,oldId){
        if(id==1){
          this.createRelation();
        }else if(oldId!==1){
          let relation = this.relationCollection.find(el=>el.id==id);
          choose(relation);
        }
      },
      role(val){
        if(val){

          this.addMember();
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
    		context = getContext();
        let relations = relationArr();
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

        var member = {id:id,role:'outer',type:type,index:0}
        r = createRelation(context,member);
        relationArr(r);
        // this.selectRelation = r;
        // this.relationCollection.push(r);
        this.selectRelation = r.id;
      },
      chooseRelation(){
        choose(r);
      },
      addMember(){
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
        setRole({id:id,index:re.members.length,role:this.role,type:type},this.selectRelation);
          let sobject = IdEdit.getSObjectByOsmEntity(id);
          // console.log(sobject,'soje')
          if(sobject){
            let form = sobject.forms.find(el=>el.geom==id);
            form.geom = this.selectRelation
            form.geotype = 24;
            IdEdit.modifyObjectForm(sobject,form)
          }
      },
      deleteRelation(obj){
        let id = context.selectedIDs()[0];
        if(!id) {
          return this.$notify.error({
            title: '警告',
            message: '单击几何以选择',
            type: 'warning'
          });
        }
        let relation = context.entity(this.selectRelation);
        let index = relation.members.findIndex(el=>el.id==id);
        deleteRole(this.selectRelation,index,(obj)=>{
          this.$emit('delete',{
            relation:this.selectRelation,
            member:id
          });
        })
      }
    }
  }
</script>
<style lang='less' scoped>
  .root{
		background: #FFFFFF;
    // padding: 10px;
    // margin-left:75px;
    border: 1px solid #999;
    margin-bottom: 5px;
    padding: 2px;
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
      display: flex;
      justify-content: flex-end;
      cursor: pointer;
      color: #F56C6C;
      font-size: 12px;
      height: 25px;
      padding-right:5px; 
    }
  }
</style>
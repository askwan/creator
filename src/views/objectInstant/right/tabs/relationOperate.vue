<template>
  <div class='root'>
    <div class="title">添加复合多边形</div>
    <div class="select-new">
      <el-select v-model = selectRelation class="select">
        <el-option v-for="(item,i) in relationCollection" :key="i" :label="item.name||item.id" :value="item.id">
        </el-option>
      </el-select>
    </div>
    <div class="add-member">
      <el-button class="btn" @click="addMember" v-show="selectRelation!=1&&selectRelation">添加成员</el-button>
    </div>


    
  </div>
</template>
<script>
  import {createRelation,choose,setInnerRole} from './relations'
  import {vm,operate,getContext} from '@/script/operate';
  import { allOtype, getOtypeById,relationArr } from '@/script/allOtype'
  let context,r;
  export default {
    data(){
      return {
        currentEntity:'',
        relationCollection:[{id:1,name:'新关系'}],
        selectRelation:''
      }
    },
    props: ["ifEdit", "objectDetail"],
    components:{},
    computed:{},
    mounted(){
      this.initData();
    },
    watch:{
      selectRelation(id,oldId){
        if(id==1){
          this.createRelation();
          
        }else if(oldId!==1){
          let relation = this.relationCollection.find(el=>el.id==id);
          choose(relation);
        }

        
      }
    },
    methods:{
    	initData(){
    		context = getContext();
	      let relations = relationArr();
	
	      let formateRe = relations.map(re=>{
	        re.name = re.orgData.name;
	        return re;
	      })
	      this.relationCollection = this.relationCollection.concat(relations);
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
        // this.selectRelation = r;
        this.relationCollection.push(r);
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

        let err = false;
        re.members.forEach(el=>{
          if(el.id==id){
            err = true;
          }
        })
        if(err){
          return this.$notify.error({
            title:'错误',
            message:'该形态已经是成员了',
            type:'warning'
          })
        }
        setInnerRole({id:id,index:re.members.length,role:'inner',type:type},this.selectRelation);
      }
    }
  }
</script>
<style lang='less' scoped>
  .root{
		background: #FFFFFF;
    padding: 10px;
    .title{
      font-size: 14px;
      margin-bottom: 10px;
    }
    .add-member{
      margin-top: 10px;
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
  }
</style>
<template>
  <div class='constitute-tab pd-big'>
    <div class="add-content pointer-default flex-center mg-bottom-big" @click="chooseParent">
      <span class="font-14 no-select">+选择父对象</span>
    </div>
    <div class="">
      <el-tag v-for="parent in parents" class="mg-right-small mg-bottom-small pointer" :key="parent.id" @close="deleteParent(parent)" closable disable-transitions>
        <span @click="selectAim(parent)">{{parent.name||parent.id}}</span>
      </el-tag>
    </div>
  </div>
</template>
<script>
  import {vm,operate,getEditor} from '@/script/operate';
  import psde from '@/script/editor/psde';
  import {objectServer} from '@/script/server';
  import {State} from '@/script/editor/utils/store'
  export default {
    data(){
      return {
        parents:[]
      }
    },
    props:{
      objectDetail:{
        type:Object,
        defalut:{}
      }
    },
    components:{},
    computed:{},
    filters:{
      formateName(str){
        return str?str:'defalut'
      }
    },
    mounted(){
      this.getName(this.objectDetail.parents);
    },
    activated(){
      this.getName(this.objectDetail.parents);
    },
    watch:{
      'objectDetail.id'(id){
        if(id){
          this.getName(this.objectDetail.parents);
        }
      }
    },
    methods:{
      deleteParent(parent){
        
        getEditor().deleteParent(parent);
        this.parents = this.parents.filter(el=>el.id!=parent.id);
      },
      chooseParent(){
        vm.$emit(operate.changeTab,{name:'objectList'});
        // console.log(this.objectDetail.otype,999999)
      },
      selectAim(item){
        let sobject = State.sobjects[item.id];
        let form = sobject.forms.find(el=>typeof el.geom =='string')
        if(form){
          getEditor().relationOperate.positionEntity(undefined,form.geom);
        }
      },
      getName(parents){
        let str = parents.map(el=>el.id).join(',');
        this.parents = [];
        if(str.length==0) return
        
        // psde.objectQuery.loadObject({ids:str}).then(res=>{
        //   res.list.forEach(el=>{
        //     let obj = {};
        //     console.log(el)
        //     obj.id = el.id;
        //     obj.name = el.name;
        //     this.parents.push(obj)
        //   })
        // });
        objectServer.query({ids:str}).then(res=>{
          res.list.forEach(el=>{
            let obj = {};
            obj.id = el.id;
            obj.name = el.name;
            this.parents.push(obj)
          })
        })
      }
    }
  }
</script>
<style lang='scss' scoped>
  .constitute-tab{
    .add-content{
      height: 70px;
      background-color: #f5f7fa;
      border: 2px dashed #e1e3e6;
      border-radius: 4px;
    }
  }
  
</style>
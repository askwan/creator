<template>
  <div class='otyped'>
    <ul>
      <li class="otyped-list" v-for="(obj,i) in comHis" :key="i" @click="showOtyped(obj)">
        <div class="icon-box">
          <img :src="common.getAvatar(common.getInfo('avatar'))" alt="">
        </div>
        <div class="detail-box">
          <p>
            <span>{{obj|fName}}</span>
            <span v-if="obj.changeType=='created'"><i></i> 新增</span>
            <span v-else-if="obj.changeType=='modified'"><i></i> 修改</span>
            <span v-else-if="obj.changeType=='deleted'"><i></i> 删除</span>
          </p>
          <p class="text-hidden-1">属性：{{obj|fAttr}}</p>
          <p class="text-hidden-1">形态：{{obj.entity.type}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
  import common from "@/script/common";
  import _dispatch from "@/script/dispatchEvent"
  import psdeGraph from '@/psde/PsdeGraph'
  const context = psdeGraph.getContext();
  export default {
    data(){
      return {
        his:[],
        common
      }
    },
    props:{},
    components:{},
    computed:{},
    mounted(){
      this.listenEvent();
    },
    methods:{
      listenEvent(){
        let _this = this;
        _dispatch.on("getHistory",function(his){
          // console.log(his);
          _this.his = his;
        })
      },
      showOtyped(id){
        // context.undo();
        // console.log(context)
        // context.history().undoAnnotation();
      }
    },
    computed:{
      comHis(){
        // console.log(this.his)
        return this.his;
        // let newOperate = this.his.findIndex(item=>item.entity.id==)
      }
    },
    filters:{
      fName(obj){
        if(obj){
          if(obj.entity){
            if(obj.entity.tags.name){
              return obj.entity.tags.name
            }else{
              return "未命名"
            }
          }else{
            return "未命名"
          }
        }else{
          return "未命名"
        }
        return "未命名"
      },
      fAttr(obj){
        if(obj){
          if(obj.entity){
            let str = "";
            for(let key in obj.entity.tags){
              if(obj.entity.tags[key]){
                str+=key+":"+obj.entity.tags[key]+"、";         
              }  
            }
            str = str.slice(0,-1);
            str = str+";"
            return str
          }
        }
        return "无"
      }
    }
  }
</script>
<style lang='less' scoped>
  @height:76px;
  .otyped{
    position: absolute;
    left: 0;
    right: 0;
    top:0;
    bottom:0;
    background-color: #f7fafc;
    // background-color: red;
    overflow-x: hidden;
    overflow-y: auto;
    ul{
      padding-top: 10px;
    }
  }
  .otyped-list{
    margin: 0 10px;
    height: @height;
    cursor: pointer;
    // background-color: pink;
    border-bottom: 1px solid #e1e3e6;
    display: flex;
    .icon-box{
      width: 50px;
      height: @height;
      line-height: @height;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      img{
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
      
    }
    .detail-box{
      height: @height;
      // background-color: red;
      flex-grow: 2;
      // padding: 3px;
      padding: 10px 0;
      p:nth-of-type(1){
        
        font-size: 12px;
        color:#333;
        span:nth-of-type(2){
          float: right;
          color: #9ccc66;
          i{
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: #9ccc66;
          }
        }
        
      }
      p{
        color: #666;
        font-size: 12px;
      }
    }
  }
  .text-hidden-1{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
  .otyped-list:hover{
    background-color: #f0f2f5;
  }
</style>
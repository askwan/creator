<template>
  <div class="floatingWindow" :class="{show:onclickshow}">
    
    <div class="ul-list">
      <div class="o-title">
        <div class="object-name">{{flotCon.name|formateName}}</div>
        <div class="del" @click.stop.prevent="closeFlot">
          <i class="iconfont icon-chuangjian"></i>
        </div>
      </div>

      <div class="proty-title" v-if='flotCon.attributes'>属性：</div>
      <div v-for="(n,i) in flotCon.attributes" :key="i" class="ul">
        <div class="li cle">
          <span class="one">{{n.name}}:</span>
          <span class="two">{{n.value}}</span>
        </div>
      </div>

      <div class="proty-title" v-if="flotCon.network&&flotCon.network.nodes&&flotCon.network.nodes.length>0">关系：</div>
      <div class="o-relation" v-if="flotCon.network&&flotCon.network.nodes">
        <div class="relation-el" v-for="(node,i) in flotCon.network.nodes" :key="i">
          <span class="r-obj">{{flotCon.name|formateName}}</span>
          <div class="r-connector">
            <span class="r-name">{{node.edge.relation.name}}</span>
            <div class="r-center">
              <span class="underline"></span>
              <i class="iconfont icon-zuojiantou"></i>
            </div>
          </div>
          <span class="r-obj">{{node.label}}</span>
        </div>
      </div>
    </div>


  </div>
</template>
<script>
  import { vm, operate } from "@/script/operate";
  import psde from "@/psde";
  export default {
    data(){
      return {
        onclickshow: true,
        flotCon:{
          nodes:[]
        },

      }
    },
    props:{
      objDetail:{
        type:[Object],
        default:{}
      }
    },
    components:{},
    computed:{},
    beforeMount() {
      },
    mounted(){
      this.openflot(this.objDetail);
      this.listenEvent();
    },
    filters:{
      formateName(str){
        return str?str:'defalut'
      }
    },
    watch:{
    },
    methods:{
      listenEvent(){
        vm.$on(operate.showClick, data => {
          if (data) {
            this.openflot(data);
          } else {
            this.onclickshow = false;
          }
        });
      },
      closeFlot() {
        this.onclickshow = false;
        vm.$emit(operate.showClickdel, {});
        
      },
      openflot(val) {
        this.onclickshow = true;
        psde.objectQuery.getDetailById
          .query({
            ids: val.oid
          })
          .then(response => {
            this.flotCon = response.list[0];
            // console.log(this.flotCon);
            
          });
      }
      
    }
  }
</script>
<style lang='less' scoped>
  .floatingWindow {
    position: absolute;
    width: 300px;
    height: 0;
    background-color: #fff;
    transition: all linear 0.2s;
    padding-top: 0;
    overflow: hidden;
    z-index: 5;
    padding-left: 10px;
    padding-right: 10px;
    overflow-y: scroll;
    .del {
      transform: rotate(45deg);
      cursor: pointer;
      &:hover {
        color: red;
      }
      .iconfont {
        font-size: 20px;
      }
    }
    .ul-list {
      .ul {
        margin-bottom: 10px;
        .li {
          font-size: 20px;

          span {
            float: left;
            min-height: 35px;
            border: 1px solid #ddd;
            margin: 0 -1px -1px 0;
            display: flex;
            align-items: center;
            font-size: 14px;
          }
          .one {
            width: 120px;
            padding-right:20px; 
            background-color: #f6f6f6;
            justify-content: flex-end;
          }
          .two {
            width: 150px;
            padding-left: 20px;
            justify-content: flex-start;
          }
        }
      }
      .o-title{
        font-size: 16px;
        display: flex;
        justify-content: space-between;
        height: 30px;
        align-items: center;
        .object-name{
          width: 100%;
          text-align: center;
        }
      }
    }
  }
  .show {
    // top: 50px;
    height: 500px;
    padding-top: 25px;
  }
  .proty-title{
    font-size: 16px;
    margin-bottom: 5px;
  }
  .relation-el{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    .r-obj{
      font-size: 14px;
    }
    .r-connector{
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      .r-name{
        display: inline-block;
        margin-bottom: -5px;
      }
      .r-center{
        display: flex;
        justify-content: center;
        align-items: center;
        margin: -10px 10px 0px; 
        .underline{
          display: inline-block;
          width: 150px;
          border: 0.5px solid #999;
        }
        i{
          margin-left: -5px;
          padding-top: 1px;
        }
      }
    }
  }
</style>
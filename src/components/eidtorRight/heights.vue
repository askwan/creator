<template>
  <div class='height-manager pd-top-small pd-bottom-small flex'>
    <el-slider class="reversal" height="300px" v-model="section" vertical :step="0.1" range :max="max" @change="changeSection"></el-slider>
    <ul class="pd-mini flex-group">
      <li class="pd-small pointer-shadow" v-for="height in heightList" :key="height" :class="{active:Number(height)>=section[0]&&Number(height)<=section[1]}">
        <span @click="selectHeight(height)"><i class="el-icon-success pd-right-small"></i>height:<i>{{height}}</i></span>
      </li>
    </ul>
  </div>
</template>
<script>
  import {State} from '@/script/editor/utils/store.js'
  import {vm,operate,getEditor} from '@/script/operate';
  export default {
    data(){
      return {
        heightList:[],
        section:[0,1],
        max:10,
        min:0
      }
    },
    props:{},
    components:{},
    computed:{},
    watch: {

    },
    mounted(){
      this.heightList = Object.keys(State.heights).map(el=>Number(el))
      this.heightList = this.heightList.sort((a,b)=>b-a);
      let maxHeight = this.heightList[0];
      let minHeight = this.heightList[this.heightList.length-1];
      this.section = State.section;
      this.max = Number(maxHeight);
      this.min = Number(minHeight);
    },
    methods:{
      changeSection(){
        let context = getEditor().idContext;
        let enableList = this.heightList.filter(el=>Number(el)>=this.section[0]&&Number(el)<=this.section[1]);
        this.heightList.forEach((el,i)=>{
          if(enableList.length==0){
            if(i==this.heightList.length-1){
              context.features().disable(el,true)
            }else{
              context.features().disable(el);
            }
          }else{
            context.features().disable(el,true)
          };
        });
        enableList.forEach((el,i)=>{
          if(i==enableList.length-1){
            context.features().enable(el);
          }else{
            context.features().enable(el,true);
          }
        });

        State.section = this.section;
      },
      selectHeight(height){
        this.section = [Number(height),Number(height)];
        this.changeSection();
      }
    }
  }
</script>
<style lang='scss' scoped>
  .height-manager{
    width: 300px;
    overflow-y: auto;
    background-color: #fff;
    height: 100%;
    .flex-group{
      flex-grow: 2;
      overflow-y: auto;
    }
    .active{
      color: #409EFF;
      i{
        color:#409EFF;
      }
    }
  }
</style>
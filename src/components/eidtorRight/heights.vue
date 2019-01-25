<template>
  <div class='height-manager pd-top-small pd-bottom-small flex'>
    <el-slider class="reversal" height="300px" v-model="section" vertical :step="0.1" range :max="max" :min="min" @change="changeSection"></el-slider>
    <ul class="pd-mini flex-group">
      <li class="pd-small pointer-shadow" v-for="height in heightList" :key="height" :class="{active:Number(height)>=section[0]&&Number(height)<=section[1]}" @click="selectHeight(height)">
        <span><i class="el-icon-success pd-right-small"></i>height:<i>{{height}}</i></span>
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
        min:0,
        sliderHeight:0
      }
    },
    props:['show'],
    components:{},
    computed:{},
    watch: {
      show(bool){
        if(!bool) return
        this.heightList = [];
        Object.keys(State.heights).forEach(el=>{
          let arr = el.split("_");
          arr.forEach(en=>{
            if(this.heightList.find(ev=>ev==en)===undefined){
              this.heightList.push(Number(en));
            }
          })
          
        })
        this.heightList = this.heightList.sort((a,b)=>b-a);
        let maxHeight = this.heightList[0];
        let minHeight = this.heightList[this.heightList.length-1];
        this.section = State.section;
        this.max = Number(maxHeight);
        this.min = Number(minHeight);
      }
    },
    mounted(){
      
      
      // console.log(State.heights,'state')
    },
    methods:{
      changeSection(){
        let context = getEditor().idContext;
        console.log(State.heights,'heights')
        let enableList = [];
        for(let key in State.heights){
          let arr = key.split('_').map(el=>Number(el));
          // let bool = (this.section[0]>=arr[0]&&this.section[0]<=arr[1])||(this.section[1]>=arr[0]&&this.section[1]<=arr[1]);
          // let bool = (arr[0]<=this.section[1]&&arr[0]>=this.section[0])||(arr[1]<=this.section[1]&&arr[1]>=this.section[0]);
          // let bool = (this.section[0]<=arr[1]&&this.section[0]>=arr[0])||(this.section[1]<=arr[1]&&this.section[1]>=arr[0]);
          let bool = (this.section[0]>=arr[0]&&this.section[0]<=arr[1])||(this.section[1]>=arr[0]&&this.section[1]<=arr[1]);
          if(bool) enableList.push(key);
        };
        let lists = Object.keys(State.heights);
        lists.forEach((el,i)=>{
          if(i==lists.length-1){
            context.features().disable(el);
          }else{
            context.features().disable(el,true);
          }
        });
        
        enableList.forEach((el,i)=>{
          if(i==enableList.length-1){
            context.features().enable(el);
          }else{
            context.features().enable(el,true);
          }
        });
        // console.log(State.heights);
        console.log(enableList)
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
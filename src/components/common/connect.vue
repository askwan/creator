<template>
  <div class="relation-box">
    <ul class="relation-list mg-bottom-mini">
      <li class="relation-el flex-center">
        <span class="r-obj font-12 text-ellipsis" :title="left">{{left}}</span>
        <div class="r-connector flex-column">
          <span class="r-name text-ellipsis">{{center}}</span>
          <div class="r-center flex-center">
            <span class="underline"></span>
            <i class="iconfont icon-zuojiantou"></i>
          </div>
        </div>
        <span class="r-obj font-12 text-ellipsis" :title="right">{{right}}</span>
        <i class="el-icon-delete pointer-danger" @click.stop="deleteIt"></i>
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    data(){
      return {

      }
    },
    props:['left','right','center','id'],
    components:{},
    computed:{},
    mounted(){

    },
    methods:{
      deleteIt(){
        // console.log(this.id)
        this.$emit('deleteIt',this.id);
      }
    }
  }
</script>
<style lang='scss' scoped>
  .connect-box{
    .connect-text{
      width: 60px;
      flex-shrink: 0;
    }
    .connect-center{
      flex-grow: 2;
      // width: 50px;
      .center-text{
        margin-bottom: -5px;
      }
      .connect-underline{
        .connect-hr{
          width: calc(100% - 50px);
          // display: inline-block;
          border-bottom: 1px solid #333; 
        }
        i{
          vertical-align: middle;
        }
      }
    }
  }

  .relation-box{
      .relation-list{
        .relation-el{
          .r-obj{
            width: 40px;
          }
          height: 40px;
          .r-connector{
            .r-name{
              display: inline-block;
              margin-bottom: -5px;
            }
            .r-center{
              margin: -33px 10px 0px; 
              .underline{
                display: inline-block;
                width: 100px;
                border: 0.5px solid #333;
              }
              i{
                margin-left: -5px;
                padding-top: 1px;
              }
            }
          }
        }

      }
    }
</style>
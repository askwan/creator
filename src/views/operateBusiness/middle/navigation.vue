<template>
     <div class="domain-top cle">
          <div class="domain-fl cle">
              <a href="javascript:;" :class="{active:domainActive==list.value}" v-for="(list,i) in domainTopList" @click="switchStatus(list)" :key="i">{{list.name}}</a>
          </div>
          <div class="domain-fr">
              <!-- <search-bar :tagVal="tagVal" @searchBar="searchBarFn" @tagBar="clickAdd" doShowSearch="true"></search-bar> -->
          </div>
      </div>
</template>

<script>
export default {
    data() {
        return {
          domainActive : 0,
          domainTopList:[
            { 
             name: "我的业务",
             value: 0
            },
            { 
             name: "所有业务",
             value: 1
            }
          ]
        };
    },
    components: {
    },
    watch:{
     
    },
    mounted() {
	 
    },
    methods: {
      clickAdd(){
       
      },
      switchStatus(data){
        this.domainActive = data.value; 
        this.$emit("navSwitch",data)
      },
      searchBarFn(val){
      }
    }
};
</script>
<style lang="less" scoped>
 .domain-top {
  margin: 0 30px;
  border-bottom: 1px solid #e1e3e6;
  .domain-fl {
    float: left;
    a {
      position: relative;
      display: block;
      float: left;
      color: #999;
      font-size: 14px;
      line-height: 60px;
      margin: 0 30px 0 0;
      transition: all 0.2s ease;
      span {
        color: #999;
        font-size: 14px;
      }
    }
    a:after {
      content: "";
      display: block;
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 0;
      height: 1px;
      background: #176de6;
      overflow: hidden;
      transition: all 0.2s ease;
    }
    a.active:after {
        left: 0;
        width: 100%;
      }
    a.active {
      color: #176de6;
      span {
        color: #176de6;
      }
    }
  }
  .domain-fr {
    float: right;
    padding-top: 17px;
  }
}
</style>
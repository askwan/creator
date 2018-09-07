<template>
    <div class="tabs-box cle">
       <a href="javascript:;" 
       :class="{'active':tab.value == val}" 
       @click="handleClick(tab,i)" v-for="(tab,i) in tabsList" 
       :key="tab.id">{{tab.name}}</a>
    </div>
</template>
<script>
export default {
  props:{
    tabsList : Array,
    value : [Number,String]
  },
  data() {
    return {
      val : this.value
    };
  },
  mounted(){
    if( this.$route.query.mark ){
      this.val = this.$route.query.mark;
    }
  },
  watch:{
      "value"(){
        this.val = this.value;
      }
  },
  methods:{
    handleClick(data,i){
      this.val = data.value;
      this.$emit("input",this.val)
      this.$emit("handleClick",data)
    }
  }
};
</script>
<style lang="less" scoped>
.tabs-box {
  a {
    float: left;
    color: #999;
    font-size: 14px;
    display: block;
    line-height: 16px;
    height: 25px;
    text-decoration: none;
    position: relative;
    padding: 0 10px;
    transition: all .3s ease;
    &:after {
      transition: all .3s ease;
      content:"";
      display: block;
      position: absolute;
      bottom: 0;
      left: 10px;
      right: 10px;
      height: 2px;
      background: #176de6;
      opacity: 0;
    }
    &.active {
      color: #176de6;
      &:after {
        opacity: 1;
      }
    }
  }
}
</style>

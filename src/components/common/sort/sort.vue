<template>
      <a href="javascript:;" class="sort-one" :class="{
        'active-top':checkedDirection == 1 && checkedStatus == sortData.id ,
        'active-bottom':checkedDirection == 0 && checkedStatus == sortData.id 
        }" @click="clickSortFn">
        <span>{{sortData.text}}</span>
      </a>
</template>
<script>
export default {
  props:{
    checkedDirection: Number,
    checkedStatus: Number,
    sortData : Object,
  },
  data() {
    return {
    };
  },
  mounted(){
  },
  methods:{
   clickSortFn(){
     this.$emit("clickSortFn",this.sortData);
   }
  }
};
</script>
<style lang="less" scoped>
  .sort-one {
    position: relative;
    float: left;
    padding: 0 12px 0 15px;
    line-height: 36px;
    text-decoration: none;
    &.active-top {
      &:after {
        border-bottom-color: #176de6;
      }
    }
    &.active-bottom {
      &:before {
        border-top-color: #176de6;
      }
    }
    &:after,&:before{
      position: absolute;
      content: "";
      display: block;
      width: 0;
      height: 0;
      border: 2px solid transparent;
    }
    &:after {
      top: 13px;
      right: 2px;
      border-bottom-color: #d6d7d8;
      border-bottom-width: 3px;
    }
    &:before {
      top: 20px;
      right: 2px;
      border-top-color: #d6d7d8;
      border-top-width: 3px;
    }
    span {
      color: #666;
    }
  }
</style>

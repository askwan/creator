<template>
      <a href="javascript:;" class="check-one" :class="{'active':val}"  @click="clickCheckFn">
        <span class="check-checked"></span><span class="check-text">{{checkText}}</span>
      </a>
</template>
<script>
export default {
  props:{
    // checkedDirection: Number,
    // checkedStatus: Number,

    value : Boolean,
    checkText : String
  },
  data() {
    return {
      val: this.value,
    };
  },
  watch:{
    "value"(){
      console.log("bbbbbbbbbb")
      this.val = this.value;
    }
  },
  mounted(){
  },
  methods:{
   clickCheckFn(){
     this.val = !this.val;
     this.$emit("clickCheckFn",this.val);
   }
  }
};
</script>
<style lang="less" scoped>
 .check-one {
   text-decoration: none;
   vertical-align: top;
    &.active {
       .check-checked {
         background: #409eff;
         border: 1px solid #409eff;
         &:after,&:before {
           opacity: 1;
         }
       }
     }
   .check-checked {
     display: inline-block;
     width: 12px;
     height: 12px;
     border: 1px solid #dfe1e6;
     vertical-align: middle;
     position: relative;
     transition: all .3s ease;
     &:after {
        content: "";
        position: absolute;
        display: block;
        width: 5px;
        height: 1px;
        background: #fff;
        top: 6px;
        left: 0px;
        transform: rotate(45deg);
        opacity: 0;
        transition: all .3s ease;
     }
     &:before {
        content: "";
        position: absolute;
        display: block;
        width: 1px;
        height: 8px;
        background: #fff;
        top: 1px;
        left: 6px;
        transform: rotate(45deg);
        opacity: 0;
        transition: all .3s ease;
     }
   }
   .check-text {
     margin: 0 0 0 5px;
     vertical-align: middle;
   }
 }
</style>

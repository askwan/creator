<template>
    <div class="page-status">
      <div class="page-fl">
        <div class="border"></div>
        <div class="round"></div>
        <div class="text">D</div>
      </div>
      <div class="page-center">
        <img src="../assets/images/villain.gif" alt="">
        <span>Creator</span>
      </div>
      <div class="page-fr">
        <div class="border"></div>
        <div class="round"></div>
        <div class="text">B</div>
      </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
    };
  },
  mounted(){

  }
};
</script>
<style lang="less" scoped>
.page-status {
  position: relative;
  height: 40px;
  background: #e8eaed;
  .page-fl {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 115px;
    .border {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      margin: -1px 0 0 0;
      width: 115px;
      height: 2px;
      background: #c8d1de;
    }
    .round {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 16px;
      height: 16px;
      line-height: 16px;
      background: #66cc81;
      color: #fff;
      font-size: 12px;
      text-align: center;
      border-radius: 50%;
      transform: translate(-50%,-50%)
    }
    .text {
      position: absolute;
      top: 11px;
      left: 54px;
      line-height: 16px;
      color: #fff;
    }
  }
  .page-center {
    position: absolute;
    top: 0;
    left: 120px;
    line-height: 40px;
    img {
      float: left;
      margin: 12px 0 0 0;
    }
    span {
      margin: 0 0 0 3px;
      float: left;
      color: #4588e5;
    }
  }
  .page-fr {
    position: absolute;
    top: 0;
    left: 183px;
    right: 0;
    bottom: 0;
    .border {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      margin: -1px 0 0 0;
      height: 1px;
      background: url(../assets/images/header-border.png) left center no-repeat;
    }
    .round {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 16px;
      height: 16px;
      line-height: 16px;
      background: #c8d0de;
      color: #fff;
      font-size: 12px;
      text-align: center;
      border-radius: 50%;
      margin: -8px 0 0 -10px;
    }
    .text {
      position: absolute;
      top: 11px;
      left: 54px;
      color: #fff;
      line-height: 16px;
    }
  }
}
</style>

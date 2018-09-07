<template>
    <div class="header-logo">
       <router-link to="/"><img src="../assets/images/logo.png" alt=""></router-link>
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
.header-logo {
  width: 100%;
  height: 70px;
  a {
    display: block;
    img {
      display: block;
      width: 230px;
      margin: 0 auto;
      padding-top: 20px;
    }
  }
}
</style>

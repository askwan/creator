<template>
  <div id="app" @click="closeRightMenuFn">  
  	<edit-object></edit-object>
    <!--<router-view/>-->
  </div>
</template>

<script>
import { vm, operate } from "@/script/operate.js";
import editObject from '@/views/editObject';
export default {
  name: "app",
  components: {
  	editObject
  },
  mounted(){
    vm.$on(operate.chooseDiagram,item=>{
      sessionStorage.setItem("instant", item.id);
      this.$router.push({
        path: "/instant"
      })
    });
  },
  methods: {
  	closeRightMenuFn(){
  		vm.$emit(operate.closeRightMenu, {value:false});
  	}
  }
};
</script>

<style>
#app {
  height: 100%;
  width: 100%;
}
</style>

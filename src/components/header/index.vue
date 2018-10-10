<template>
  <div class='header-boxs fill flex-between pd-left-small pd-right-small'>
    <div class="header-left flex">
      <div class="header-logo flex-center mg-right-big">
        <img class="mg-right-small" src="../../../static/images/nav-img.png" alt="">
        <span class="font-18">Creator</span>
      </div>
      <el-button-group>
        <el-button class="btn" size="small" :type="activeName==1?'primary':''" @click="change">{{chooseItem}}</el-button>
        <el-button class="btn" :disabled="!ifEdit" size="small" :type="activeName==2?'primary':''" @click="select('historyList')">历史</el-button>
        <el-button class="btn" :disabled="!ifEdit" size="small" :type="activeName==3?'primary':''" @click="select('viewExport')">导出</el-button>
      </el-button-group>
    </div>
    <div class="header-right flex-align">
      <!-- <div v-if="!userName" class="login font-14 flex-center pointer" @click="login">登录</div> -->
      <common-bar :lists="userLists" height="53" @select="exit">
        <div class="flex-center">
          <img class="user-icon img-radius mg-right-small" :src="icon" alt="">
          <span class="user-name text-ellipsis">{{userName}}</span>
        </div>
      </common-bar>
      <common-bar height="53" title="网站导航" :lists="list" @select="choose"></common-bar>
    </div>
  </div>
</template>
<script>
  import {vm,operate} from '@/script/operate'
  import common from '@/script/common'
  export default {
    data(){
      return {
        // common:common,
        list:[{name:'blueThink',href:'http://bluethink.cn'},{name:'OneGis',href:"http://www.onegis.org"}],
        userLists:[{name:'退出',id:'exit'}],
        userName:'',
        icon:'',
        chooseItem:'浏览',
        activeName:1,
        ifEdit:false
      }
    },
    props:{},
    components:{
      "commonBar" :()=>import('@/components/common/submenu'),
    },
    watch:{
      $route(a,b){
        if(a.path=='/view'){
          this.chooseItem = '编辑';
          this.ifEdit = true;
        }else{
          this.chooseItem = '浏览';
          this.ifEdit = false;
        }
      }
    },
    computed:{},
    mounted(){
      this.listenEvent();
      // this.userName = common.getInfo('nickName');
      // this.icon = common.getAvatar(common.getInfo('avatar'));
      if(!this.userName){
        // common.exitUser.exitAddress();
      }
    },
    created: function() {
      if(sessionStorage.getItem('user')){
        let obj = JSON.parse(sessionStorage.getItem('user'));

        this.userName = obj.nickName;
        this.icon = common.getAvatar(obj.avatar);
        return
      }
			var _token = this.$route.query.token;
			var _url = this.$route.query.url;
			// console.log(_token)
			if(_token) { //判断地址栏是否有token
				common.setItem("token", _token);
				common.getNewUser("get", "/account/authorize", {}, res => {
					common.setUserInfo(res);
					this.$router.push({
						path: "/"
          });
          this.userName = common.getInfo('nickName');
          this.icon = common.getAvatar(common.getInfo('avatar'));
				})
			} else { //地址栏没有token 退出重新登陆
				common.exitUser.exitAddress();
			}
		},
    methods:{
      listenEvent(){

      },
      select(name){
        vm.$emit(operate.openTab,{name:name});
        name=='historyList'?this.activeName = 2:this.activeName = 3;
      },
      choose(obj){
        window.open(obj.href);
      },
      exit(){
        common.exitUser.requestOutUser()
      },
      login(){
        // common.
      },
      change(){
        this.activeName = 1
        this.chooseItem=='浏览'?this.chooseItem = '编辑':this.chooseItem = '浏览';
        let path = '';
        this.chooseItem=='编辑'?path = '/view':path = '/edit';
        this.$router.push(path)
      }
    }
  }
</script>
<style lang='scss' scoped>
  .header-boxs{
    // background-color: red;
    .header-left{
      .header-logo{
        img{
          width: 30px;
        }
        span{
          font-weight: bold;
        }
      }
    }
    .btn{
      height: 35px;
    }
    .user-icon{
      width: 40px;
      height: 40px;
    }
    .user-name{
      display: inline-block;
      max-width: 70px;
    }
    .login{
      height: 53px;
      width: 60px;
      color: #666;
    }
  }
</style>
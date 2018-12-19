<template>
  <div class='header-boxs fill flex-between pd-left-small pd-right-small'>
    <div class="header-left flex">
      <div class="header-logo flex-center mg-right-big">
        <img class="mg-right-small" src="../../../static/images/nav-img.png" alt="">
        <span class="font-18">数据采编工具</span>
      </div>
      <el-button-group>
        <el-button class="btn" size="small" :type="path!=='/view'?'primary':'success'" @click="change">{{chooseItem}}</el-button>
        <el-button class="btn" :disabled="!ifEdit" size="small" @click="select('historyList')">历史</el-button>
        <el-button class="btn" :disabled="!ifEdit" size="small" @click="select('viewExport')">导出</el-button>
        
         <el-button class="btn" :disabled="!ifEdit" size="small" @click="select('modelList')">模型</el-button>
          <el-button class="btn" :disabled="!ifEdit" size="small" @click="select('imageList')">影像</el-button>
      </el-button-group>
    </div>
    <div class="header-right flex-align">
      <div class="font-14 font-black pointer" @click="isShow=true">{{currentSdomain.name}}</div>
      <!-- <div v-if="!userName" class="login font-14 flex-center pointer" @click="login">登录</div> -->
      <common-bar :lists="userLists" height="53" @select="exit">
        <div class="flex-center">
          <img class="user-icon img-radius mg-right-small" :src="icon" alt="">
          <span class="user-name text-ellipsis">{{userName}}</span>
        </div>
      </common-bar>
      <common-bar height="53" title="网站导航" :lists="list" @select="choose"></common-bar>
    </div>
    <el-dialog :visible.sync="isShow">
      <div class="domain-list flex wrap pd-big">
        <div class="domain-tag pd-small radius-2 pointer-shadow flex-center mg-right-small mg-bottom-small" v-for="item in sdomains" :key="item.id" :class="{active:item.id==currentSdomain.id}" @click="chooseDomain(item)">
          <i class="el-icon-success mg-right-mini"></i>
          <span>{{item.name}}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {vm,operate} from '@/script/operate'
  import common from '@/script/common'
  import {sdomainServer} from '@/script/server'
  import {State} from '@/script/editor/utils/store.js'
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
        ifEdit:false,
        path:'',
        isShow:false,
        sdomains:[],
        currentSdomain:{
          id:0,
          name:'请选择时空域'
        }
      }
    },
    props:{},
    components:{
      "commonBar" :()=>import('@/components/common/submenu'),
    },
    watch:{
      $route(a,b){
        this.path = a.path;
        if(a.path=='/view'){
          this.chooseItem = '编辑';
          this.ifEdit = true;
        }else{
          this.chooseItem = '浏览';
          this.ifEdit = false;
        }
      },
    },
    computed:{},
    mounted(){
      this.listenEvent();
      if(this.$route.path=='/view'){
        this.chooseItem = '编辑',
        this.ifEdit = true;
      }else{
        this.chooseItem = '浏览';
        this.ifEdit = false;
      }
      this.path = this.$route.path;
      sdomainServer.getList().then(res=>{
        this.sdomains = res.list;
        if(res.list.length>0){
          let domain = sessionStorage.getItem('sdomain');
          if(domain){
            this.currentSdomain = JSON.parse(domain);
          }else{
            this.isShow = true;
          }
        }
      })
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
				if(!sessionStorage.getItem('user')){
          common.exitUser.exitAddress();
        }
			}
		},
    methods:{
      listenEvent(){
        vm.$on('tokenReady',user=>{
          this.userName = user.nickName;
          this.icon = common.getAvatar(user.avatar)
        })
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
        // this.chooseItem=='浏览'?this.chooseItem = '编辑':this.chooseItem = '浏览';
        // let path = '';
        this.path = this.path =='/view'?'/edit':'/view'
        // this.path=='编辑'?path = '/view':path = '/edit';
        this.$router.push(this.path);
      },
      chooseDomain(item){
        this.currentSdomain = item;
        this.isShow = false;
        vm.$emit(operate.changeDomain,item);
        sessionStorage.setItem('sdomain',JSON.stringify(item));
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
    .domain-list{
      height: 300px;
      overflow-y: auto;
      align-content: start;
      .domain-tag{
        border: 1px solid #ccc;
        height: 40px;
        
      }
      .active{
        border-color: #3a8ee6;
        i{
          color: #3a8ee6;
        }
      }
    }
  }
</style>
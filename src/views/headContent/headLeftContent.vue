<template>
	<div class="head-fl cle">
		<div class="head-logo">
			<router-link to="/">
				<img src="../../assets/images/nav-img.png" alt="">
			</router-link>
			<span>Creator</span>
		</div>
		<!-- 修改为与OSM类似的操作方式 -->
		<div class="change-edit-view" :class="{'change-grayed': !changeGrayed}">
			<span @click="updateStatus" :class="{'current-span':currentSpan==1}">{{textMessage}}</span>
			<span @click="viewHistoryFn" :class="{'current-span':currentSpan==2}" v-if="changeGrayed">历史</span>
			<el-tooltip class="item" effect="dark" content="请在浏览状态下查看历史" placement="bottom" v-else>
		    	<span @click="viewHistoryFn" :class="{'current-span':currentSpan==2}">历史</span>
		    </el-tooltip>
			<span @click="viewExportFn" :class="{'current-span':currentSpan==3}" v-if="changeGrayed">导出</span>
			<el-tooltip class="item" effect="dark" content="请在浏览状态下导出数据" placement="bottom" v-else>
		    	<span @click="viewExportFn" :class="{'current-span':currentSpan==3}">导出</span>
		    </el-tooltip>
		</div>
		<div class="current-status cle" v-if="false">
			<!--<div class="page-fl cle">
        <a href="./designer" class="page-jump"></a>
        <div class="border"></div>
        <div class="round"></div>
        <div class="text">D</div>
      </div>
       <div class="page-center cle">
        <a href="./creator" class="page-jump"></a>
        <div class="border"></div>
        <div class="round"></div>
        <div class="text">C</div>
      </div>
       <div class="page-right cle">
        <a href="" class="page-jump"></a>
        <div class="border"></div>
        <div class="round"></div>
        <div class="text">B</div>
      </div>-->
		</div>
		<div class="head-menu cle" v-show="loading" v-if="false">
			<div class="child-list-box" style="width:600px">
				<div class="list-position cle">
					<div class="d-box cle">
						<ul class="child-list">
							<li class="pd-2" @click="pathTo">返回</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
		<div class="head-menu cle" v-show="!loading" v-if="false">
			<!--<router-link to="/designer" class="cle icon-a"><i class="iconfont icon-duixiangjianmo"></i><span>对象建模</span></router-link>-->
			<div class="child-list-box" :style="{'width':'600px'}">
				<!--<div class="child-list-box" :style="{'width':this.designerWidth+'px'}">-->
				<div class="list-position cle">
					<div class="d-box cle" ref="dBox">
						<!--<div class="iconfont icon-youjiantou1"></div>-->
						<ul class="child-list">
							<li v-for="(child,index) in designerList" :key="index" @click="pathTo('designerList',child,index)" :class="{'pd-2':true,'actived':child.id===tabManage.activeTabItem&&child.isShow}" v-if="child.isCompontent">{{child.name}}</li>

						</ul>
					</div>
				</div>
			</div>
			<!--<router-link to="/business" class="cle icon-a">
      <i class="iconfont icon-tubiao-"></i><span>业务建模</span>
    </router-link>
     <div class="child-list-box" :style="{'width':this.businessWidth+'px'}">
       <div class="list-position cle">
         <div class="b-box cle" ref="bBox">
           <div class="iconfont icon-youjiantou1"></div>
           <ul class="child-list">
            <li 
            v-for="(child,index) in businessList" 
            :key="index" 
            @click="pathTo('businessList',child,index)"
            :class="{'pd-2':true,'actived':child.id===tabManage.activeTabItem&&child.isShow}" v-if="child.isCompontent"
            >{{child.name}}</li>
          </ul>
          </div>
        </div>  
      </div>-->
			<!-- <router-link to="/designer" class="cle icon-a"><i class="iconfont icon-duixiangjianmo"></i><span>对象建模</span></router-link>   -->
		</div>
	</div>
</template>
<script>
	import common from "@/script/common";
	import { tabManage } from "@/components/designer/tabmanage";
	import { vm, operate } from "@/script/operate.js";
	import EditManage from '@/script/mapbox/EditManage';
	export default {
		data() {
			return {
				common,
				tabManage,
				loading: true,
				designerList: tabManage.getDesignerChildren(),
				//businessList: tabManage.getBusinessChildren(),
				designerWidth: 0,
				businessWidth: 0,
				ifEdit:true,
				generalEdit:true,
				currentSpan: 1,
				textMessage: "浏览",
				changeGrayed: true,
			};
		},
		mounted() {
			if(this.$route.path == "/editObject") {
				this.businessWidth = 0;
				this.loading = false;
				setTimeout(() => {
					this.designerWidth = 0;
					this.businessWidth = 0;
				})
			} else if(this.$route.path == "/designer") { //动画
				this.businessWidth = 433;
				this.loading = false;
				setTimeout(() => {
					this.designerWidth = 456;
					this.businessWidth = 0;
				})
			} else if(this.$route.path == "/business") {
				this.designerWidth = 456;
				this.loading = true;
				setTimeout(() => {
					this.designerWidth = 0;
					this.businessWidth = 433;
				})
			}
			this.listenEvent();
		},
		watch: {
			ifEdit(val){
				if (val) {
					this.textMessage = "浏览";
					this.changeGrayed = false;
					vm.$emit(operate.ifEdit,{status:true});
					//一个隐藏，一个显示
					vm.$emit(operate.changeSlider,{hideLeft:true,hideRight:false});
				} else{
					this.textMessage = "编辑";
					this.changeGrayed = true;
					vm.$emit(operate.ifEdit,{status:false});
					//左边栏与右边栏全隐藏
					vm.$emit(operate.changeSlider,{hideLeft:true,hideRight:true});
				}
			},
			'$route' (val) {
				var str = val.path;
				var hre = str.substring(1 , str.length);
				if (hre == "edit") {
					this.textMessage = "浏览";
					this.changeGrayed = false;
					vm.$emit(operate.ifEdit,{status:true});
					//一个隐藏，一个显示
					vm.$emit(operate.changeSlider,{hideLeft:true,hideRight:false});
				}
				if (hre == "view") {
					this.textMessage = "编辑";
					this.changeGrayed = true;
					vm.$emit(operate.ifEdit,{status:false});
					//左边栏与右边栏全隐藏
					vm.$emit(operate.changeSlider,{hideLeft:true,hideRight:true});
				}
			}
		},
		methods: {
			pathTo(tag, obj, index) {
				if(this.$route.path == '/editObject') {
					this[tag].forEach((item, index) => {
						if(item.id == obj.id) {
							this.tabManage.setTabItem(obj);
						}
					})
				} else if(this.$route.path == '/business' || this.$route.path == '/instant') {
					this.$router.push({
						path: '/editObject'
					})
				}
				// this.tabManage.setTabItem(obj);
				/*this.choose = index;
				this.$emit("selectClass", obj);
				obj.isShow = true;*/
			},
			listenEvent(){
				var str = location.hash;
				var hre = str.substring(2, str.length);
				if(hre === "edit"){
					this.ifEdit = true;
					this.changeGrayed = false;
				}
				if (hre === "view") {
					this.ifEdit = false;
					this.changeGrayed = true;
				}
				
				/*vm.$emit(operate.ifEdit,{status:this.ifEdit});
				vm.$on(operate.ifEdit,data=>{
					this.ifEdit = data.status;
				})*/
			},
			updateStatus(){
				this.currentSpan = 1;
				// this.ifEidt = !this.ifEidt;
				// vm.$emit(operate.ifEdit,{status:false});
				if(this.ifEdit){
					this.$router.push({path:'/view'});
					this.ifEdit = false;
					vm.$emit(operate.ifEdit,{status:this.ifEdit});
					//左边栏与右边栏全隐藏
					vm.$emit(operate.changeSlider,{hideLeft:true,hideRight:true});
					// vm.$emit(operate.exitEdit);
					// let list = tabManage.getDesignerChildren();
					// tabManage.setTabItem(list[0]);
					// console.log('tuichuosm');
				}else{
					this.$router.push({path:'/edit'});
					this.ifEdit = true;
					vm.$emit(operate.ifEdit,{status:this.ifEdit});
					//一个隐藏，一个显示
					vm.$emit(operate.changeSlider,{hideLeft:true,hideRight:false});
					/*this.generalEdit = false;
					vm.$emit(operate.generalEdit,{status:this.generalEdit});
					EditManage.exitEdit();*/
					// console.log('tuichumapbox')
				}
				
			},
			viewHistoryFn(){
				if (this.changeGrayed) {
					this.currentSpan = 2;
					var str = location.hash;
					var hre = str.substring(2, str.length);
					if(hre === "edit"){
						this.ifEdit = !this.ifEdit;
						this.$router.push({path:'/view'});
					}
					setTimeout(() => {
						// vm.$emit(operate.changeSlider,{hideLeft:true,hideRight:false});
						vm.$emit('changeTabs',{name:'showHistory'})
						vm.$emit(operate.viewHistoryEvent , "viewHistory");
					}, 500)
				}
			},
			viewExportFn(){
				if (this.changeGrayed) {
					this.currentSpan = 3;
					var str = location.hash;
					var hre = str.substring(2, str.length);
					if(hre === "edit"){
						this.ifEdit = !this.ifEdit;
						this.$router.push({path:'/view'});
					}
					setTimeout(() => {
						// vm.$emit(operate.changeSlider,{hideLeft:true,hideRight:false});
						vm.$emit('changeTabs',{name:'showExport'})
						vm.$emit(operate.viewHistoryEvent , "viewExport");
					}, 500)
				}
			},

		}
	};
</script>

<style lang="less" scoped>
	.icon-youjiantou1 {
		float: left;
		color: #969799;
		margin: 4px 0 0 15px;
		font-size: 12px;
	}
	
	.child-list-box {
		float: left;
		margin: 2px 0 0 10px;
		transition: all .5s ease;
		position: relative;
		overflow: hidden;
		height: 23px;
		.list-position {
			position: absolute;
			top: 0;
			left: 0;
			width: 600px;
			.child-list {
				float: left;
				li {
					float: left;
					color: #969799;
					font-size: 14px;
					padding: 0 14px;
					cursor: pointer;
					&.actived {
						color: #176de6;
					}
				}
			}
		}
	}
	
	.head-menu {
		float: left;
		margin: 15px 0 0 15px;
	}
	
	.icon-a {
		margin: 0 0 0 30px;
		font-size: 16px;
		color: #666;
		text-decoration: none;
		float: left;
		i {
			margin: 0 5px 0 0;
			float: left;
			font-size: 20px;
		}
		span {
			float: left;
		}
		&.active {
			color: #176de6;
		}
	}
	
	.head-fl {
		float: left;
		margin: 0 0 0 10px;
		height: 50px;
	}
	
	.head-logo {
		height: 53px;
		float: left;
		display: flex;
		flex-direction: row;
		justify-content: center;
		a {
			display: inline-block;
			img {
				display: inline-block;
				width: 30px;
				/*width: 230px;*/
				margin: 0 auto;
				padding-top: 12px;
			}
		}
		span {
			color: #333;
			line-height: 52px;
			margin-left: 10px;
			font-size: 18px;
			font-weight: bold;
		}
	}
	
	.current-status {
		float: left;
		position: relative;
		height: 16px;
		/*width: 96px;*/
		width: 5px;
		margin: 18px 0 0 20px;
		.text {
			position: absolute;
			line-height: 16px;
			color: #fff;
		}
		.round {
			position: absolute;
			width: 16px;
			height: 16px;
			line-height: 16px;
			color: #fff;
			font-size: 12px;
			text-align: center;
			border-radius: 50%;
		}
		.page-jump {
			position: absolute;
			top: 0;
			width: 16px;
			height: 16px;
			z-index: 10;
		}
		.page-fl {
			float: left;
			.page-jump {
				left: 0px;
			}
			.border {
				position: absolute;
				top: 7px;
				left: 15px;
				width: 25px;
				height: 2px;
				background: #dae4f2;
			}
			.round {
				top: 0;
				left: 0;
				background: #4588e6;
			}
			.text {
				top: -1px;
				left: 4px;
			}
		}
		.page-center {
			float: left;
			.page-jump {
				left: 40px;
			}
			.border {
				position: absolute;
				top: 8px;
				left: 55px;
				width: 25px;
				height: 0px;
				border: 1px dashed #dae4f2;
			}
			.round {
				top: 0;
				left: 40px;
				width: 16px;
				height: 16px;
				background: #dae4f2;
			}
			.text {
				top: -1px;
				left: 44px;
			}
		}
		.page-right {
			float: left;
			.page-jump {
				left: 79px;
			}
			.round {
				top: 0;
				left: 79px;
				background: #dae4f2;
			}
			.text {
				top: -1px;
				left: 84px;
			}
		}
	}
	
	.d-box,
	.b-box {
		float: left;
	}
	
	.change-edit-view {
		width: 174px;
		margin-left: 120px;
		display: flex;
		flex-direction: row;
		margin-top: 9px;
		border: 1px solid #7ebc6f;
    	border-radius: 3px;
		span {
			text-align: center;
			width: 58px;
			font-weight: 500;
    		color: #7ebc6f;
			line-height: 33px;
			font-size: 14px;
			cursor: pointer;
		}
		span:nth-child(2), span:nth-child(3){
			border-left: 1px solid #7ebc6f;
		}
		span:not(.current-span):hover{
			background: #dcedd7;
		}
		.current-span{
			background-color: #7ebc6f;
			color: #fff;
		}
	}
	.change-grayed{
		span:nth-child(2), span:nth-child(3){
			border-left: 1px solid #DEDEDE;
			color: #CCC;
		}
		span:not(.current-span):hover{
			background: #FFF;
		}
	}
</style>
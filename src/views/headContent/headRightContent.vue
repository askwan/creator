<template>
	<div class="head-fr cle">
		<!-- <router-link to="/designer" class="cle icon-a"><i class="iconfont icon-duixiangjianmo"></i><span>对象建模</span></router-link>  
    	<div class="head-border"></div> -->
		<!-- <router-link to="/business" class="head-one" :class="{'change-color':diagramColor}">
			<i class="iconfont icon-yewuguanli1"></i><span>类视图管理</span>
		</router-link> -->

		<!-- <common-submenu class="sub-menu">
			<a href="javascript:;" slot="title" class="sub-tit cle">
				<div class="user-name head-one">
					<i class="iconfont icon-yewuguanli1"></i><span>类视图管理</span>
				</div>
				<i class="iconfont icon-icon1"></i>
			</a>
			<div slot="down" class="down-box">
				<a v-for="(list,i) in lists" :key="i" href="javascript:;" class="el-list" @click="selectList(list)">{{list.name}}</a>
			</div>
		</common-submenu> -->

		<!-- <select-menu title="开始编辑" :lists="lists" class="sub-menu" :width="80" :height="height" @select="selectList" methods="click" v-if="!ifEdit&&!generalEdit">

		</select-menu> -->
	

		<!-- <div class="sub-menu">开始编辑</div> -->
		<!-- <a href="javascript:void(0);" @click="updateStatus" class="head-one" :class="{'change-color':businessColor}" v-else>
			<i class="iconfont icon-yewuguanli"></i><span>{{textMessage}}</span>
		</a> -->
		<!-- <router-link to="/diagram" class="head-one" :class="{'change-color':businessColor}">
			<i class="iconfont icon-yewuguanli"></i><span>业务管理</span>
		</router-link> -->
		<common-submenu class="sub-menu">
			<a :href="common.ucJumpUrl" target="_blank" slot="title" class="sub-tit cle">
				<div class="user-avatar">
					<img :src="common.getAvatar(common.getInfo('avatar'))" alt="">
				</div>
				<div class="user-name omitted" :title="common.getInfo('nickName')">
					{{common.getInfo('nickName')}}
				</div>
				<i class="iconfont icon-icon1"></i>
			</a>
			<div slot="down" class="down-box">
				<a href="javascript:;" @click="common.exitUser.requestOutUser()">退出</a>
			</div>
		</common-submenu>
		<common-submenu class="sub-menu">
			<a href="javascript:;" slot="title" class="sub-tit cle">
				<div class="user-name">
					网站导航
				</div>
				<i class="iconfont icon-icon1"></i>
			</a>
			<div slot="down" class="down-box">
				<a href="http://bluethink.cn" target="_blank">BlueThink</a>
				<a href="http://www.onegis.org" target="_blank">OneGis</a>
			</div>
		</common-submenu>
	</div>
</template>

<script>
	import common from "@/script/common";
	import { vm, operate } from "@/script/operate.js";
	import psde from "@/psde";
	import { tabManage } from "@/components/designer/tabmanage";
	import EditManage from '@/script/mapbox/EditManage'
	export default {
		data() {
			return {
				common,
				businessColor: true,
				diagramColor: false,
				address: '',
				diagram: new psde.Diagram(),
				searchTxt: "",
				lists: [{
					id: 1,
					name: '编辑osm'
				}, {
					id: 2,
					name: '编辑普通几何'
				}],
				height: '53px',
				ifEdit: false,
				generalEdit: true
			};
		},
		components: {
			"common-submenu": () =>
				import("@/components/common/submenu/submenu"),
			'selectMenu': () =>
				import('@/components/common/selectMenu')
		},
		computed: {
			textMessage() {
				// return this.ifEidt?'退出编辑':'开始编辑';
				return '退出编辑'
			}
		},
		watch: {
			address(val) {
				if(val == "#/diagram") {
					this.businessColor = false;
					this.diagramColor = true;
				} else {
					this.businessColor = false;
					this.diagramColor = false;
				}
			}
		},
		mounted() {
			this.address = document.location.hash;
			this.init();
			this.listenEvent();
			this.ifEdit = true;
			vm.$emit(operate.ifEdit, {
				status: this.ifEdit
			});
		},
		methods: {
			listenEvent() {
				vm.$on(operate.ifEdit, data => {
					this.ifEdit = data.status;
				})
			},
			createDiagram() {
				vm.$emit(operate.createNewDiagram, {
					value: true
				});
			},
			init() {
//				var arr = {
//					orderType: "ID",
//					descOrAsc: true,
//					name: this.searchTxt,
//					
//				};
//				this.diagram.names = this.searchTxt;
//				this.diagram.orderType = "ID";
//				this.diagram.query(this.diagram).then(data => {
//					// this.lists = data.list;
//					// console.log(this.lists,'lists');
//					this.lists = data.list.filter(el=>{
//						// return common.isMy(el.user.uid)
//						return true
//					})
//				})
			},
			selectList(item) {
				if(item.id == 1) {
					this.ifEdit = true;
					vm.$emit(operate.ifEdit, {
						status: this.ifEdit
					});
				} else {
					this.generalEdit = true;
					EditManage.startEdit();
					vm.$emit(operate.generalEdit, {
						status: this.generalEdit
					});
				}
			},
			updateStatus() {
				// this.ifEidt = !this.ifEidt;
				// vm.$emit(operate.ifEdit,{status:false});
				if(this.ifEdit) {
					this.ifEdit = false;
					vm.$emit(operate.ifEdit, {
						status: this.ifEdit
					});
					// vm.$emit(operate.exitEdit);
					// let list = tabManage.getDesignerChildren();
					// tabManage.setTabItem(list[0]);
					// console.log('tuichuosm');
				} else {
					this.generalEdit = false;;
					vm.$emit(operate.generalEdit, {
						status: this.generalEdit
					});
					EditManage.exitEdit();
					// console.log('tuichumapbox')
				}

			}
		}
	};
</script>

<style lang="less" scoped>
	.sub-menu {
		float: left;
		position: relative;
		margin: 0 0 0 23px;
		.sub-tit {
			display: block;
			height: 53px;
			.user-avatar {
				float: left;
				margin: 10px 0 0 0;
				img {
					display: block;
					width: 30px;
					height: 30px;
					overflow: hidden;
				}
			}
			.user-name {
				float: left;
				color: #666;
				font-size: 14px;
				margin: 14px 0 0 4px;
				line-height: 26px;
				max-width: 100px;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.user-level {
				float: left;
				margin: 20px 0 0 2px;
			}
			.icon-icon1 {
				float: left;
				margin: 16px 0 0 4px;
				color: #cdcdcd;
			}
		}
		.down-box {
			position: absolute;
			top: 52px;
			left: 50%;
			margin-left: -50px;
			width: 100px;
			background: #fff;
			box-shadow: 0 0 10px #e1e1e1;
			z-index: 100000;
			a {
				display: block;
				line-height: 40px;
				background: #fff;
				font-size: 14px;
				color: #494a4c;
				text-align: center;
				text-decoration: none;
				&:hover {
					background: #eee;
				}
			}
		}
	}
	
	.head-fr {
		float: right;
		margin: 0 10px 0 0;
		.change-color {
			i {
				color: #176de6;
			}
			span {
				color: #176de6;
			}
		}
	}
	
	.head-one {
		margin: 12px 0 0 15px;
		float: left;
		color: #666;
		font-size: 14px;
		text-decoration: none;
		line-height: 25px;
		&:hover {
			color: #176de6;
			i {
				color: #176de6;
			}
			span {
				color: #176de6;
			}
		}
		i {
			margin: 2px 5px 0 0;
			color: #666;
			float: left;
			font-size: 20px;
		}
		span {
			margin: 2px 0 0 0;
			float: left;
			color: #666;
		}
	}
	
	.head-border {
		width: 1px;
		height: 16px;
		float: left;
		background: #edeff2;
		margin: 18px 15px 0 15px;
	}
</style>
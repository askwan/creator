<template>
	<div class="head-fr cle">
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
				if(this.ifEdit) {
					this.ifEdit = false;
					vm.$emit(operate.ifEdit, {
						status: this.ifEdit
					});
				} else {
					this.generalEdit = false;;
					vm.$emit(operate.generalEdit, {
						status: this.generalEdit
					});
					EditManage.exitEdit();
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
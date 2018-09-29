<template>
	<div class='root-rightcontent'>

		<div class="content-left" v-show="viewContent">
			<div class="close-right-icon">
				<span v-if="viewObjectShow">搜索结果</span>
				<span v-if="viewHistoryShow">修改集合</span>
				<span v-if="viewExportShow">导出</span>
				<i class="iconfont icon-guanbi1" @click="closeRight"></i>
			</div>
			<div class="view-search-detail" v-if="viewObjectShow">
				<view-object :viewSearchValue="viewSearchValue"></view-object>
			</div>
			<div class="view-search-detail" v-if="viewHistoryShow">
				<view-history></view-history>
			</div>
			<div class="view-search-detail" v-if="viewExportShow">
				<view-export></view-export>
			</div>
		</div>
		<div class="content-left" v-show="!viewContent">
			<div class="header" v-show="!hideRight">
				<el-tooltip class="item" effect="dark" :content="headObjectName + '(' + headOtypeName + ')' + headUserName" placement="bottom-start">
			    	<span v-show="objectDetail.id">{{headObjectName}} ( {{headOtypeName}} )</span>
			    </el-tooltip>
				<!-- <i class="iconfont icon-guanbi1" @click="closeRight"></i> -->
			</div>
			<div class="detail">
				<o-detail :component="currentCom" :osmData="osmData" :ifEdit='ifEdit' :objectDetail="objectDetail" :diagrams="diagrams"
					
				></o-detail>
			</div>
		</div>
	</div>
</template>
<script>
	import { vm, operate } from "@/script/operate";
	import { oTypeCtrl } from "@/views/objectInstant/right/tabs/oTypeCtrl";
	import * as allotypemgr from "@/script/allOtype";
	import psde from "@/psde";
	export default {
		data() {
			return {
				currentCom: "propertyObject",
				oTypeCtrl: oTypeCtrl,
				osmData: {},
				headObjectName: "",
				headOtypeName: "",
				headUserName: "",
				ifEdit: false,
				objectDetail: {},
				viewContent: false,
				viewSearchValue: "",
				viewObjectShow: false,
				viewHistoryShow: false,
				viewExportShow: false,
			};
		},
		props: {
			hideRight: Boolean,
			diagrams: Array
		},
		components: {
			oDetail: () => import("./detail"),
			viewObject: () => import("./viewObject"),
			viewHistory: () => import("./viewHistory"),
			viewExport: () => import("./viewExport")
		},
		computed: {
			instantName() {
				if(this.osmData.orgData) {
					return(
						this.osmData.orgData.name ||
						this.osmData.orgData.id ||
						this.osmData.id
					);
				} else {
					return "OSM";
				}
			}
		},
		watch: {
			objectDetail(val) {
				if(val.id) {
					if(val.name) {
						this.headObjectName = val.name;
					} else {
						this.headObjectName = "Name is default";
					}
					if(val.otype && val.otype.id) {
						this.headOtypeName = val.otype.name;
					} else {
						this.headOtypeName = "Default";
					}
					if(val.version && val.version.user && val.version.user.userNickName) {
						this.headUserName = val.version.user.userNickName;
					} else {
						this.headUserName = "Default";
					}
				} else {
					this.headObjectName = "请选择对象";
				}
			},
			'$route' (val) {
				var str = val.path;
				var hre = str.substring(1 , str.length);
				if (hre == "edit") {
					this.viewContent = false;
				}
				/*if (hre == "view") {
					this.viewContent = true;
				}*/
			},
			viewSearchValue(val){
				if (val == "") {
					this.viewContent = false;
				} else {
					this.viewContent = true;
				}
			}
		},
		mounted() {
			this.listenEvent();
		},
		methods: {
			closeRight() {
				vm.$emit(operate.changeSlider, {
					hideRight: true
				});
			},
			chooseCom(data) {
				this.currentCom = data.name;
			},

			listenEvent() {
				if (this.viewSearchValue == "") {
					this.viewContent = false;
				} else {
					this.viewContent = true;
				}
				vm.$on(operate.leftContentChange, data => {
					this.viewContent = data.value;
					this.viewSearchValue = data.data;
					
					this.viewObjectShow = true;
					this.viewHistoryShow = false;
					this.viewExportShow = false;
					
				});
				vm.$on(operate.currentComp,data=>{
					this.chooseCom(data);
				})
				vm.$on(operate.viewHistoryEvent, (data) => {
					if (data == "viewHistory") {
						this.viewContent = true;
						this.viewObjectShow = false;
						this.viewHistoryShow = true;
						this.viewExportShow = false;
					}
					if (data == "viewExport") {
						this.viewContent = true;
						this.viewObjectShow = false;
						this.viewHistoryShow = false;
						this.viewExportShow = true;
					}
				});
				vm.$on(operate.instantOtype, data => {
					this.osmData = data;
				});
				vm.$on(operate.ifEdit, obj => {
					this.ifEdit = obj.status;
				});
				vm.$on('toRelation', () => {
					this.currentCom = 'relationOperate';
				})
				vm.$on(operate.generalEdit, obj => {
					this.ifEdit = obj.status;
				});
				vm.$on(operate.currentObject, obj => {
					vm.$emit(operate.changeSlider, {
						hideRight: false
					});
					if(obj == null) {
						this.currentCom = 'propertyList';
					} else if(obj !== null && !obj.id) {
						this.currentCom = 'propertyObject';
					}
					if(obj && obj.otype) {
						let otypeDetail = allotypemgr.getOtypeById(obj.otype.id);
						this.currentCom = 'objectContent';
						Object.assign(obj.otype, otypeDetail);
					}

					let typeData = new psde.SObject();

					let sobject = typeData.copyObject(obj);

					this.objectDetail = sobject;
					
					setTimeout(() => {
						vm.$emit('currentSobject',sobject);
					}, 100);
				});
			}
		}
	};
</script>
<style lang='less' scoped>
	@width: 0px;
	/*@width: 50px;*/
	@height: 50px;
	.header {
		height: @height;
		line-height: @height;
		padding: 0 8px;
		span {
			display: inline-block;
			width: 280px;
			font-size: 16px;
			overflow: hidden;
		    text-overflow: ellipsis;
		    white-space: nowrap;
		}
		i {
			float: right;
			color: #999;
			cursor: pointer;
		}
	}
	
	.root-rightcontent {
		position: relative;
		width: 100%;
		overflow: hidden;
		height: 100%;
		z-index: 30;
		background-color: #fff;
		border-left: 1px solid #f1f1f7;
	}
	
	.content-left {
		position: absolute;
		left: @width;
		right: 0;
		top: 0;
		bottom: 0;
		/*box-shadow: none;*/
	}
	
	.menu {
		position: absolute;
		left: 0;
		right: calc(~"100% -" @width);
		top: 0;
		bottom: 0;
		/*background-color: blue;*/
		/*border-right:1px solid #f1f1f7;*/
		border: 1px solid #e1e3e6;
	}
	
	.detail {
		position: absolute;
		left: 0;
		right: 0px;
		top: 50px;
		bottom: 0;
	}
	
	.close-right-icon{
		margin-top: 55px;
		margin-right: 10px;
		margin-left: 20px;
		span{
			font-size: 14px;
			color: #333;
		}
		i {
			font-size: 12px;
			float: right;
			color: #AAA;
			cursor: pointer;
		}
	}
	.view-search-detail{
		position: relative;
		width: 100%;
		height: calc(~"100% - 80px");
		margin-top: 2px;
		background: #FFFFFF;
	}
</style>
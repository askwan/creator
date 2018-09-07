<template>
	<div id="creator-box">
		<div class="nav_bar">
			<head-content></head-content>
		</div>

		<div class="root" :class="{'left-hide':hideLeft&&!hideRight,'default':!hideLeft&&!hideRight,'right-hide':hideRight&&!hideLeft,'hide-both':hideLeft&&hideRight}">
			
			<div class="mapbox-left" v-show="viewContentSearch">
				<el-input placeholder="请输入内容" v-model="viewInput">
				    <el-button slot="append" icon="el-icon-search" @click="searchViewObject"></el-button>
				</el-input>
			</div>
			
			<div class="class-box">
				<!-- 这个是开启第一个固定tab用  -->
				<!--<bk-tabs :activeTab="activeTab" @chooseOne="getCurrentTarget"></bk-tabs>-->
				<div class="middle">
					
					<router-view></router-view>
					
					<!--<middle-content v-show="ifEdit" :detail="detail" :dataId="activeTab" childName="地图编辑" childValue="main" :class="{zindex:true}"></middle-content>
				 	<object-data childName="数据对象" childValue="objectData" v-show="!ifEdit" :class="{zindex:true}"></object-data> -->
				 		
				 	<!--<object-data childName="数据对象" childValue="objectData" v-if="tabManage.getItemById('objectData').isShow&&!ifEdit" :class="{zindex:tabManage.getItemById('objectData').isTabActive()}"></object-data>--> 
				 	<!--<object-query childName="对象查询" childValue="objectQuery" v-if="tabManage.getItemById('objectQuery').isShow" :class="{zindex:tabManage.getItemById('objectQuery').isTabActive()}"></object-query>-->
					<!--<behavior-list childName="行为列表" childValue="behaviorList" v-if="tabManage.getItemById('behaviorList').isShow" :class="{zindex:tabManage.getItemById('behaviorList').isTabActive()}"></behavior-list>-->
					<!--<o-style-list childName="样式列表" childValue="styleList" v-if="tabManage.getItemById('styleList').isShow" :class="{zindex:tabManage.getItemById('styleList').isTabActive()}"></o-style-list>-->
					<!--<object-manager childName="对象管理" childValue="objectManager" v-if="tabManage.getItemById('objectManager').isShow" :class="{zindex:tabManage.getItemById('objectManager').isTabActive()}"></object-manager>-->
					<!--<model-manager childName="模型管理" childValue="modelManager" v-if="tabManage.getItemById('modelManager').isShow" :class="{zindex:tabManage.getItemById('modelManager').isTabActive()}"></model-manager>-->

				</div>
			</div>
			<div class="left" v-if="false">
				<left-content :diagrams="diagrams"></left-content>
			</div>
			<div class="right">
				<right-content :hideRight="hideRight" :diagrams="diagrams"></right-content>
			</div>

		</div>

		<el-dialog title="请选择对象之间的关系" :visible.sync="dialogFormVisible" class="relation-select" :show-close="false">
			<el-checkbox-group v-model="checkedList" :min="0" :max="10">
				<el-checkbox v-for="(otItem,index) in relationData" :label="otItem" :key="index">
					<div class="right-from-to" v-if="otItem.srcObject.id">
						<span>{{otItem.srcObject.name}}</span>
						<div>
							<div class="right-relation-pull">
								<div v-show="isMe()">
									<span v-if="otItem.relation.id">{{otItem.relation.name}}</span>
									<span v-else>default</span>
								</div>
								<span></span>
								<i class="iconfont icon-zuojiantou"></i>
							</div>
						</div>
						<span>{{otItem.tarObject.name}}</span>
					</div>
				</el-checkbox>
			</el-checkbox-group>
			<span slot="footer" class="dialog-footer">
		    <el-button @click="cancleRelation">取 消</el-button>
		    <el-button type="primary" @click="addRelation">确 定</el-button>
		  </span>
		</el-dialog>
		
		<form-model-upload ref="modelUploadRef"></form-model-upload>

	</div>

</template>

<script>
	import Vue from "vue";
	import common from "@/script/common";
	import { vm, operate } from "@/script/operate";
	import { allOtype } from "@/script/allOtype";
	import _dispatch from "@/script/dispatchEvent";
	import loadingPage from "@/components/loadingPage";
	import { tabManage } from "@/components/designer/tabmanage";
	import psde from "@/psde";
	import EditManage from "@/script/mapbox/EditManage";
	export default {
		data() {
			return {
				hideLeft: true,
				hideRight: false,
				pageDelay: 200,
				pageTimeout: 5000,
				activeTab: null,
				tabManage: tabManage,
				ifEdit: false,
				detail: {},
				diagrams: [],
				dialogFormVisible: false,
				relationData: [],
				checkedList: [],
				middleSelectVal: false,
				viewInput: "",
				viewContentSearch:false
			};
		},
		components: {
			formModelUpload: () =>
				import("../objectInstant/right/tabs/formModelUpload"),
			leftContent: () =>
				import("../objectInstant/left"),
			rightContent: () =>
				import("../objectInstant/right/rightContent"),
			headContent: () =>
				import("@/views/headContent/mainContent"),
			middleContent: () =>
				import("../objectInstant/middle/middleContent"),
			bkTabs: () => ({
				component: import("@/views/objectInstant/middle/bkTabs"),
				loading: loadingPage,
				delay: this.pageDelay,
				timeout: this.pageTimeout
			}),
			objectData: () => ({
				component: import("../objectInstant/middle/middleContent/objectData"),
				loading: loadingPage,
				delay: this.pageDelay,
				timeout: this.pageTimeout
			}), 
			objectQuery: () => ({
				component: import("../objectInstant/middle/middleContent/objectQuery"),
				loading: loadingPage,
				delay: this.pageDelay,
				timeout: this.pageTimeout
			}),
			behaviorList: () => ({
				component: import("../objectInstant/middle/middleContent/behaviorList"),
				loading: loadingPage,
				delay: this.pageDelay,
				timeout: this.pageTimeout
			}),
			oStyleList: () => ({
				component: import("../objectInstant/middle/middleContent/styleList.vue"),
				loading: loadingPage,
				delay: this.pageDelay,
				timeout: this.pageTimeout
			}),
			objectManager: () => ({
				component: import("../objectInstant/middle/middleContent/objectManager.vue"),
				loading: loadingPage,
				delay: this.pageDelay,
				timeout: this.pageTimeout
			}),
			modelManager: () => ({
				component: import("../objectInstant/middle/middleContent/modelManager.vue"),
				loading: loadingPage,
				delay: this.pageDelay,
				timeout: this.pageTimeout
			})
		},
		watch: {
			'$route' (val) {
				this.viewInput = "";
				var str = val.path;
				var hre = str.substring(1 , str.length);
				if (hre == "edit") {
					this.viewContentSearch = false;
				}
				if (hre == "view") {
					this.viewContentSearch = true;
				}
			}
		},
		mounted() {
			this.listenEvent();
			//isMe()判断当前业务是不是自己的
			Vue.prototype.isMe = () => {
				return true;
			};
			//isMyself(uid)在list中判断item是不是自己的
			Vue.prototype.isMyself = uid => {
				if(uid == common.getInfo("id")) {
					return true;
				} else {
					return false;
				}
			};
			this.requestDiagram();
		},
		methods: {
			addRelation() {
				this.dialogFormVisible = !this.dialogFormVisible;
				if(this.middleSelectVal){
					this.middleSelectVal = false;
					
					if(this.checkedList && this.checkedList.length > 0) {
						this.checkedList.forEach((data,dataIndex) => {
							var findIndex = -1;
							if(data.srcObject.network && data.srcObject.network.nodes && data.srcObject.network.nodes.length>0){
								/*findIndex = data.srcObject.network.nodes.findIndex(item => item.relatedObjectId == data.tarObject.uuid && item.edge.relation.id == data.relation.id );*/
								findIndex = data.srcObject.network.nodes.findIndex(item => item.relatedObjectId == data.tarObject.id && item.edge.relation.id == data.relation.id );
							}
							if(findIndex == -1) {
								EditManage.getGeometryEdit().createSObjectNetwork(data.srcObject, data.tarObject, data.relation);
							} else {
								this.$message({
									message: "已经添加过与--" + data.tarObject.name + "--对象的--" + data.relation.name + "--关系！",
									type: "warning",
									showClose: true
								});
							}
						})
					}
					
					console.log(this.checkedList , "地图上选中对象关系列表")
				}else if(this.checkedList && this.checkedList.length > 0) {
					vm.$emit(operate.addObjectRalation, {
						sign: "addRelation",
						value: false,
						data: this.checkedList
					});
				}
			},
			cancleRelation(){
				this.dialogFormVisible = !this.dialogFormVisible;
				this.middleSelectVal = false;
			},
			getCurrentTarget(id) {
				this.activeTab = id;
			},
			toggleLeft() {
				this.hideLeft = !this.hideLeft;
			},
			toggleRight() {
				this.hideRight = !this.hideRight;
			},
			listenEvent() {
				vm.$on(operate.changeSlider, data => {
					for(let key in data) {
						this[key] = data[key];
					}
				});
				vm.$on(operate.ifEdit, obj => {
					this.ifEdit = obj.status;

					if(this.ifEdit) {
						this.detail = obj.data;
					}
				});
				vm.$on(operate.modelUploadEvent , data => {
					if(data.sign == "upload"){
						this.$refs.modelUploadRef.centerDialogVisible = data.value;
					}
				})
				vm.$on(operate.addObjectRalation, (obj) => {
					this.relationData = [];
					//右边拖动添加关系
					if(obj.sign == "relationList") {
						this.dialogFormVisible = obj.value;
						var str = JSON.stringify(obj.relationList);
						var list = JSON.parse(str);
						var strSrcObject = JSON.stringify(obj.srcObject);
						var srcObject = JSON.parse(strSrcObject);
						var strTarObject = JSON.stringify(obj.tarObject);
						var tarObject = JSON.parse(strTarObject);
						this.relationData = obj.relationList;
						this.relationData.forEach((item, index) => {
							item.relation = list[index];
							item.srcObject = srcObject;
							item.tarObject = tarObject;
						})
					}
					//中间选中添加关系
					if(obj.sign == "moreRelationList"){
						this.middleSelectVal = true;
						this.dialogFormVisible = obj.value;
						var sobjectlist = obj.data;
						for (let i = 0;i < sobjectlist.length;i++) {
					    let sobject = sobjectlist[i];
					    let connectors = sobject.otype.connectors.connectors;
						    for (let j = 0;j < connectors.length;j++) {
					        let connector = connectors[j];
					        let dtype = connector.dType;
						        if(connector.id && connector.relation && connector.relation.id){
						        	var find = sobjectlist.find(item => item.otype.id==dtype.id);
						        	if(find){
						        		this.relationData.push({
						        			relation: connector.relation,
						        			srcObject: sobject,
											tarObject: find
						        		});
						        	}
						        }
					      	}
				    	}
					}
					this.checkedList = this.relationData;
				});
			},
			requestDiagram() {
				new psde.Diagram()
					.query({
						loadField: true,
						loadModel: true,
						loadForm: true,
						loadParentField: true,
						loadParents: true,
						loadConnector: true
					})
					.then(res => {
						this.diagrams = res.list;
						allOtype.orginData(res.list);
					});
			},
			searchViewObject(){
				if (this.viewInput) {
					vm.$emit(operate.changeSlider,{hideLeft:true,hideRight:false});
					vm.$emit(operate.leftContentChange,{value: true, data:this.viewInput});
				}
			}
		}
	};
</script>

<style lang="less" scoped>
	@left: 300px;
	@right: 300px;
	/*@right: 350px;*/
	@transition: all 0.1s linear;
	#creator-box {
		position: relative;
		width: 100%;
		height: 100%;
		.nav_bar {
			width: 100%;
			height: 53px;
			position: relative;
		}
	}
	
	.root(@left: 0px, @right: 0px) {
		position: relative;
		width: 100%;
		height: calc(~"100% - 53px");
		z-index: 35;
		.left {
			width: @left;
			height: 100%;
			float: left;
			position: relative;
			transition: @transition;
			background-color: #fff;
			border-top: 1px solid #f1f1f1;
		}
		.class-box {
			/*
			* 如果加上tab页，则需要减40px
			* height: calc(~'100% - 40px');*/
			height: 100%;
			width: calc(~"100% - " @left + @right);
			transition: @transition;
			position: absolute;
			/*left: @left;*/
			left:@right;
			.middle {
				height: 100%;
				width: 100%;
				float: left;
				position: relative;
				z-index: 500;
				/*margin-left: @right;*/
			}
		}
		.right {
			position: relative;
			z-index: 499;
			width: @right;
			height: 100%;
			float: left;
			background-color: #fff;
			transition: @transition;
			border-top: 1px solid #f1f1f1;
			border-right: 1px solid #e1e3e6;
		}
	}
	
	.default {
		.root(@left, @right);
	}
	
	.left-hide {
		.root(0px, @right);
	}
	
	.right-hide {
		.root(@left, 50px);
	}
	
	.hide-both {
		/*.root(0px, 50px);*/
		.root(0px, 0px);
	}
	/*::-webkit-scrollbar-thumb{
    background-clip:none !important;
  }*/
	
	.zindex {
		z-index: 115;
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
	}
	
	.relation-select {
		.el-dialog__body{
			height: 400px;
		    overflow-y: auto;
		    overflow-x: hidden;
		}
		.right-from-to {
			display: inline-block;
			vertical-align: top;
			>span {
				color: #666666;
				font-size: 14px;
				max-width: 76px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				display: inline-block;
				user-select: none;
			}
			>span:hover {
				color: #409eff;
			}
			div {
				display: inline-block;
				vertical-align: top;
				.right-relation-pull {
					position: relative;
					float: left;
					div {
						display: inline-block;
						position: absolute;
						left: 50%;
						top: -6px;
						transform: translateX(-55%);
						max-width: 60px;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					>span {
						display: inline-block;
						width: 86px;
						height: 1px;
						margin-right: 7px;
						background: #999999;
					}
					>i {
						font-size: 8px;
						color: #999999;
						position: absolute;
						top: 5px;
						right: 0px;
					}
				}
			}
		}
		
	}
	
	.mapbox-left{
		position: absolute;
		left: 0;
		top: 0;
		width: 300px;
		height: 50px;
		z-index: 1000;
		background: #EEE;
		.el-input{
			width: 250px;
			margin: 10px 25px;
		}
	}
	
</style>
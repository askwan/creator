<template>
	<div class="relation-info" v-show="objectDetail.id">
		<el-collapse v-model="activeNames" @change="handleChange(activeNames)" accordion>
			<el-collapse-item :title="item.name" :name="index" v-for="(item,index) in objtypeLists" :key="index">
				<template slot="title">
					<span v-if="item.type == 0">父对象</span>
					<span v-if="item.type == null">default</span>
				</template>
				<el-form>
					<el-form-item>
						<span @click="turnParent(it,ix)" v-for="(it,ix) in objectParents" :key="ix">
							<el-tag 
								size="small"
								:closable="true" 
								type="gray"
								:close-transition="true" 
								@close="closeClassTag(it,ix)"
							>{{it.name|compairString}}</el-tag>
						</span>
						<div v-if="isMe() && ifEdit" class="drag-area" @click="openTab('objectQuery')" v-drop="dropObject">
							<p> + 选择父对象</p>
							<!--<span>将对象拖拽至此区域添加父对象</span>-->
						</div>
					</el-form-item>
				</el-form>
			</el-collapse-item>

			<div v-if="isMe() && ifEdit" class="drag-area drag-area-relation" @click="openRelationList" v-drop="dropObjectRelation">
				<p> + 选择关系对象</p>
				<!--<span>将对象拖拽至此区域添加关系对象</span>-->
			</div>
			<div class="more-object-relation">
				<span @click="moreRelation">选择多个对象添加关系</span>
			</div>
			<el-collapse-item :name="index+1" v-for="(otItem,index) in filterAction(relationList)" :key="index+1">
				<template slot="title">
					<div class="right-from-to" v-if="objectDetail.id">
						<span :title="objectDetail.name">{{objectDetail.name}}</span>
						<div>
							<div class="right-relation-pull">
								<div v-show="isMe()">
									<span v-if="otItem.id && otItem.edge && otItem.edge.relation && otItem.edge.relation.id">
										{{otItem.edge.relation.name}}
									</span>
									<span v-else>default</span>
								</div>
								<span></span>
								<i class="iconfont icon-zuojiantou"></i>
							</div>
						</div>
						<span :title="otItem.label">{{otItem.label}}</span>
					</div>
					<div class="right-from-to" v-else>
						<span>default</span>
					</div>
					<div class="right-objtype-i" v-show="isMe() && ifEdit">
						<i class="iconfont icon-shanchu" title="删除" @click.stop="deleteRelation(otItem,index)"></i>
					</div>
				</template>
				<el-form v-if="otItem.id && otItem.edge && otItem.edge.relation && otItem.edge.relation.fields && otItem.edge.relation.fields.fields.length>0">
					<el-form-item v-for="(it,ix) in otItem.edge.relation.fields.fields" :key="ix" :label="getKeysName(it.name, otItem) + ' :'" :title="getKeysName(it.name, otItem)" :label-width="classNameWidth">
						<el-input v-model="it.nameValue" placeholder="请输入内容" @blur="modifyRelationFn(it, otItem)"></el-input>
					</el-form-item>
				</el-form>
			</el-collapse-item>

		</el-collapse>
	</div>
</template>
<script>
	import psde from "@/psde";
	import ImageManage from "@/psde/ImageManage";
	import objectService from "@/request/object.service.js";
	import * as allotypemgr from "@/script/allOtype";
	import { vm, operate } from "@/script/operate";
	import { tabManage } from "@/components/designer/tabmanage";
	import { oTypeCtrl } from "@/views/objectInstant/right/tabs/oTypeCtrl";
	import EditManage from "@/script/mapbox/EditManage";
	
	export default {
		data() {
			return {
				oTypeCtrl: oTypeCtrl,
				objtypeLists: [{
					type: 0,
					name: "父对象"
				}], //添加形态列表
				activeNames: 0, //当前点击的第几个列表
				curCollapse: null, //记录当前点击的形态
				classNameWidth: "75px",

				//父对象
				objectParents: [],

				//关系对象
				otypeDetail: {}, //object的otype详情
				dtypeDetail: {}, //object的relation的dtype的详情
				relationList: [], //object的relation列表
				dObjectContent: {}, //目标对象详情
				relationData: [] //两个对象之间的关系列表
				
			};
		},
		props: ["ifEdit", "objectDetail"],
		components: {},
		computed: {},
		filters: {
			compairString(str) {
				if(str && str.length > 10) {
					return str.slice(0, 9) + "...";
				}
				if(str && str.length < 15) {
					return str;
				}
				return "default";
			}
		},
		watch: {
			objectDetail(val) {
				if(val.id){
					this.getData();
				}
			}
		},
		mounted() {
			this.getData();
			vm.$on(operate.addObjectRalation, obj => {
				if(obj.sign == "addRelation") {
					this.addRelationData(obj.data);
				}
			});
		},
		methods: {
			openRelationList(){
				var list = [];
				vm.$emit(operate.currentComp,{name:'relationList'});
				return
				if(this.otypeDetail.connectors && this.otypeDetail.connectors.connectors && this.otypeDetail.connectors.connectors.length > 0) {
					this.otypeDetail.connectors.connectors.forEach((item, index) => {
						if(item.relation && item.relation.id) {
							if(list.length > 0) {
								var findIndex = list.findIndex(it => it.id == item.relation.id);
								if(findIndex == -1) {
									list.push(item.relation);
								}
							} else {
								list.push(item.relation);
							}
						}
					})
				}
				if (list.length>0) {
					this.$emit("objectContentEvent", {id: "relation", value: true, data: null});
				} else{
					this.$message({
						message: "请前去Designer页面为--"+this.otypeDetail.name+"--添加具体的关联关系类型！",
						type: "warning",
						showClose: true
					});
				}
			},
			moreRelation(){
				var arr = [];
				arr = EditManage.getGeometryEdit().selectSobjects();
				for (var i=0; i<arr.length; i++) {
					var findIndex = arr.findIndex(item => item==null || item=="");
					if (findIndex > -1) {
						arr.splice(findIndex , 1);
					}
				}
				var find = arr.findIndex(item => item==null || item=="");
				if (arr.length>1 && find==-1) {
					vm.$emit(operate.addObjectRalation, {
				      sign: 'moreRelationList',
				      value: true,
				      data: arr
				    })
				}
			},
			getKeysName(keys, otItem){
				var name = keys;
				otItem.edge.relation.fields.fields.forEach((item,index) => {
					if (item.name == keys) {
						name = item.caption;
					}
				})
				return name;
			},
			modifyRelationFn(it, otItem){
				if (otItem.edge.relation.fields.fields && otItem.edge.relation.fields.fields.length>0) {
					otItem.edge.relation.fields.fields.forEach((item,index) => {
						if (item.nameValue) {
							otItem.properties[item.name] = item.nameValue;
						}
					})
				}
				EditManage.getGeometryEdit().modifySObjectNetwork(this.objectDetail, otItem);
			},
			filterAction(data){
				if(this.objectDetail.actions && this.objectDetail.actions.length>0){
					this.objectDetail.actions.forEach((item,index) => {
						if (item.operation == 258) {
							var findIndex = this.relationList.findIndex(it => it.id==item.id);
							if (findIndex > -1) {
								this.relationList = this.relationList.filter(node => node.id!=item.id);
							}
						}
					})
				}
				return this.relationList;
			},
			getData(){
				var val = this.objectDetail;
				if(val.parents && val.parents.length > 0) {
					this.objectParentsFn(val.parents);
				} else {
					this.objectParents = [];
				}
				if(val.network && val.network.nodes && val.network.nodes.length > 0) {
					this.addRelationList(val.network.nodes);
				} else {
					this.relationList = [];
				}
				this.addRelationOtype(val);
			},
			/*
			 * 拖拽父对象
			 */
			dropObject(obj) {
				if(!this.ifEdit) return;
				if(obj.data.id == "object") {
					var value = this.objectParents.findIndex(
						item => item.id == obj.data.data.id
					);
					if(value == -1) {
						this.objectParents.push(obj.data.data);

						this.objectDetail.addParent({
							id: obj.data.data.id
						});
						console.log(this.objectDetail,'detail')
						EditManage.getGeometryEdit().modifySobject(this.objectDetail);
					} else {
						this.$message({
							message: obj.data.data.name + "--已经选过了！",
							type: "warning",
							showClose: true
						});
					}
				} else {
					this.$message({
						message: "请选择对象或者时空域进行拖动！",
						type: "warning",
						showClose: true
					});
				}
			},
			addRelationData(list) {
				/*var addObj = {
					id: this.dObjectContent.id,
					label: this.dObjectContent.name,
					//relatedObjectId: this.dObjectContent.uuid,
					relatedObjectId: this.dObjectContent.id,
					oType: {
						id: this.dtypeDetail.id,
						name: this.dtypeDetail.name
					},
					edge: {
						relation: {
							id: data.id,
							name: data.name
						}
					}
				};*/
				if(this.relationList && this.relationList.length > 0) {
					list.forEach((data,dataIndex) => {
//						var findIndex = this.relationList.findIndex(item => item.relatedObjectId == data.tarObject.uuid && item.edge.relation.id == data.relation.id );
						var findIndex = this.relationList.findIndex(item => item.relatedObjectId == data.tarObject.id && item.edge.relation.id == data.relation.id );
						if(findIndex == -1) {
							//this.relationList.push(addObj);
							EditManage.getGeometryEdit().createSObjectNetwork(this.objectDetail, data.tarObject, data.relation);
						} else {
							this.$message({
								message: "已经添加过与--" + data.tarObject.name + "--对象的--" + data.relation.name + "--关系！",
								type: "warning",
								showClose: true
							});
						}
					})
				} else {
					list.forEach((data,dataIndex) => {
						EditManage.getGeometryEdit().createSObjectNetwork(this.objectDetail, data.tarObject, data.relation);
					})
					//this.relationList.push(addObj);
					//EditManage.getGeometryEdit().createSObjectNetwork(this.objectDetail, this.dObjectContent, data);
				}
			},
			//关系对象
			addRelationList(data) {
				this.relationList = [];
				data.forEach((item, index) => {
					var str = JSON.stringify(item.edge.relation);
					var strObj = JSON.parse(str);
					var obj = {
						id: item.id,
						label: item.label,
						relatedObjectId: item.relatedObjectId,
						properties: item.properties,
						edge: {
							relation: strObj
						}
					};
					this.relationList.push(obj);
				});
				this.relationList.forEach((otItem,index) => {
					if (otItem.id && otItem.edge && otItem.edge.relation && otItem.edge.relation.fields && otItem.edge.relation.fields.fields.length>0) {
						if (JSON.stringify(otItem.properties) == "{}" || !otItem.properties) {
							otItem.properties = {};
							otItem.edge.relation.fields.fields.forEach(item => {
								var name = item.name.toString();
								otItem.properties[name] = "";
							})
						} else{
							otItem.edge.relation.fields.fields.forEach(item => {
								var name = item.name.toString();
								if (item.nameValue) {
									otItem.properties[name] = item.nameValue;
								} else{
									if (otItem.properties[name]) {
										otItem.properties[name] = otItem.properties[name];
										item.nameValue = otItem.properties[name];
									} else{
										otItem.properties[name] = "";
										item.nameValue = "";
									}
								}
							})
						}
					}
				})
			},
			dropObjectRelation(obj) {
				if(!this.ifEdit) return
				if(obj.data.id == "object") {
					//判断当前对象是否已经添加过了
					//var value = this.relationList.findIndex(item => item.id == obj.data.data.id);
					if(this.objectDetail.id != obj.data.data.id) {
						if(
							this.otypeDetail &&
							this.otypeDetail.connectors &&
							this.otypeDetail.connectors.connectors.length > 0
						) {
							//this.dtypeDetail是拖动的对象的otype详情
							this.dObjectContent = obj.data.data;
							this.dtypeDetail = allotypemgr.getOtypeById(obj.data.data.otype.id);
							//connectorData是两个otype的关联关系的列表
							var connectorData = [];
							this.otypeDetail.connectors.connectors.forEach((item, index) => {
								if(
									item.type == 32 &&
									this.dtypeDetail &&
									item.dType.id == this.dtypeDetail.id
								) {
									connectorData.push(item);
								}
							});
							if(connectorData.length > 0) {
								//relationData是两个otype的关联关系其中添加的关系的列表
								this.relationData = [];
								connectorData.forEach((item, index) => {
									if(item.relation && item.relation.id) {
										this.relationData.push(item.relation);
									}
								});
								if(this.relationData.length > 0) {
									if(this.relationData.length == 1) {
										var arr = [];
										arr.push({relation: this.relationData[0],srcObject: this.objectDetail,tarObject: this.dObjectContent})
										this.addRelationData(arr);
									} else {
										//this.addRelationData(this.relationData[0]);
										vm.$emit(operate.addObjectRalation, {
											sign: "relationList",
											value: true,
											relationList: this.relationData,
											srcObject: this.objectDetail,
											tarObject: this.dObjectContent
										});
									}
									/*console.log(this.dtypeDetail, this.otypeDetail);
									console.log(connectorData, "connectorData");
									console.log(this.relationData, "this.relationData");
									console.log(obj, this.relationList, "添加关系对象");*/
								} else {
									this.$message({
										message: "请前去Designer页面为两个otype的关联关系添加具体的关系！",
										type: "warning",
										showClose: true
									});
								}
							} else {
								this.$message({
									message: "请前去Designer页面为这两个对象的otype添加关联关系！",
									type: "warning",
									showClose: true
								});
							}
						} else {
							this.$message({
								message: "请前去Designer页面连接这两个对象的otype的关系！",
								type: "warning",
								showClose: true
							});
						}
					} else {
						this.$message({
							message: "不能添加当前本身对象！",
							type: "warning",
							showClose: true
						});
					}
				} else {
					this.$message({
						message: "请选择对象进行拖动！",
						type: "warning",
						showClose: true
					});
				}
			},
			addRelationOtype(val) {
				if(val.otype && val.otype.id) {
					//根据对象otypeid，获取对象关系列表
					this.otypeDetail = allotypemgr.getOtypeById(val.otype.id);
				}
			},

			//父对象
			turnParent(it, ix) {
				//oTypeCtrl.getOTypeDetail(it);
			},
			objectParentsFn(parents) {
				var arr = [];
				parents.forEach((item, index) => {
					arr.push(item.id);
				});
				var str = arr.join(",");
				//this.objectParents = [];
				var obj = {
					ids: str,
					loadAttr: true,
					loadForm: true,
					loadObjType: true,
					orderType: "ID",
					descOrAsc: true
				};
				objectService.queryObject(obj).then(response => {
					this.objectParents = response.list;
				});
			},
			handleChange(activeNames) {
				this.curCollapse = activeNames;
			},
			deleteRelation(otItem, index) {
				if (this.objectDetail.network.nodes && this.objectDetail.network.nodes.length>0) {
					var findIndex = this.objectDetail.actions.findIndex(it => it.operation==257 && it.id==otItem.id);
					if (findIndex > -1) {
						this.objectDetail.network.nodes.splice(index, 1);
						EditManage.getGeometryEdit().deleteSObjectNetwork(this.objectDetail, otItem);
					} else{
						EditManage.getGeometryEdit().deleteSObjectNetwork(this.objectDetail, otItem);
					}
					
					var addIndex = this.objectDetail.actions.findIndex(it => it.operation==33);
					if (addIndex > -1) {
						this.objectDetail.network.nodes.splice(index, 1);
					}
					
				}
			},
			saveOT() {
				/*判断父对象是否修改了， 没有修改的话就不请求了
				if(this.objectParents && this.objectParents.length > 0) {
					var changeParent = false;
					if(oTypeCtrl.oTypeContent.parents.length == this.objectParents.length) {
						this.objectParents.forEach((item, index) => {
							var findIndex = oTypeCtrl.oTypeContent.parents.findIndex(it => it.id == item.id);
							if(findIndex == -1) {
								changeParent = true;
							}
						})
					} else {
						changeParent = true;
					}
					if(changeParent) {
						oTypeCtrl.updateObjectParents(this.objectParents, res => {});
					}
				}
				if(this.objectParents.length == 0 && oTypeCtrl.oTypeContent.parents.length != 0) {
					oTypeCtrl.updateObjectParents(this.objectParents, res => {});
				}*/
			},
			closeClassTag(it,ix) {
				this.objectDetail.deleteParent({
					id: it.id
				});
				EditManage.getGeometryEdit().modifySobject(this.objectDetail);
				this.objectParents.splice(ix, 1);
			},
			openTab(tab) {
				// this.$emit("objectContentEvent", {id: "parent", value: true, data: null});
				vm.$emit(operate.currentComp,{name:'relationParentObject'})
			}
		}
	};
</script>
<style lang='less' scoped>
	.relation-info {
		/*position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;*/
		width: 100%;
		height: 100%;
		background-color: #f5f7fa;
		.el-tag {
			cursor: pointer;
		}
		.drag-area {
			display: block;
			width: 260px;
			height: 70px;
			background-color: #f5f7fa;
			border: 2px dashed #e1e3e6;
			border-radius: 4px;
			position: relative;
			padding: 5px 0;
			margin-top: 0px;
			margin-left: 3%;
			cursor: pointer;
			p {
				color: #4588e6;
				line-height: 50px;
				font-size: 14px;
				text-align: center;
			}
			span {
				position: absolute;
				color: #999;
				font-size: 12px;
				bottom: 0;
				left: 50px;
			}
		}
		.drag-area-relation {
			margin-top: 10px;
			background-color: #ffffff;
			span {
				bottom: 15px;
			}
		}
		.more-object-relation{
			display: block;
			width: 295px;
			height: 40px;
			span{
				float: right;
				display: inline-block;
				width: 150px;
				height: 30px;
				margin-right: 30px;
				margin-top: 5px;
				line-height: 30px;
				text-align: center;
				cursor: pointer;
				color: #409eff;
				background: #ecf5ff;
			    border: 1px solid #b3d8ff;
			    border-radius: 5px;
			    overflow: hidden;
			    font-size: 12px;
			}
			span:hover{
				color: #fff;
				background: #409eff;
			    border: 1px solid #409eff;
			}
		}
		.right-objtype-i {
			float: right;
			/*margin-right: 20px;*/
			color: #ff0000;
		}
		.right-from-to {
			display: inline-block;
			vertical-align: top;
			>span {
				max-width: 60px;
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
						width: 80px;
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
</style>
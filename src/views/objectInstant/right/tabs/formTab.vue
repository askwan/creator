<template>
	<div class="objtype-info" v-show="objectDetail.id">
		<div class="objtype-detail">
			<div class="object-form-type">
				<span v-for="it in formTypeList" :title="it.label" :key="it.value" @click.prevent.stop="placeTypeChange(it.value)">
					<i class="iconfont icon-jia1"></i>
					{{it.label}}
				</span>
			</div>
			<el-collapse v-model="activeNames" @change="handleChange(activeNames)" accordion :class="{'right-collapse-top':!isMe()}">
				<el-collapse-item v-for="(item,index) in formateList" :title="item.name" :name="index" :key="index">
					<template slot="title">
						<span v-for="(it,index) in fromlistName" :key="index" v-if="item.type == it.value">{{it.label}}</span>
						<div class="right-objtype-i" v-show="isMe() && ifEdit">
							<i class="iconfont icon-shanchu11" title="删除" @click.stop="deleteOT(item,index)" v-if="item.sign!='otype'"></i>
						</div>
					</template>
					<el-form>

						<el-form-item v-show="item.type!==50 && item.type!==40" label="样式内容 :" :label-width="classNameWidth">
							<!--<el-tag size="small" :closable="true" type="gray" @close="closeBehaviorTag(tag,indexTag,item)" v-if="item.style && item.style.length>0 && isMe()" v-for="(tag,indexTag) in toArr(item.style)" :key="indexTag">{{tag.name|compairString}}</el-tag>
							<div v-if="!item.style || item.style.length==0" class="drag-area" @click="openTab(item)" v-drop="dropBehavior">
								<p> + 选择</p>
								<span>拖拽至此区域</span>
							</div>-->
							<el-select 
								v-if="item.type!==50 && item.type!==40"
								class="select-style"
								v-model="item.style" 
								@change="checkboxValue(item,index)"
								multiple 
								filterable 
								collapse-tags 
								placeholder="请选择">
							    <el-option
							     	v-for="it in filterStyleList(styleList, item)"
							    	:key="it.id"
							    	:label="it.name"
							    	:value="it.id">
							    	<span style="float: left">{{ it.name }}</span>
									<span style="float: right; color: #8492a6; font-size: 12px;margin-right: 20px;">{{ getServerName(it) }}</span>
									<span v-if="it.style==5" style="float: right; color: #8492a6; font-size: 12px;margin: 0 20px;">{{ getServerTypeName(it) }}</span>
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item v-show="item.type===50" label="模型内容 :" :label-width="classNameWidth">
							<el-select 
								v-if="item.type===50"
								class="change-select-style"
								v-model="item.formref.refid" 
								@change="checkboxValue(item,index)"
								filterable 
								collapse-tags 
								placeholder="请选择">
							    <el-option
							     	v-for="it in ModelList"
							    	:key="it.fid"
							    	:label="it.name"
							    	:value="it.fid">
							    	<span style="float: left">{{ it.name }}</span>
									<span style="float: right; color: #999999; font-size: 14px">
										<!--<i class="el-icon-delete" @click="modelDeleteFn(it,n)"></i>-->
										<a :href="modelDownloadFn(downloadFile.baseURL,it.fid)" style="margin-left: 5px;color: #999999;">
											<i class="el-icon-download"></i>
										</a>
									</span>
								</el-option>
							</el-select>
							<el-tooltip effect="dark" content="上传新模型" placement="bottom">
						    	<el-button type="primary" size="mini" icon="el-icon-upload" circle @click="modelUploadFn"></el-button>
						    </el-tooltip>
						</el-form-item>
						<el-form-item label="维度 :" :label-width="classNameWidth">
							<el-select v-model="item.dim" placeholder="请选择维度" :disabled="true" @change="modifyFormFn(item,index)">
								<el-option v-for="(da, ix) in dimension" :key="ix" :label="da.name" :value="da.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="位置 :" :label-width="classNameWidth">
							<!--<input type="text" v-model="item.geomref" class="objtype-input" :class="{'objtype-input-case':!item.geom}" :readonly="!ifEdit" @blur="modifyFormFn(item,index)" />-->
							
							<!--<input type="text" :value="getPositionName(item.geotype)" class="objtype-input" :class="{'objtype-input-case':!item.geom}" readonly="true" @blur="modifyFormFn(item,index)" />-->
							
							<el-select v-model="item.geomref" placeholder="选择引用位置" @change="modifyFormFn(item,index)" :class="{'objtype-input-case':!item.geom}">
								<el-option v-for="(da, ix) in positionRefList(item,index)" :key="ix" :label="da.geomref" :value="da.geomref">
								</el-option>
							</el-select>
							
							<el-tooltip effect="dark" content="编辑位置" placement="bottom">
						    	<el-button type="primary" size="mini" icon="el-icon-edit" circle v-if="!item.geom" @click="setTool(item)"></el-button>
						    </el-tooltip>
						</el-form-item>
						<el-form-item label="最小可见 :" :label-width="classNameWidth">
							<input :readonly="!ifEdit" type="number" placeholder="请输入最小可见" autocomplete="off" @blur="modifyFormFn(item,index)" v-model="item.minGrain" class="objtype-input" />
						</el-form-item>
						<el-form-item label="最大可见 :" :label-width="classNameWidth">
							<input :readonly="!ifEdit" type="number" placeholder="请输入最大可见" autocomplete="off" @blur="modifyFormFn(item,index)" v-model="item.maxGrain" class="objtype-input" />
						</el-form-item>
						
						<el-form-item label="缩放比例 :" :label-width="classNameWidth" v-if="item.type===50 || item.type===40">
							<input :readonly="!ifEdit" type="number" placeholder="缩放比例" autocomplete="off" @blur="modifyFormFn(item,index)" v-model="item.style[0].scale" class="objtype-input" />
						</el-form-item>
						
						<el-form-item label="最小像素值:" :label-width="classNameWidth" v-if="item.type===50 || item.type===40">
							<input :readonly="!ifEdit" type="number" placeholder="最小像素值" autocomplete="off" @blur="modifyFormFn(item,index)" v-model="item.style[0].smallPX" class="objtype-input" />
						</el-form-item>
						
						<el-form-item label="旋转(角度) :" :label-width="classNameWidth" v-if="item.type===50 || item.type===40">
							<input :readonly="!ifEdit" type="number" placeholder="X轴旋转" autocomplete="off" @blur="modifyFormFn(item,index)" v-model="item.style[0].x" class="objtype-rotate-input" />
							<input :readonly="!ifEdit" type="number" placeholder="Y轴旋转" autocomplete="off" @blur="modifyFormFn(item,index)" v-model="item.style[0].y" class="objtype-rotate-input" />
							<input :readonly="!ifEdit" type="number" placeholder="Z轴旋转" autocomplete="off" @blur="modifyFormFn(item,index)" v-model="item.style[0].z" class="objtype-rotate-input" />
						</el-form-item>
						
						<!--<el-form-item label="矩阵 :" :label-width="classNameWidth" v-if="item.type==50">
							<input :readonly="!ifEdit" type="text" placeholder="4*4矩阵字符串([开头]结尾,英文逗号分隔)" autocomplete="off" @blur="modifyFormFn(item,index)" v-model="item.style[0].matrix" class="objtype-input" />
						</el-form-item>-->

					</el-form>
				</el-collapse-item>
			</el-collapse>
		</div>
	</div>
</template>

<script>
	import psde from "@/psde";
	import ImageManage from "@/psde/ImageManage";
	import { vm, operate } from "@/script/operate";
	import * as allotypemgr from "@/script/allOtype";
	import { tabManage } from "@/components/designer/tabmanage";
	import { oTypeCtrl, dimension, styleServerType, formstyleType } from "@/views/objectInstant/right/tabs/oTypeCtrl";

	import axios from "axios";
	import { queryModelFile, downloadFile } from "@/psde/config";

	import * as formCtrl from "./formCtrl";

	import {operationDelete} from '@/iD-2.7.1/modules/operations/delete'

	//import EditManage from "@/script/mapbox/EditManage";
	import IdEdit from "@/script/id_edit/IdEdit";
	export default {
		data() {
			return {
				downloadFile: downloadFile,
				oTypeCtrl: oTypeCtrl,
				dimension: dimension, //维度列表
				styleServerType: styleServerType,//服务类型列表
				formstyleType: formstyleType, //样式类型列表
				formTypeList: [], //形态列表
				selectPlaceType: [],
				lableProps: {
					value: "value",
					label: "name"
				},
				otypeDetail: {}, //object的otype详情
				cloneObjectContent: [], //object原始的内容
				ImageManage: ImageManage,
				otype: new psde.OType(),
				curCollapse: null, //记录当前点击的形态
				deleteObjectList: [],
				objtypeLists: [], //添加形态列表
				activeNames: "", //当前点击的第几个列表
				classNameWidth: "75px",
				fromlistName: [],
				ModelList: [], //模型列表
				formStyle: new psde.FormStyle(),
				styleList: [],
				currentFormId: null,//当前点击形态的id
				getDict: new psde.GetDict(),
				formList: [],
			};
		},
		props: ["ifEdit", "objectDetail"],
		components: {
			
		},
		activated() {
			this.getData();
		},
		watch: {
			objectDetail(val) {
				if(val.id) {
					this.formTypeList = [];
					this.getData();
				}
			}
		},
		computed: {
			formateList() {
				return this.objtypeLists.map(el => {
					if(el.type===50 || el.type===40) {
						if (el.style == "") {
							el.style = [];
							el.style[0] = {
								scale: "",
								smallPX: "",
								x: "",
								y: "",
								z: ""
							};
						}
					} else {
						if (el.style == "") {
							el.style = [];
						}
					}
					if(typeof el.style == "string" && el.style != "") {
						el.style = JSON.parse(el.style);
					}
					return el;
				});
			}
		},
		filters: {
			compairString(str) {
				if(str && str.length > 10) {
					return str.slice(0, 9) + "...";
				}
				if(!str) {
					return "default";
				}
				return str;
			}
		},
		mounted() {
			this.requestList();
		},
		methods: {
			positionRefList(item,index){
				var addPosition = {
					geomref: "重新编辑位置",
					type: 100,
					geom: ""
				}
				var strStyleList = JSON.stringify(this.formateList);
				var list = JSON.parse(strStyleList);
				//被引用过的位置才能重新编辑，没引用过的位置只能修改
				var ix = 1;
				list.forEach(el => {
					if (el.geomref == item.geomref) {
						ix++;
					}
				})
				if (ix > 2) {
					list.push(addPosition);
				}
				var copyStyleList = [];
				list.forEach(obj => {
					var i = copyStyleList.findIndex((el=>el.geomref==obj.geomref));
					if(i==-1) copyStyleList.push(obj);
				})
				if (item.type == 11 || item.type == 21 || item.type == 40 || item.type == 50 || item.type == 61) {
					return copyStyleList.filter(obj => {
						return( (obj.type == 11 || obj.type == 21 || obj.type == 40 || obj.type == 50 || obj.type == 61 || obj.type == 100) && obj.geomref!=0 );
					})
				}
				if (item.type == 13 || item.type == 23 || item.type == 31 || item.type == 32 || item.type == 33) {
					return copyStyleList.filter(obj => {
						return( (obj.type == 13 || obj.type == 23 || obj.type == 31 || obj.type == 32 || obj.type == 33 || obj.type == 100)  && obj.geomref!=0 );
					})
				}
				if (item.type == 12 || item.type == 22) {
					return copyStyleList.filter(obj => {
						return( (obj.type == 12 || obj.type == 22 || obj.type == 100)  && obj.geomref!=0 );
					})
				}
				return copyStyleList;
			},
			getPositionName(geotype){
				if (geotype == 21) {
					return "Point";
				}
				if (geotype == 22) {
					return "Linestring";
				}
				if (geotype == 23) {
					return "Polygon";
				}
				return "请选择位置";
			},
			modelUploadFn(){
				vm.$emit(operate.modelUploadEvent , {value: true , sign: "upload"});
			},
			modelDownloadFn(a, b) {
		    	return a + "/" + b;
		    },
			modelDeleteFn(it,n){

			},
			filterStyleList(styleList, item){
				var strStyleList = JSON.stringify(styleList);
				var copyStyleList = JSON.parse(strStyleList);
				if (item.type == 11 || item.type == 21 || item.type == 40 || item.type == 50 || item.type == 61) {
					return copyStyleList.filter(obj => {
						return( obj.type == 11 || obj.type == 21 || obj.type == 40 || obj.type == 50 || obj.type == 61 && obj.geom != "" );
					})
				}
				if (item.type == 13 || item.type == 23 || item.type == 31 || item.type == 32 || item.type == 33) {
					return copyStyleList.filter(obj => {
						return( obj.type == 13 || obj.type == 23 || obj.type == 31 || obj.type == 32 || obj.type == 33 && obj.geom != "" );
					})
				}
				if (item.type == 12 || item.type == 22) {
					return copyStyleList.filter(obj => {
						return( obj.type == 12 || obj.type == 22 && obj.geom != "" );
					})
				}
				return copyStyleList;
			},
			//只保存id改为对象
			checkboxValue(item,index){
				var str = JSON.stringify(item);
				var obj = JSON.parse(str);
//				if (obj.style && obj.style.length>0) {
//					obj.style.forEach((it,ix) => {
//						if (!it.id) {
//							var find = this.styleList.find(m => m.id==it);
//							obj.style[ix] = find;
//						}
//					})
//				}
				this.modifyForm(this.objectDetail, obj);
			},
			getName(id){
				var name = "";
				if (id) {
					this.ModelList.forEach((item,index) => {
						if (item.fid == id) {
							name = item.name;
						}
					})
				}
				
				return name;
			},
			getFormName(data) {
				var find = this.formList.find(item => item.value == data);
				if(find) {
					return find.name;
				} else {
					return data;
				}
			},
			getServerName(data){
				var find = null;
				if (data.style) {
					find = this.formstyleType.find(item => item.value == data.style);
				}
				if(find) {
					return find.name;
				} else {
					return data;
				}
			},
			getServerTypeName(data){
				var find = null;
				if (data.style == 5) {
					if (data.data) {
						var obj = JSON.parse(data.data);
						if (obj.type) {
							find = this.styleServerType.find(item => item.value == obj.type);
						}
					}
				}
				if(find) {
					return find.caption;
				} else {
					return data;
				}
			},
			requestList() {
				//样式列表
				this.styleList = [];
				let obj = {
					orderType: "ID",
					descOrAsc: true,
				};
				this.formStyle.query(obj).then(data => {
					this.styleList = data.list;
				});

				//模型列表
				this.ModelList = [];
				axios.get(queryModelFile.baseURL, {})
				.then(response => {
					this.ModelList = response.data.data.list;
				})
				.catch(function(error) {

				});
				
				//形态列表
				this.getDict.query({}, "form").then(res => {
					this.formList = res;
				});
				
				//当前点击form
				vm.$on(operate.currentForm , data => {
					this.currentFormId = Number(data);
				})
				
				//上传模型之后添加到模型下拉框列表
				// vm.$on(operate.modelUploadEvent , data => {
				// 	if (data.sign == "success") {
				// 		var obj = data.data;
				// 		this.ModelList.unshift(obj);
				// 		this.formateList[this.curCollapse].formref.refid = obj.fid;
				// 	}
				// });
				
			},
			toArr(options) {
				//console.log(options,"toarr")
				if(typeof options == "string" && options != "") {
					return JSON.parse(options);
				} else {
					return options;
				}
			},
			getData() {
				this.cloneObjectContent = [];
				let val = this.objectDetail;
				if(val.forms && val.forms.length > 0) {
					this.changeArr(val.forms);
					var str = JSON.stringify(val.forms);
					this.cloneObjectContent = JSON.parse(str);
				} else {
					this.objtypeLists = [];
				}
				var formList = formCtrl.getAddFromList(val.otype);
				var str = JSON.stringify(formList);
				var arr = JSON.parse(str);
				this.formTypeList = arr.filter(
					form => form.value != 11 && form.value != 12 && form.value != 13
				);
				// console.log(formList, this.formTypeList, "形态列表前后对比");
				this.fromlistName = formCtrl.fromlist;
				// this.addFormOtype(val);
			},
			//样式内容转为数组格式
			changeArr(list) {
				list.forEach((item, index) => {
					if(item.style) {
						if(typeof item.style == "string") {
							item.style = JSON.parse(item.style);
							/*var obj = JSON.parse(item.style);
							if (obj && obj.length>0) {
								item.style = [];
								obj.forEach((it,ix) => {
									console.log("我来了")
									item.style.push(Number(it.id));
								})
							} else {
								item.style = [];
							}*/
						}
					} else {
						item.style = [];
					}
				});
				this.objtypeLists = list;
				
				//点击形态之后默认展开当前形态
				if (this.currentFormId) {
					this.objtypeLists.forEach((item,index) => {
						var str = item.geom;
						if (str) {
							var spl = str.substring(1,str.length);
							var num = Number(spl);
							if (num == this.currentFormId) {
								this.activeNames = index;
							}
						}
					})
				}
			},
			//从otype里面读出来的formStyle添加到object，type不一样的才能添加，以object的form为主
			addFormOtype(val) {
				if(val.otype && val.otype.id) {
					//根据对象otypeid，获取对象形态列表
					this.otypeDetail = allotypemgr.getOtypeById(val.otype.id);
					if(
						this.otypeDetail &&
						this.otypeDetail.formStyles &&
						this.otypeDetail.formStyles.styles &&
						this.otypeDetail.formStyles.styles.length > 0
					) {
						this.otypeDetail.formStyles.styles.forEach((item, index) => {
							var findIndex = this.objtypeLists.findIndex(
								it => it.type == item.type
							);
							if(findIndex == -1) {
								if(item.id) {
									var obj = {
										id: item.id,
										name: item.name,
										style: item.style
									};
									item.style.push(obj);
								} else {
									item.style = [];
								}
								item.sign = "otype";
								this.objtypeLists.push(item);
							}
						});
					}
				}
			},
			setTool(style) {
				let toolstyle = formCtrl.geOtypeFromStyle(
					this.objectDetail.otype,
					style.type
				);
				IdEdit.setTool(toolstyle, this.objectDetail.otype, {
					sobject: this.objectDetail,
					form: style
				});
			},
			openTab(tab) {
				let name = "";
				if(tab.type != 50) {
					name = "styleList";
				} else {
					name = "modelManager";
				}
				var popup = tabManage.getItemById(name);
				tabManage.setTabItem(popup);
				popup.floatItem();
				if(window.innerWidth - 800 - 350 > 0) {
					popup.setPos(window.innerWidth - 800 - 350, 160);
					popup.setSize(800, 600);
				} else {
					popup.setPos(0, 160);
					popup.setSize(650, 400);
				}
				/*var item = tabManage.getItemById(name);
				tabManage.setTabItem(item);*/
			},
			closeBehaviorTag(tag, indexTag, item) {
				if(!this.ifEdit) return;
				var str = this.objtypeLists[this.curCollapse];
				if(str.style) {
					if(typeof str.style == "string") {
						var obj = JSON.parse(str.style);
						str.style = obj;
					}
				} else {
					str.style = [];
				}
				str.style.splice(indexTag, 1);
				this.modifyForm(this.objectDetail, str);
			},
			dropBehavior(obj) {
				if(!this.ifEdit) return;
				if(obj.data.id == "style") {
					var str = this.objtypeLists[this.curCollapse];
					if(
						str.type == 11 ||
						str.type == 21 ||
						str.type == 40 ||
						str.type == 50 ||
						str.type == 61
					) {
						if(
							obj.data.data.type == 11 ||
							obj.data.data.type == 21 ||
							obj.data.data.type == 40 ||
							obj.data.data.type == 50 ||
							obj.data.data.type == 61
						) {
							str.style.push(obj.data.data);
							this.modifyForm(this.objectDetail, str);
						} else {
							this.$message({
								message: "请选择样式为点的进行拖动！",
								type: "warning",
								showClose: true
							});
							return false;
						}
					} else if(
						str.type == 13 ||
						str.type == 23 ||
						str.type == 31 ||
						str.type == 32 ||
						str.type == 33
					) {
						if(
							obj.data.data.type == 13 ||
							obj.data.data.type == 23 ||
							obj.data.data.type == 31 ||
							obj.data.data.type == 32 ||
							obj.data.data.type == 33
						) {
							str.style.push(obj.data.data);
							this.modifyForm(this.objectDetail, str);
						} else {
							this.$message({
								message: "请选择样式为面的进行拖动！",
								type: "warning",
								showClose: true
							});
							return false;
						}
					} else if(str.type == 12 || str.type == 22) {
						if(obj.data.data.type == 12 || obj.data.data.type == 22) {
							str.style.push(obj.data.data);
							this.modifyForm(this.objectDetail, str);
						} else {
							this.$message({
								message: "请选择样式为线的进行拖动！",
								type: "warning",
								showClose: true
							});
							return false;
						}
					} else {
						this.$message({
							message: "此类模板的形态有误，请前去designer重新编辑该类模板的形态！",
							type: "warning",
							showClose: true
						});
						return false;
					}
				} else if(obj.data.id == "model") {
					var str = this.objtypeLists[this.curCollapse];
					str.formref.refid = obj.data.data.fid;
					this.modifyForm(this.objectDetail, str);
				} else {
					this.$message({
						message: "请选择样式进行拖动！",
						type: "warning",
						showClose: true
					});
				}
			},
			modifyFormFn(item, index) {
				if (item.geomref && item.geomref!="" && item.geomref!="重新编辑位置") {
					item.geom = "n" + item.geomref;
				}
				if (item.geomref=="重新编辑位置") {
					item.geom = "";
				}
				item.minGrain = Number(item.minGrain);
				item.maxGrain = Number(item.maxGrain);
				this.modifyForm(this.objectDetail, item);
			},
			modifyForm(sobject, data) {
				IdEdit.modifyObjectForm(sobject, data);
			},
			handleChange(activeNames) {
				this.curCollapse = activeNames;
			},
			placeTypeChange(value) {

				let style = formCtrl.geOtypeFromStyle(this.objectDetail.otype, value);
				if(style != null) {

					//根据样式创建形态
					let form = IdEdit.currentGraph.createFormByStyle(style);
					console.log(form,this.objectDetail)
					//添加形态
					IdEdit.addObjectForm(this.objectDetail, form);
				}
			},
			deleteOT(item, index) {
				this.$confirm('此操作将永久删除此形态, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}).then(() => {
					if(this.objectDetail.forms && this.objectDetail.forms.length > 0) {
						var findIndex = this.objectDetail.actions.findIndex(
							it => it.operation == 129 && it.id == item.id
						);
						if(findIndex > -1) {
							this.objectDetail.forms.splice(index, 1);
							IdEdit.deleteObjectForm(this.objectDetail, item);
						} else {
							IdEdit.deleteObjectForm(this.objectDetail, item);
						};
						let entity = IdEdit.osmContent.entity(item.geom);
//						console.log(IdEdit.osmContent.hasEntity(item.geom));
//						console.log(entity);
						if(item.geom && entity){
							operationDelete([item.geom],IdEdit.osmContent)();
							if(entity.type==="relation" && entity.members.length>0){
								var arr = [];
								entity.members.forEach(it => {
									arr.push(it.id);
								})
								operationDelete(arr,IdEdit.osmContent)();
							}
						}
//						console.log(IdEdit.osmContent.history().difference().summary(),'defference');
						var addIndex = this.objectDetail.actions.findIndex(
							it => it.operation == 33
						);
						if(addIndex > -1) {
							this.objectDetail.forms.splice(index, 1);
						}
					}
				}).catch(() => {
//					this.$message({
//						type: 'info',
//						message: '已取消删除'
//					});
				});
			},
			saveOT() {
				var arr = [];
				this.objtypeLists.forEach((item, index) => {
					if(item.sign == "otype") {
						var find = this.otypeDetail.formStyles.styles.find(
							it => it.type == item.type
						);
						if(find) {
							if(item.style && item.style.length > 0) {
								arr.push(item);
							}
						}
					} else {
						if(item.id) {
							var obj = this.cloneObjectContent.find(it => it.type == item.type);
							if(obj) {
								arr.push(item);
							}
						} else {
							arr.push(item);
						}
					}
				});

				var cloneArr = JSON.stringify(arr);
				var clonestr = JSON.parse(cloneArr);
				clonestr.forEach((item, index) => {
					if(item.style && item.style.length > 0) {
						item.style = JSON.stringify(item.style);
					} else {
						item.style = null;
					}
				});
				if(this.deleteObjectList.length > 0) {
					this.deleteObjectList.forEach((item, index) => {
						if(item.style && item.style.length > 0) {
							item.style = JSON.stringify(item.style);
						} else {
							item.style = null;
						}
					});
				}

				//				console.log(this.cloneObjectContent , "object原数据")
				//				console.log(this.otypeDetail , "otype数据")
				//				console.log(this.objtypeLists , "综合数据")
				//				console.log(clonestr , "提交数据")

				// oTypeCtrl.updateOtypeForm(clonestr, this.deleteObjectList, res => {
				// 	arr = [];
				// 	this.deleteObjectList = [];
				// });
			}
		}
	};
</script>

<style lang="less">
	.objtype-info {
		/*position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background: #f5f7fa;*/
		background: #FFFFFF;
		overflow: hidden;
	}
	
	.objtype-detail {
		/*position: absolute;
		top: 0;
		left: 0;*/
		width: 100%;
		height: 100%;
		.change-select-style{
			width: 79%;
			.el-input{
                width: 160px !important;
            }
		}
		.drag-area {
			display: block;
			width: 200px;
			height: 70px;
			background-color: #f5f7fa;
			border: 2px dashed #e1e3e6;
			border-radius: 4px;
			position: relative;
			padding: 10px 0;
			margin-top: 20px;
			cursor: pointer;
			p {
				color: #4588e6;
				font-size: 14px;
				text-align: center;
			}
			span {
				position: absolute;
				color: #999;
				font-size: 12px;
				bottom: 0;
				left: 50%;
				transform: translate(-50%, 0);
			}
		}
		.object-form-type {
			/*position: absolute;
			top: 0px;*/
			width: 295px;
			height: 30px;
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			justify-content: flex-start;
			align-items: center;
			span {
				width: 70px;
				height: 25px;
				line-height: 25px;
				margin-left: 3px;
				text-align: center;
				cursor: pointer;
				color: #409eff;
				background: #ecf5ff;
				border: 1px solid #b3d8ff;
				border-radius: 5px;
				overflow: hidden;
				font-size: 12px;
				i {
					font-size: 14px;
				}
			}
			span:hover {
				color: #fff;
				background: #409eff;
				border: 1px solid #409eff;
			}
		}
		.cascader-type {
			position: absolute;
			top: 0px;
			width: 100px;
			height: 30px;
			.cascader-type-place {
				position: absolute;
				top: 0px;
				left: 30px;
				width: 80px;
				height: 30px;
				.el-input__inner {
					width: 88px;
				}
			}
			.el-cascader-place {
				position: absolute;
				left: 20px;
				top: 0px;
				line-height: 30px;
				width: 100px;
				height: 30px;
				text-align: center;
				color: #333333;
				cursor: pointer;
				background: #f5f7fa;
				z-index: 10;
				pointer-events: none;
			}
			.cascader-type-form {
				position: absolute;
				top: 0px;
				left: 120px;
				width: 80px;
				height: 30px;
				.el-input__inner {
					width: 100px;
				}
			}
			.el-cascader-form {
				position: absolute;
				left: 120px;
				top: 0px;
				line-height: 30px;
				width: 100px;
				height: 30px;
				text-align: center;
				color: #333333;
				cursor: pointer;
				background: #f5f7fa;
				z-index: 10;
				pointer-events: none;
			}
		}
		.right-objtype-save {
			position: absolute;
			top: 4px;
			right: 20px;
			width: 40px;
			height: 26px;
			text-align: center;
			line-height: 26px;
			font-size: 14px;
			color: #4588e6;
			cursor: pointer;
		}
		.right-objtype-i {
			display: flex;
			float: right;
			margin-right: 20px;
			color: #ff0000;
		}
		.right-collapse-top {
			position: absolute;
			top: 50px;
		}
		.select-style .el-input__inner {
			width: 200px;
			height: 30px !important;
			outline: none;
			border: 1px solid #e1e3e6;
			padding-left: 45px;
		}
		.el-select__input{
			width: 40px !important;
	        height: 25px;
		    border: 0px;
		    background: rgb(255, 255, 255);
		    padding: 0;
		    margin-left: 5px;
	    }
	    .el-select__tags{
	    	max-width: 200px !important;
	    }
	    .el-tag{
	    	margin-left: 5px !important;
	    	margin-top: 5px;
	    	max-width: 85px;
		    overflow: hidden;
		    text-overflow: ellipsis;
		    white-space: nowrap;
	    }
		.objtype-input {
			width: 200px;
			height: 30px;
			outline: none;
			border: 1px solid #e1e3e6;
			padding-left: 10px;
		}
		
		.objtype-rotate-input {
			width: 63px;
			height: 30px;
			outline: none;
			border: 1px solid #e1e3e6;
			padding-left: 10px;
			padding-right: 0;
		}
		
		.objtype-input-case{
			width: 79%;
			.el-input{
				width: 100% !important;
				input{
					width: 100%;
				}
			}
		}
	}
</style>
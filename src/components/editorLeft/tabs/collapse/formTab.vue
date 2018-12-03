<template>
	<div class="objtype-info" v-if="objectDetail.id">
		<div class="objtype-detail">
			<div class="object-form-type">
				<span v-for="it in formTypeList" :title="it.label" :key="it.value" @click.prevent.stop="placeTypeChange(it.value)">
					<i class="el-icon-plus"></i>
					{{it.label}}
				</span>
			</div>
			<el-collapse v-model="activeNames" @change="handleChange(activeNames)" accordion>
				<el-collapse-item v-for="(item,index) in formateList" :title="item.name" :name="index" :key="index">
					<template slot="title">
						<span v-for="(it,index) in fromlistName" :key="index" v-if="item.type == it.value">{{it.label}}</span>
						<div class="right-objtype-i" v-show="ifEdit">
							<i class="el-icon-delete" title="删除" @click.stop="deleteOT(item,index)" v-if="item.sign!='otype'"></i>
						</div>
					</template>
					<el-form size="mini">

						<el-form-item v-show="item.type!==50 && item.type!==40" label="样式内容 :" :label-width="classNameWidth">

							<el-select 
								size="mini"
								v-if="item.type!==50 && item.type!==40"
								v-model="item.style" 
								@change="checkboxValue(item,index)"
								ref="selectStyle"
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
							<!-- <el-select 
								v-if="item.type===50"
								class="change-select-style width"
								v-model="item.formref.refid" 
								@change="checkboxValue(item,index)"
								ref="selectStyle"
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
										<a :href="modelDownloadFn(downloadFile.baseURL,it.fid)" style="margin-left: 5px;color: #999999;">
											<i class="el-icon-download"></i>
										</a>
									</span>
								</el-option>
							</el-select> -->
							<el-input class="width" readonly v-model="item.formref.refid"></el-input>
							<el-button type="primary" size="mini" icon="el-icon-plus" circle @click="openModelLists(item)"></el-button>
							<!-- <el-tooltip effect="dark" content="上传新模型" placement="bottom">
								<el-button type="primary" size="mini" icon="el-icon-upload" circle @click="modelUploadFn"></el-button>
							</el-tooltip> -->
							
						</el-form-item>
						<el-form-item label="维度 :" :label-width="classNameWidth">
							<el-select ref="selectStyle" v-model="item.dim" placeholder="请选择维度" :disabled="true" @change="modifyFormFn(item,index)">
								<el-option v-for="(da, ix) in dimension" :key="ix" :label="da.name" :value="da.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="位置 :" :label-width="classNameWidth">					
							<el-select class="width" ref="selectStyle" v-model="item.geomref" placeholder="选择引用位置" @change="changePosi(item,index)" :class="{'objtype-input-case':!item.geom}">
								<el-option v-for="(da, ix) in positionRefList(formateList,item)" :key="ix" :label="da.geomref" :value="da.geomref">
								</el-option>
							</el-select>
							
							<el-tooltip effect="dark" content="编辑位置" placement="bottom">
						    	<el-button class="diy-size" type="primary" size="mini" icon="el-icon-edit" circle v-if="!item.geom" @click="setTool(item)"></el-button>
						    </el-tooltip>
						</el-form-item>
						<el-form-item label="最小可见 :" :label-width="classNameWidth">
							<!-- <input :readonly="!ifEdit" type="number" placeholder="请输入最小可见" autocomplete="off" @blur="modifyFormFn(item,index)" v-model="item.minGrain" class="objtype-input" /> -->
							<el-input type="number" placeholder="请输入最小可见" @change="modifyFormFn(item,index)" v-model="item.minGrain"></el-input>
						</el-form-item>
						<el-form-item label="最大可见 :" :label-width="classNameWidth">
							<!-- <input :readonly="!ifEdit" type="number" placeholder="请输入最大可见" autocomplete="off" @blur="modifyFormFn(item,index)" v-model="item.maxGrain" class="objtype-input" /> -->
							<el-input type="number" placeholder="请输入最大可见" @change="modifyFormFn(item,index)" v-model="item.maxGrain"></el-input>
						</el-form-item>
						
						<el-form-item label="缩放比例 :" :label-width="classNameWidth" v-if="item.type===50 || item.type===40">
							<el-input type="number" placeholder="缩放比例" @change="modifyFormFn(item,index)" v-model="item.style[0].scale"></el-input>
						</el-form-item>
						
						<el-form-item label="最小像素:" :label-width="classNameWidth" v-if="item.type===50 || item.type===40">
							<el-input type="number" placeholder="最小像素值" @change="modifyFormFn(item,index)" v-model="item.style[0].smallPX"></el-input>
						</el-form-item>
						
						<el-form-item label="x轴旋转：" :label-width="classNameWidth" v-if="item.type===50 || item.type===40">
							<el-input type="number" placeholder="X轴旋转（角度）" @change="modifyFormFn(item,index)" v-model="item.style[0].x"></el-input>
						</el-form-item>
						<el-form-item label="y轴旋转：" :label-width="classNameWidth" v-if="item.type===50 || item.type===40">
							<el-input type="number" placeholder="Y轴旋转（角度）" @change="modifyFormFn(item,index)" v-model="item.style[0].y"></el-input>
						</el-form-item>
						<el-form-item label="z轴旋转：" :label-width="classNameWidth" v-if="item.type===50 || item.type===40">
							<el-input type="number" placeholder="Z轴旋转（角度）" @change="modifyFormFn(item,index)" v-model="item.style[0].z"></el-input>
						</el-form-item>
						<el-form-item label="海拔：" :label-width="classNameWidth" v-if="item.type===50 || item.type===40">
							<el-input type="number" placeholder="地面高度（m）" @change="modifyFormFn(item,index)" v-model="item.style[0].h"></el-input>
						</el-form-item>
						
						<el-form-item label="关联：" :label-width="classNameWidth" v-if="item.geotype==24">
							<div>
								<div class="add">
									<span class="operate-btn" @click="addRelation(item)">添加</span>
									<!-- <span class="operate-btn" @click="reloveRelation(item)">分解</span> -->
								</div>
								<relation-operate v-for="(item,i) in item.relationArr" :key="i" :item="item" @delete="deleteRelation"></relation-operate>
							</div>
						</el-form-item>

						<el-form-item>
							<el-button size="mini" class="pull-right" @click="preview(item)">预览</el-button>
						</el-form-item>
					</el-form>
				</el-collapse-item>
			</el-collapse>
		</div>
	</div>
</template>

<script>
  import { vm, operate,getEditor } from "@/script/operate";
  import {State} from '@/script/editor/utils/store'

	import * as formCtrl from "./formCtrl";

  var IdEdit;
	export default {
		data() {
			return {
				dimension: [], //维度列表
				styleServerType: [],//服务类型列表
				formstyleType: [], //样式类型列表
				formTypeList: [], //形态列表
				selectPlaceType: [],
				lableProps: {
					value: "value",
					label: "name"
				},
				otypeDetail: {}, //object的otype详情
				cloneObjectContent: [], //object原始的内容
				curCollapse: null, //记录当前点击的形态
				deleteObjectList: [],
				objtypeLists: [], //添加形态列表
				activeNames: "", //当前点击的第几个列表
				classNameWidth: "75px",
				fromlistName: [],
				ModelList: [], //模型列表
				styleList: [],
				currentFormId: null,//当前点击形态的id
        formList: [],
				ifEdit:true,
				showDiag:false
			};
		},
		props: ["objectDetail"],
		components: {
			relationOperate:()=>import('../../components/relationOperate')
		},
		beforeMount(){
			IdEdit = getEditor();
      this.dimension = State.dimension;
      this.styleServerType = State.styleServerType;
      this.formstyleType = State.formstyleType;
			this.getData();
		},
		mounted() {
			// IdEdit = getEditor();
      // this.dimension = State.dimension;
      // this.styleServerType = State.styleServerType;
      // this.formstyleType = State.formstyleType;
			// this.getData();
			// this.$nextTick(()=>{
			// 	console.log(123332213)
			// })
		},
		watch: {
			objectDetail(val) {
				if(val.id) {
					this.formTypeList = [];
					this.getData();
					IdEdit = getEditor();
					this.dimension = State.dimension;
					this.styleServerType = State.styleServerType;
					this.formstyleType = State.formstyleType;
				}
			}
		},
		computed: {
			formateList() {
				// this.objtypeLists.forEach(el => {
				// 	if(el.type===50 || el.type===40) {
				// 		if (el.style == "") {
				// 			el.style = [];
				// 			el.style[0] = {
				// 				scale: "",
				// 				smallPX: "",
				// 				x: "",
				// 				y: "",
				// 				z: "",
				// 				h:""
				// 			};
				// 		}
				// 	} else {
				// 		if (el.style == "") {
				// 			el.style = [];
				// 		}
				// 	}
				// 	if(typeof el.style == "string" && el.style != "") {
				// 		el.style = JSON.parse(el.style);
				// 	}
					
				// 	// return el;
				// });
				return this.objtypeLists;
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
		activated() {
			this.requestList();
		},
		deactivated() {
			if(!this.$refs.selectStyle) return;
			this.$refs.selectStyle.forEach(el=>{
				el.blur();
			})
		},
		mounted() {
			this.requestList();
		},
		methods: {
			preview(item){
				vm.$emit(operate.preview,{
					entityId:item.geom,
					object:this.objectDetail
				});
			},
			positionRefList(forms,item){
				let aim = [];
				aim = forms.filter(el=>(el.geotype==item.geotype)&&el.geom);
				return aim;
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
				this.showDiag = true;
			},
			openModelLists(item){
				IdEdit.currentForm = item;
				vm.$emit(operate.changeTab,{name:'modeList'});

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
				this.styleList = State.styleList;
				//模型列表
        this.ModelList = [];
				this.ModelList = State.ModelList;
				
				//形态列表
				this.formList = State.formType
				
				
			},
			changeMode(data){
				var obj = data.data;
				this.ModelList.unshift(obj);
				this.formateList[this.curCollapse].formref.refid = obj.fid;
				this.showDiag= false;
				// this.modifyForm(this.objectDetail,this.curCollapse);
				this.checkboxValue(this.formateList[this.curCollapse]);
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
				
			},
			//样式内容转为数组格式
			changeArr(list) {
				list.forEach((item, index) => {
					if(item.style) {
						if(typeof item.style == "string") {
							item.style = JSON.parse(item.style);
						}
					} else {
						item.style = [];
					}
					this.$set(item,'relationArr',this.relationArr(item));
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
          this.otypeDetail = val.otype;
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
			modifyFormFn(item, index) {
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
					// console.log(form,this.objectDetail,888888)
					//添加形态
					IdEdit.addObjectForm(this.objectDetail, form);
				}
				this.getData();
			},
			deleteOT(item, index) {
				this.$confirm('此操作将永久删除此形态, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}).then(() => {
					if(this.objectDetail.forms && this.objectDetail.forms.length > 0) {
						IdEdit.deleteObjectForm(this.objectDetail, item);
					}
				}).catch((err) => {
					console.log(err)
				});
			},
			addRelation(item){
				
				vm.$emit(operate.changeTab,{name:'addRelation'})

			},
			changePosi(item,index){
				console.log(item,index,'changePosi');
				// console.log(this.objectDetail,item);
				
				this.modifyForm(this.objectDetail, item);
			},
			relationArr(item){
				let context = getEditor().idContext;
				let arr = [];
				if(!item.geom) return arr;
				let entity = context.entity(item.geom);
				if(entity.type=='relation'){
					entity.members.forEach(member=>{
						let obj = {
							relation:member.id,
							role:member.role,
							parent:item.geom,
							'_relation':member.id
						}
						if(!State.ways[member.id]) obj.relation = '未下载';
					arr.push(obj);
					})
				}else{

				};
				return arr;
			},
			deleteRelation(obj){
				console.log(obj,8888)
				this.formateList.forEach(el=>{
					console.log(el.relationArr,'ffffffff')
					let index = el.relationArr.findIndex(ev=>ev._relation==obj.member);
					if(index>-1) el.relationArr.splice(index,1);
				})
			}
		}
	};
</script>

<style lang="scss" scoped>
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
			// height: 30px;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: flex-start;
			align-items: center;
			
			span {
				flex-shrink: 0;
				width: 75px;
				height: 25px;
				line-height: 25px;
				margin-left: 5px;
				margin-bottom: 5px;
				text-align: center;
				cursor: pointer;
				color: #409eff;
				background: #ecf5ff;
				border: 1px solid #b3d8ff;
				border-radius: 5px;
				overflow: hidden;
				font-size: 10px;
				i {
					font-size: 12px;
				}
			}
			span:hover {
				color: #fff;
				background: #409eff;
				border: 1px solid #409eff;
			}
		}
		.right-objtype-i {
			display: flex;
			float: right;
			margin-right: 20px;
			color: #ff0000;
			margin-top: 16px;
		}
		.right-collapse-top {
			position: absolute;
			top: 50px;
		}
		    
		.objtype-input {
			width: 200px;
			height: 30px;
			outline: none;
			border: 1px solid #e1e3e6;
			padding-left: 10px;
		}
		
	}
	.add{
		display: flex;
		justify-content: flex-end;
		color: #4588e6;
		cursor: pointer;
		font-size: 12px;
	}
	.width{
		width: 150px;
	}
</style>
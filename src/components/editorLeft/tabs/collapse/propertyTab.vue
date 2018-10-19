<template>
	<div class='property-root'>
			<div class="object-attributes">
				<div class="object-parents">
					<div class="parents-name"><span>对象ID：</span></div>
					<div class="parents-select">
						<span>{{objectDetail.id}}</span>
					</div>
				</div>
				<div class="object-attributes-detail">
					<div class="object-attributes-key">
						<span>属性名</span>
						<span>属性值</span>
					</div>
					<div class="object-attributes-value">
						<div class="object-attributes-list" v-for="(item,index) in objectAttrLists" :key="index">
							<input class="pd-left-mini" v-if="!item.noEdit" type="text" :value="getFieldLabel(item.name)" :readonly="!item.noEdit" />
							<input class="pd-left-mini" v-else type="text" v-model="item.name" :readonly="!item.noEdit" />

							<input class="pd-left-mini" v-if="getIntypeVal(item.fid)=='Text' || getIntypeVal(item.fid)=='Textarea'" type="text" v-model="item.value"  @blur="lastValue(item,index)" placeholder="请输入内容" />
							<input class="pd-left-mini" v-else-if="getIntypeVal(item.fid)=='Number'" type="number" :placeholder="'范围：'+getMinVal(item.fid)+' ~ '+getMaxVal(item.fid)" :min="getMinVal(item.fid)" :max="getMaxVal(item.fid)" v-model="item.value" @blur="lastValue(item,index)" />
							<el-date-picker size="mini" v-else-if="getIntypeVal(item.fid)=='Date'" v-model="item.value" @change="lastValue(item,index)" type="datetime" placeholder="选择日期时间" default-time="00:00:00">
							</el-date-picker>

							<el-select size="mini" v-else-if="getIntypeVal(item.fid)=='Radio' || getIntypeVal(item.fid)=='Select'" v-model="item.value" @change="lastValue(item,index)" filterable allow-create default-first-option placeholder="请选择,单选,可输入">
								<el-option v-for="(it,ix) in getCheckboxList(item.fid)" :key="ix" :label="it" :value="it">
								</el-option>
							</el-select>

							<el-select size="mini" v-else-if="getIntypeVal(item.fid)=='Checkbox'" v-model="item.value" @change="checkboxValue(item,index)" multiple collapse-tags default-first-option placeholder="请选择,可多选">
								<el-option v-for="(it,ix) in getCheckboxList(item.fid)" :key="ix" :label="it" :value="it">
								</el-option>
							</el-select>

							<input class="pd-left-mini" v-else type="text" v-model="item.value" @blur="lastValue(item,index)" placeholder="请输入内容" />
							<i class="el-icon-delete" v-if="getDeleteShow(item,index)" @click="deleteAttr(item,index)"></i>
						</div>
						<div class="add-diy" @click="addProperty">
							<i class="el-icon-plus"></i>
						</div>

					</div>
				</div>
			</div>
	</div>
</template>

<script>
	import { vm, operate ,getEditor } from "@/script/operate";
  import _cloneDeep from "lodash-es/cloneDeep";
  let idEdit;
	export default {
		data() {
			return {
				objectAttrLists: [], //添加属性列表
				showproperty: false //是否显示属性列表
			};
		},
		props: ["objectDetail"],
		components: {

		},
    activated() {},
    mounted(){
      idEdit = getEditor();
      this.transformObj(this.objectDetail);
    },
		watch: {
			objectDetail(val) {
        this.transformObj(val);
			}
		},
		methods: {
      transformObj(val){
        if(val.id && val.id != "" && val.id > 0) {
					this.showproperty = true;
					this.objectAttrLists = this.converSObjecttToAttrs(val);
				} else {
					this.showproperty = false;
				}
      },
			//删除私有属性
			deleteAttr(item,index){
				if (this.objectDetail.attributes && this.objectDetail.attributes.length>0) {
					var findIndex = this.objectDetail.attributes.findIndex(it => it.name==item.name);
					if (findIndex > -1) {
						this.objectDetail.attributes.splice(findIndex , 1);
            this.objectDetail.modifyAttr(this.objectDetail.attributes);
            console.log('delete')
						idEdit.modifySobject(this.objectDetail);
					}
					
					var m = this.objectAttrLists.findIndex(it => it.name==item.name);
					if (m > -1) {
						this.objectAttrLists.splice(m , 1);
					}
				}
			},
			//判断字段是否是私有属性，如果是私有属性是可以删除的
			getDeleteShow(item,index){
				if(this.objectDetail.otype.fields) {
					var findIndex = this.objectDetail.otype.fields.fields.findIndex(
						it => it.id == item.fid
					);
					if(findIndex > -1) {
						return false;
					}
					return true;
				}
				return true;
			},
			//获取字段的输入控件类型，以控制当前字段后面的输入类型
			getIntypeVal(fid) {
				if(this.objectDetail.otype.fields) {
					var find = this.objectDetail.otype.fields.fields.find(
						item => item.id == fid
					);
					if(find) {
						return find.uitype;
					}
				}
				return "";
			},
			//如果字段的输入控件类型为Number，则取出其允许输入的最小值
			getMinVal(fid) {
				var find = this.objectDetail.otype.fields.fields.find(
					item => item.id == fid
				);
				if(find && find.domain && find.domain != '') {
					var arr = JSON.parse(find.domain);
					if(arr.Domain) {
						var range = arr.Domain;
						if(range.length > 0) {
							return JSON.stringify(range[0]);
						} else {
							return "";
						}
					} else {
						return "";
					}
				} else {
					return "";
				}
			},
			//如果字段的输入控件类型为Number，则取出其允许输入的最大值
			getMaxVal(fid) {
				var find = this.objectDetail.otype.fields.fields.find(
					item => item.id == fid
				);
				if(find && find.domain && find.domain != '') {
					var arr = JSON.parse(find.domain);
					if(arr.Domain) {
						var range = arr.Domain;
						if(range.length > 1) {
							return JSON.stringify(range[1]);
						} else {
							return "";
						}
					} else {
						return "";
					}
				} else {
					return "";
				}
			},
			//如果字段的输入控件类型为Checkbox，则选取其值域中的编码标签中的值
			getCheckboxList(fid) {
				var list = [];
				var find = this.objectDetail.otype.fields.fields.find(
					item => item.id == fid
				);
				if(find) {
					var arr = JSON.parse(find.domain);
					if(arr.Range) {
						return arr.Range;
					} else {
						return list;
					}
				} else {
					return list;
				}
			},
			getFieldLabel(name) {
				let otype = this.objectDetail.otype;
				if(
					otype &&
					otype.fields &&
					otype.fields.fields &&
					otype.fields.fields.length > 0
				) {
					let fields = otype.fields.fields;
					for(let i = 0; i < fields.length; i++) {
						let field = fields[i];
						if(field.name == name) {
							return field.caption;
						}
					}
				}
				return name;
			},
			/**
				根据对象以及otype获取对应的属性信息
			 */
			converSObjecttToAttrs(sobject) {
				let tempattributes = {};
				//首先将对象中的字段属性放入键值对
				for(let i = 0; i < sobject.attributes.length; i++) {
					tempattributes[sobject.attributes[i].name] =
						sobject.attributes[i].value;
				}
				let objectattrs = [];
				let otype = sobject.otype;
				if(otype && otype.fields) {
					let fields = otype.fields.fields;
					//根据otype中的字段定义顺序，显示获取排列字段
					for(let i = 0; i < fields.length; i++) {
						let field = fields[i];

						let attr = {
							fid: field.id,
							name: field.name,
							value: ""
						};
						objectattrs.push(attr);
						//如果otype中的字段有与之对应的对象字段，则进行赋值，并将缓存的键值对删除。
						if(tempattributes[field.name]) {
							//存在otype字段
							if(this.getIntypeVal(attr.fid) == "Checkbox") {
								attr.value = JSON.parse(tempattributes[field.name]);
							} else if(this.getIntypeVal(attr.fid) == "Date") {
								attr.value = new Date(tempattributes[field.name]);
							} else {
								attr.value = tempattributes[field.name];
							}

							delete tempattributes[field.name];
						}
					}
				}

				//将otype中未包含的字段添加到显示列表（私有字段）
				for(let key in tempattributes) {
					let attr = {
						fid: 0,
						name: key,
						value: tempattributes[key]
					};
					let s = objectattrs.find(el => el.name == attr.name);
					if(!s) objectattrs.push(attr);
				}
				return objectattrs;
			},

			getSObjectAttrs() {
				// console.log(this.objectAttrLists, "获取的属性");

				return _cloneDeep(this.objectAttrLists);
			},
			checkboxValue(item, index) {
				if(!this.objectDetail) return;
				let attr = this.getSObjectAttrs();
				if(attr && attr.length > 0) {
					attr.forEach((it, ix) => {
						if(this.getIntypeVal(it.fid) == "Checkbox") {
							it.value = JSON.stringify(it.value);
						}
					});
				}
				this.objectDetail.modifyAttr(attr);
				console.log(attr,123123)
				idEdit.modifySobject(this.objectDetail);
			},
			lastValue(item, index) {
				if(this.getIntypeVal(item.fid) == "Number") {
					var min = this.getMinVal(item.fid);
					var max = this.getMaxVal(item.fid);
					if (min && max) {
						if(Number(item.value) < Number(min) || Number(max) < Number(item.value)) {
							item.value = "";
						}
					} else if (min) {
						if (Number(item.value) < Number(min)) {
							item.value = "";
						}
					} else if (max) {
						if (Number(max) < Number(item.value)) {
							item.value = "";
						}
					}
				}

				if(!this.objectDetail) return;
				let attr = this.getSObjectAttrs();

				if(attr && attr.length > 0) {
					attr.forEach((it, ix) => {
						if(this.getIntypeVal(it.fid) == "Checkbox") {
							it.value = JSON.stringify(it.value);
						}
					});
				}
				idEdit.modifyAttr(attr,this.objectDetail);
			},
			addProperty() {
				// console.log(this.objectAttrLists);
				this.objectAttrLists.push({
					fid: 0,
					name: "",
					value: "",
					noEdit: true
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.property-root{
		overflow: hidden;
		background: #FFFFFF;
	}
	
	.object-parents {
		height: 40px;
		width: 96%;
		border-bottom: 1px solid #dedede;
		display: flex;
		justify-content: center;
		align-items: center;
		.parents-name {
			span {
				color: #666666;
				font-size: 14px;
			}
			i {
				color: red;
			}
		}
		.parents-select {
			input {
				border: 0;
			}
		}
	}
	
	.object-attributes-detail {
		.object-attributes-key {
			border-bottom: 1px solid #dedede;
			width: 96%;
			span {
				display: inline-block;
				width: 87px;
				line-height: 30px;
				padding-left: 10px;
				color: #666666;
				font-size: 12px;
			}
			span:nth-child(2) {
				width: 64%;
				border-left: 1px solid #dedede;
			}
		}
		.object-attributes-value {
			height: calc(100% - 30px);
			overflow-y: auto;
			overflow-x: hidden;
			margin-bottom: 10px;
			.object-attributes-list {
				position: relative;
				width: 100%;
				height: 30px;
				display: flex;
				// align-items: center;
				input {
					border: 0;
					border-radius: 0;
					border-bottom: 1px solid #dedede;
				}
				input:nth-child(1) {
					/*width: 100px;*/
					width: 90px;
					background: #ffffff;
				}
				input:nth-child(2) {
					/*max-width: 200px;*/
					width: 64%;
					border-left: 1px solid #dedede;
				}
				i{
					color: #666666;
					cursor: pointer;
					line-height:30px;
				}
				i:hover{
					color: red;
				}
			}
			.add-diy {
				float: right;
				margin-top: 5px;
				margin-right: 10px;
				padding: 3px 25px;
				border: 1px solid #dedede;
				border-radius: 5px;
				cursor: pointer;
			}
			.add-diy:hover {
				border-color: #176de6;
				i {
					color: #176de6;
				}
			}
		}
	}
</style>
<template>
	<div class='behavior-info' v-if="objectDetail.id">
		<div class="top" :class="{notEdit:!ifEdit}">
			<div class="accordion-top pd-left-small pd-right-small">
				<el-collapse v-model="accordionName" accordion class="accordion" v-if="topData && topData.length>0">
					<el-collapse-item v-for="(n,i) in topData" :key="i" :title="getName(n)" :name='i' v-if="n">
						<el-form label-position="right" label-width="60px" :model="n">
							<el-form-item label="语言:">
								<el-input :value="getLanguageName(n.pLanguage)" :disabled="true" class="accordion-input"></el-input>
							</el-form-item>
							<el-form-item label="类型:">
								<el-input :value="n.mdef.name" :disabled="true" class="accordion-input"></el-input>
							</el-form-item>
							<el-form-item label="时间:">
								<el-input :value="timeChange(n.mtime)" :disabled="true" class="accordion-input"></el-input>
							</el-form-item>
							<el-form-item label="输入:">
								<div class="behavior-intypes" v-if="n.mdef && n.mdef.id && n.mdef.inTypesList.length>0">
									<span v-for="(tag,index) in n.mdef.inTypesList" :key="index" :title="tag.caption+'('+tag.name+')'+tag.des">{{tag.caption}}</span>
								</div>
								<div class="behavior-intypes" v-else>
									<span>default</span>
								</div>
							</el-form-item>
							<el-form-item label="输出:">
								<div class="behavior-intypes" v-if="n.mdef && n.mdef.id && n.mdef.outTypesList.length>0">
									<span v-for="(tag,index) in n.mdef.outTypesList" :key="index" :title="tag.caption+'('+tag.name+')'+tag.des">{{tag.caption}}</span>
								</div>
								<div class="behavior-intypes" v-else>
									<span>default</span>
								</div>
							</el-form-item>
						</el-form>
					</el-collapse-item>
				</el-collapse>
			</div>
		</div>
		<div class="down" v-if="ifEdit">
			<div class="right-objtype-save">
				<span @click.stop="amend">编辑保存</span>
			</div>
			<div class="drag-in" @click="openTab('behaviorList')">
				点击添加行为
				<!--+拖拽到此处添加-->
			</div>
			<div class="accordion-down cle">
				<el-collapse v-model="activeName" accordion class="collapse">
					<draggable v-model="accordionData" :options="{group:'people',handle:'.li'}" class="draggable">
						<div class="li cle pd-left-small pd-right-small" v-for="(n,i) in accordionData" :key="i">
							<!-- <div class="title"><span>{{i+1}}</span></div> -->
							<div class="del" @click="del(i)"><i class="iconfont icon-shanchu11 font-14"></i></div>
							<el-collapse-item :title="n.name" :name="i" class="step-li">
								<el-form size="mini" label-position="right" label-width="80px" :model="n">
									<el-form-item label="时间:">

										<el-date-picker class="accordion-input" @change="change(i)" v-model="n.etime" type="datetime" placeholder="选择日期时间" default-time="12:00:00">
										</el-date-picker>

										<!--<el-input v-model="n.etime" type="number" class="accordion-input" @change="change(i)"></el-input>-->
									</el-form-item>

									<span class="input-field" v-if="n.initData && n.initData.inTypes && n.initData.inTypes.length>0">--------------------输入字段项--------------------</span>

									<el-form-item v-if="n.initData && n.initData.inTypes && n.initData.inTypes.length>0" v-for="(item,index) in n.initData.inTypes" :title="item.name" :label="item.name+':'" :key="index">
										<el-input v-model="item.value" type="text" class="accordion-input" @change="change(i)"></el-input>
									</el-form-item>

								</el-form>
							</el-collapse-item>
						</div>
					</draggable>
				</el-collapse>
			</div>
		</div>
	</div>
</template>
<script>
  import psde from '@/script/editor/psde'
	import draggable from "vuedraggable";
	import behaviorService from "@/script/editor/psde/behaviorService";
	import { vm, operate } from "@/script/operate";

	export default {
		data() {
			return {
				allId: "",
				oldData: [],
				bData: [],
				changeArr: [],
				//-----------------------------
				myArray: [],
				otypeDetail: "",
				accordionData: [], //行为数组
				topData: [], //行为数组
				activeName: "1", //手风琴打开id
				accordionName: "1", //手风琴打开id
				modelLanguageType: [], //行为脚本语言类型
				getDict: new psde.GetDict(),
				model: new psde.Model(),
        behaviorList: [],
        ifEdit:true
			};
		},

		props: ["objectDetail"],
		components: {
			draggable
		},
		computed: {},
		mounted() {
			this.getDict.query(null, "modelLanguage").then(data => {
				this.modelLanguageType = data;
      });
			this.behaviorLists();
			vm.$on(operate.selectBehavior,obj=>{
				this.dropBehavior(obj);
			})
		},
		activated() {
			this.behaviorLists();
		},

		watch: {
			objectDetail(val) {
				if(val.id) {
					this.addBehaviorOtype(val);
				}
			}
		},
		methods: {
			openTab(tab) {
				vm.$emit(operate.changeTab,{name:tab})
			},
			getName(n) {
				if(n && n.name) {
					return n.name;
				} else {
					return "default";
				}
			},
			behaviorLists() {
				this.model.query().then(response => {
					this.behaviorList = response.list;
					this.behaviorList.forEach((item, index) => {
						if(item.mdef && item.mdef.inTypes) {
							item.mdef.inTypes = JSON.parse(item.mdef.inTypes);
						}
						if(item.mdef && item.mdef.outTypes) {
							item.mdef.outTypes = JSON.parse(item.mdef.outTypes);
						}
					});
					if(this.objectDetail.id) {
						this.addBehaviorOtype(this.objectDetail);
					}
				});
			},
			getLanguageName(data) {
				if(data) {
					var str = "";
					this.modelLanguageType.forEach((item, index) => {
						if(item.value == data) {
							str = item.name;
						}
					});
					return str;
				} else {
					return "null";
				}
			},
			addBehaviorOtype(val) {
				if(val.otype && val.otype.id) {
					//根据对象otypeid，获取对象关系列表
          // this.otypeDetail = allotypemgr.getOtypeById(val.otype.id);
          this.otypeDetail = val.otype;
					this.accordionData = [];
					this.topData = [];
					this.allId = this.objectDetail.id;
					this.query(this.objectDetail.id);
					if(this.otypeDetail && this.otypeDetail.models.models.length > 0) {
						this.topData = this.otypeDetail.models.models;

						this.topData.forEach((item, index) => {
							if(item && item.mdef && item.mdef.id) {
								if(item.mdef.inTypes == "null" || item.mdef.inTypes == null) {
									item.mdef.inTypesList = [];
								} else {
									item.mdef.inTypesList = JSON.parse(item.mdef.inTypes);
								}
								if(item.mdef.outTypes == "null" || item.mdef.outTypes == null) {
									item.mdef.outTypesList = [];
								} else {
									item.mdef.outTypesList = JSON.parse(item.mdef.outTypes);
								}
							}
						});
					}
				}
			},
			query(id) {
				//请求行为
				behaviorService
					.query({
						oid: id
					})
					.then(response => {
						this.bData = response.data.data;
						this.accordionData = Object.assign([], this.bData);
						if(this.accordionData && this.accordionData.length > 0) {
							this.accordionData.forEach((item, index) => {
								if(item.etime) {
									item.etime = new Date(item.etime);
								} else {
									//item.etime = Date.parse(new Date());
									item.etime = null;
								}
								if(item.initData) {
									item.initData = JSON.parse(item.initData);
								} else {
									this.behaviorList.forEach((it, ix) => {
										if(item.modelID == it.id) {
											item.initData = {};
											item.initData.inTypes = [];
											if(
												it.mdef &&
												it.mdef.inTypes &&
												it.mdef.inTypes.length > 0
											) {
												it.mdef.inTypes.forEach((n, i) => {
													var obj = {};
													obj.name = n.caption;
													obj.value = "";
													item.initData.inTypes.push(obj);
												});
											}
										}
									});
								}
							});
						}
						//console.log(this.accordionData , "this.accordionData*********************")
						this.oldData = Object.assign([], this.bData);
					});
			},
			dropBehavior(item) {
				//拖拽结束
					if(item.mdef && item.mdef.inTypes) {
						item.initData = {};
						item.initData.inTypes = [];
						var arr = JSON.parse(item.mdef.inTypes);
						if(arr.length > 0) {
							arr.forEach((it, ix) => {
								var obj = {};
								obj.name = it.caption;
								obj.value = "";
								item.initData.inTypes.push(obj);
							});
						}
					} else {
						item.initData = {};
						item.initData.inTypes = [];
					}
					this.accordionData.push(item);
					this.saveOT();

			},
			saveOT() {
				let arr = [];
				this.accordionData.forEach((n, i) => {
					if(!this.exist(n.id)) {
						arr.push(this.addObj(n, 0));
					}
				});
				this.axios(arr);
			},
			exist(id) {
				//和旧数据比较  只留新增的  不能重复
				let or = false;
				this.oldData.forEach((m, p) => {
					if(id == m.id) {
						or = true;
					}
				});
				return or;
			},
			del(val) {
				//删除行为
				let arr = [];
				let one = this.accordionData[val];
				arr.push(this.addObj(one, this.bData[val].pid));
				behaviorService.delete(arr).then(
					response => {
						this.query(this.allId);
						vm.$emit(operate.notice,{
							message: "删除成功！",
							type: "success",
						})
					},
					error => {
						vm.$emit(operate.notice,{
							message: "错误",
							type: "error",
						})
					}
				);
			},
			amend() {
				let arr = [];
				this.changeArr.forEach((n, i) => {
					let one = this.accordionData[n];
					arr.push(this.addObj(one, this.bData[n].pid));
				});
				behaviorService.update(arr).then(
					response => {
						this.query(this.allId);
						vm.$emit(operate.notice,{
							message: "更新成功！",
							type: "success",
						})
					},
					error => {
						vm.$emit(operate.notice,{
							message: "错误",
							type: "error",
						})
					}
				);
			},
			change(val) {
				let or = false;
				this.changeArr.forEach((m, p) => {
					if(m == val) {
						or = true;
					}
				});
				if(!or) {
					this.changeArr.push(val);
				}
			},
			addObj(one, pid) {
				let obj = {};
				obj.oid = this.objectDetail.id;
				obj.pid = pid;
				obj.name = one.name;
				obj.reason = "事件原因";
				obj.modelID = one.id;
				obj.trs = null;
				if(one.etime) {
					obj.etime = new Date(one.etime).getTime();
				} else {
					obj.etime = new Date(one.mtime).getTime();
				}
				obj.isv = true;
				if(one.initData) {
					obj.initData = JSON.stringify(one.initData);
				} else {
					obj.initData = "";
				}
				return obj;
			},
			axios(arr) {
				behaviorService.save(arr).then(
					response => {
						this.query(this.allId);
						vm.$emit(operate.notice,{
							message: "新加成功！",
							type: "success",
						})
					},
					error => {
						vm.$emit(operate.notice,{
							message: "错误",
							type: "error",
						})
					}
				);
			},

			startDrag(event) {
				event.preventDefault();
				event.stopPropagation();
			},
			endDrag(event) {
				event.preventDefault();
				event.stopPropagation();
			},
			timeChange(val) {
				let time = new Date(val);
				let y = time.getFullYear();
				let m = time.getMonth() + 1;
				let d = time.getDate();
				let h = time.getHours();
				let f = time.getMinutes();
				let s = time.getSeconds();
				let hs = time.getMilliseconds();
				return y + "-" + m + "-" + d + " " + h + ":" + f + ":" + s + " " + hs;
			}
		}
	};
</script>
<style lang='scss' scoped>
	.behavior-info {
		height: 100%;
		.top {
			height: 50%;
			.accordion-top {
				height: 100%;
				/*overflow-y: auto;*/
				position: relative;
				.accordion {
					top: 0 !important;
				}
				.accordion-input {
					width: 180px;
				}
			}
		}
		.input-field {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 20px;
			color: #999999;
			font-size: 12px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.behavior-intypes {
			position: absolute;
			width: 200px;
			min-height: 30px;
			border-bottom: 1px solid #e4e7ed;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			align-items: center;
			justify-content: flex-start;
			span {
				display: inline-block;
				width: 60px;
				height: 25px;
				text-align: center;
				line-height: 25px;
				font-size: 12px;
				color: red;
				color: #409eff;
				background: #ecf5ff;
				border: 1px solid #b3d8ff;
				border-radius: 5px;
				margin-right: 6px;
				margin-bottom: 2px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
		.notEdit {
			height: 100%;
		}
		.down {
			position: relative;
			height: 50%;
			padding-top: 35px;
			/*border-top: 1px solid #e1e3e6;*/
			.right-objtype-save {
				position: absolute;
				top: 4px;
				left: 0;
				right: 0;
				height: 26px;
				text-align: center;
				line-height: 26px;
				font-size: 14px;
				color: #4588e6;
				padding-bottom: 4px;
				/*border-bottom: 1px solid #e1e3e6;*/
				span {
					float: right;
					margin-right: 20px;
					height: 20px;
					line-height: 20px;
					padding: 0 10px;
					border-radius: 5px;
					border: 1px solid #4588e6;
					cursor: pointer;
					transition: all 0.2s linear;
					&:hover {
						background: #4588e6;
						color: #ffffff;
					}
				}
			}
			.drag-in {
				float: left;
				width: 80%;
				height: 40px;
				margin: 0 auto;
				margin-left: 10%;
				border-radius: 5px;
				border: 2px dashed #e1e3e6;
				color: #4588e6;
				line-height: 35px;
				text-align: center;
				font-size: 16px;
				cursor: pointer;
			}
			.accordion-down {
				margin-top: 44px;
				/*border-top: 1px solid #e1e3e6;
				overflow-y: auto;
				height: 85%;*/
				height: calc(100% - 44px);
				.collapse {
					position: relative !important;
					overflow-y: visible !important;
					top: 0 !important;
					.draggable {
						.li {
							position: relative;
							overflow: hidden;
							.title {
								position: absolute;
								top: 6px;
								left: 13px;
								background: #f5f7fa;
								padding: 7px 0;
								span {
									display: inline-block;
									height: 20px;
									line-height: 16px;
									font-size: 14px;
									font-weight: bold;
									color: #4588e6;
									text-align: center;
									border: 2px solid #4588e6;
									border-radius: 50px;
								}
							}
							.del {
								position: absolute;
								top: 10px;
								right: 30px;
								i {
									color: #F56C6C;
									cursor: pointer;
								}
							}
							.step-li {
								.accordion-input {
									width: 180px;
								}
							}
						}
					}
				}
			}
		}
	}
</style>
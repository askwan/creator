<template>
	<drag-content :childName="childName" :childValue="childValue" :item="item" class="drag-content">
		<div id='objectQuery' class="object-query">
			<div class="class-template-head cle">
				<div class="class-template-head-left">
				<!--<div class="class-template-head-left" v-if="computedCurWinObj || ifEdit">-->
					<el-checkbox v-model="curWindowObj" @change="curWindowObjFn">当前窗口对象</el-checkbox>
				</div>
				<div class="tem cle">
					<el-button slot="append" icon="el-icon-search" @click="startSearch" class="btn"></el-button>
					<el-input placeholder="根据otype名称搜索" v-model="searchOtypeVal" @input="searchInputFn" class="search"></el-input>
					<el-input placeholder="根据对象名称搜索" v-model="searchNameVal" @input="searchInputFn" class="search"></el-input>
				</div>
			</div>

			<div class="h-list-box h-change-wrap" ref="boxScroll" v-if="!loading">
				<div class="class-lists">
					<ul class="h-list" v-if="lists&&lists.length">
						<li v-for="(item,index) in lists" :key="index" v-drag="{data:item,id:'object'}">
							<div class="class-detail" @click="showDetail(item,index)">
								<div class="class-img">
									<img :src="ImageManage.getImgUrl(item.icon)" v-if="item.icon" />
									<span v-else-if="item.name">{{item.name|initialName}}</span>
									<span v-else>null</span>
								</div>
								<div class="class-content">
									<span>name: {{item.name}}</span>
									<p class="bn-details" :title="item.des">otype: {{item.otype.name}}</p>
								</div>
								<div class="object-delete" @click.prevent.stop="deleteObject(item,index)">
									<span>删除</span>
								</div>
								<div class="h-list-center h-tags-box">
									<span>属性：
										<template v-if="item.attributes&&item.attributes.length">
											<i v-for="(attributes,f) in item.attributes" :key="f">{{attributes.name}}<em v-if="f!=item.attributes.length-1">,</em></i>
										</template>
										<!--<template v-else>
											<i>暂无</i>
										</template>-->
									</span>
									<span>formId：
										<template v-if="item.forms&&item.forms.length">
											<i v-for="(form,k) in item.forms" :key="k">{{form.id}}<em v-if="k!=item.forms.length-1">,</em></i>
										</template>
										<!--<template v-else>
											<i>暂无</i>
										</template>-->
									</span>
									<span>from：
										<template v-if="item.from">
											<i>{{item.from}}</i>
										</template>
										<!--<template v-else>
											<i>暂无</i>
										</template>-->
									</span>
								</div>
								<div class="h-user-name">
									<div class="name">
										<span>versionId: {{item.version.vid?item.version.vid:'未知版本'}}</span>
									</div>
									<div class="time">
										<i v-if="item.realTime">{{common.TimeShift(item.realTime)}}</i>
										<!--<i v-else>暂无</i>-->
									</div>
								</div>
							</div>
						</li>
					</ul>
					<no-data-model value="暂无对象" v-else/>
				</div>
			</div>
			<div v-else>
				<loading></loading>
			</div>
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.currentPage" :page-sizes="page.pageSizeArr" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.total">
			</el-pagination>
		</div>
	</drag-content>
</template>

<script>
	import psde from "@/psde";
	import common from "@/script/common";
	import ImageManage from "@/psde/ImageManage";
	import { tabManage } from "@/components/designer/tabmanage";
	import objectService from "@/request/object.service.js";
	import { oTypeCtrl } from "@/views/objectInstant/right/tabs/oTypeCtrl";
	import { vm, operate } from "@/script/operate";
	
	import EditManage from "@/script/mapbox/EditManage";
	import { mapboxMap } from "../../../../script/mapbox/map";
	
	//删除多余对象时用到了下面这两个
	import { psdeApi, apiConfig } from '@/psde/config';

	export default {
		data() {
			return {
				common,
				otype: new psde.OType(),
				ImageManage,
				currentItem: {},
				lists: [],
				item: tabManage.getItemById("objectQuery"),
				searchNameVal: "",
				searchOtypeVal: "",

				page: {
					currentPage: 1,
					pageNum: 1,
					pageSize: 20,
					pageSizeArr: [4, 20, 40],
					total: 0
				},
				loading: false,
				times: "",
				curWindowObj: false,
				ifEdit:false
			};
		},
		components: {
			"no-data-model": () => import("@/components/noDataModel")
		},
		props: ["childName", "childValue"],
		mounted() {
			this.listenEvent();
		},
		filters: {
			initialName(str) {
				if(str.length > 1) {
					return str.slice(0, 2).toUpperCase();
				} else {
					return str.toUpperCase();
				}
			}
		},
		computed: {
			computedCurWinObj(){
				if (EditManage.getGeometryEdit()) {
					return EditManage.getGeometryEdit().isEdit();
				} else{
					return false;
				}
			}
		},
		destroyed(){
			//移除事件，否者会重复执行
			vm.$off(operate.relationSearchObject);
		},
		methods: {
			listenEvent(){
				var value = true;
				
				vm.$on(operate.generalEdit , (data) => {
					this.ifEdit = data.status;
					if (!this.ifEdit) {
						this.startSearch();
					}
				});
				//在树上删除对象节点的时候同步删除对象列表中的当前对象
				vm.$on(operate.deleteTreeNode , (data) => {
					//this.lists = this.lists.filter(node => node.id!=data.id);
					var findIndex = this.lists.findIndex(item => item.id==data.id);
					if (findIndex > -1) {
						this.lists.splice(findIndex , 1);
						this.page.total = this.page.total - 1;
					}
				});
				//添加对象关系的时候只选择与当前对象有关系的对象
				vm.$on(operate.relationSearchObject , (obj) => {
					value = false;
					this.searchNameVal = "";
					this.searchOtypeVal = obj.data;
					this.startSearch();
				});
				
				setTimeout(() => {
					if (value) {
						this.requestMore();
					}
				},200)
			},
			curWindowObjFn(){
				setTimeout(() => {
					if (this.curWindowObj) {
						this.lists = EditManage.getGeometryEdit().sobjectlist;
						this.page.total = this.lists.length;
						this.searchNameVal = "";
						this.searchOtypeVal = "";
						this.page.pageNum = 1;
						this.page.pageSize = 20;
					} else{
						this.startSearch();
					}
				}, 1000)
			},
			searchInputFn() {
				clearTimeout(this.times);
				this.times = setTimeout(() => {
					this.startSearch();
				}, 1000);
			},
			handleSizeChange(val) {
				this.page.pageSize = val;
				this.requestMore();
			},
			handleCurrentChange(val) {
				this.page.pageNum = val;
				this.requestMore();
			},
			startSearch() {
				this.page.pageNum = 1;
				this.page.pageSize = 20;
				this.requestMore();
			},
			requestMore() {
				this.lists = [];
				this.loading = true;
				var obj = {
					names: this.searchNameVal,
					otNames: this.searchOtypeVal,
					pageNum: this.page.pageNum,
					pageSize: this.page.pageSize
				};

				psde.objectQuery.ByNameAndOTName.query(obj).then(response => {
					this.loading = false;
					this.lists = response.list;
					this.page.total = response.total;
				});
			},
			showDetail(item, index) {
				//记录当前点击item，以便于修改后同步更新，这是点击对象在右边查看详情的时候才能用得到
				/*this.currentItem = item;
				psde.objectQuery.getDetailById.query({
					ids: item.id
				}).then(response => {
					vm.$emit(operate.changeSlider, {
						hideRight: false
					});
					vm.$emit(operate.currentObject, response.list[0]);
				});*/
			},
			deleteObject(item,index){
				let sobj = new psde.SObject();
				sobj.copyObject(item);
				sobj.deleteObject();
				var arr = [];
				arr.push(sobj);
				psdeApi.post(`/object/saveObject?token=${common.getItem("token")}`, arr).then(res => {
			    	if (res.data.status == 200) {
			    		vm.$emit(operate.deleteTreeNode , item);
			    		EditManage.getGeometryEdit().osmContent.flush();
//			    		EditManage.reset();
			    		console.log(item , "删除对象成功");
			    	}
			    })
			},
			
		}
	};
</script>

<style scoped lang="less">
		@transition : all .3s linear 0s;
	.object-query {
		position: absolute;
		height: 100%;
		width: 100%;
		background-color: #ffffff;
		.class-template-head-left{
			display: inline-block;
    		margin-top: 5px;
    		margin-left: 20px;
		}
		/*.object-query-head {
			width: calc(~"100% - 100px");
			box-sizing: content-box;
			margin: 15px 0 5px 50px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			div:nth-child(1),
			div:nth-child(2) {
			    width: calc(~"50% - 50px");
			    display: flex;
			    flex-direction: row;
			    flex-wrap: nowrap;
			    align-items: center;
			    color: #666666;
			    font-size: 14px;
			    border-bottom: 1px solid #ccc;
			    span {
			    	min-width: 55px;
			    	margin-left: 20px;
			    }
				input {
			    	border: 0;
			        outline: 0;
			        background: #ffffff;
			    }
			}
			div:nth-child(3) {
			    width: 80px;
			    margin-left: 20px;
			    height: 30px;
			    cursor: pointer;
			    display: flex;
			    justify-content: center;
			    align-items: center;
			    color: #409eff;
			    background: #ecf5ff;
			    border: 1px solid #b3d8ff;
			    font-size: 14px;
			    border-radius: 5px;
			}
			    div:nth-child(3):hover {
				    background: #409eff;
				    border-color: #409eff;
				    color: #fff;
				}
			}*/
		}
		.class-lists ul li {
			position: relative;
			display: inline-block;
			height: 178px;
			box-sizing: border-box;
			border: 2px solid #edeff2;
		}
		.object-query .object-delete{
			position: absolute;
		    top: 100px;
		    right: 10px;
		    height: 25px;
		    width: 50px;
	        color: #67c23a;
		    background: #f0f9eb;
		    border: 1px solid #c2e7b0;
		    border-radius: 5px;
		    display: flex;
		    justify-content: center;
		    align-items: center;
		    z-index: 10;
		}
		.object-query .object-delete:hover {
			color: #fff;
		    background: #67c23a;
		    border: 1px solid #67c23a;
		}
</style>
<template>
	<div class="relation-list">
		<div class="relation-head">
			<i class="iconfont icon-shangyibu1" title="返回上一步" @click="backStep"></i>
			<span>选择关系类型</span>
		</div>
		<div class="h-list-box h-change-wrap relation-style">
			<ul class="h-list list-style" v-if="relationList&&relationList.length">
				<li v-for="(relation,i) in relationList" :key="i" v-drag="{data:relation,id:'relation'}" @click="openRelationObject(relation)">
					<div>
						<span class="r-initial">{{relation.name|initialName}}</span>
					</div>
					<div>
						<p class="text-ellipsis" :title="relation.name">{{relation.name}}</p>
						<!--<p>映射：
							<span v-if="showName(relation.mappingType)">{{showName(relation.mappingType)}}</span>
							<span v-else>无</span> &#X3000;
							<span v-if="relation.model&&relation.model.name">行为：{{relation.model.name}}</span>
							<span v-else>行为：暂无</span>
						</p>
						<p class="text-ellipsis" :title="toName(relation.fields.fields)" v-if="relation.fields.fields&&relation.fields.fields.length">字段：{{relation.fields.fields|toName}}</p>
						<p class="text-ellipsis" v-else>字段：暂无</p>-->
					</div>
					
					<div class="h-tags-box">
						<el-tooltip effect="dark" :content="'映射：'+showName(relation.mappingType)" placement="bottom" v-if="showName(relation.mappingType)">
							<span class="h-tags h-tags-blue">{{showName(relation.mappingType)}}</span>
					    </el-tooltip>
					    <el-tooltip effect="dark" :content="'行为：'+relation.model.name" placement="bottom" v-if="relation.model&&relation.model.name">
							<span class="h-tags h-tags-yellow">{{relation.model.name}}</span>
					    </el-tooltip>
					    <el-tooltip effect="dark" :content="'字段：'+toName(relation.fields.fields)" placement="bottom" v-if="typeof relation.fields=='object'&&relation.fields.fields&&relation.fields.fields.length">
							<span class="h-tags h-tags-green">{{relation.fields.fields|toGetName}}</span>
					    </el-tooltip>
					</div>
				</li>
			</ul>
			<no-data-model value="暂无关系" v-else/>
		</div>
	</div>
</template>
<script>
	import psde from "@/psde";
	import ImageManage from "@/psde/ImageManage";
	import * as allotypemgr from "@/script/allOtype";
	import { vm, operate,manager } from "@/script/operate";
	export default {
		data() {
			return {
				ImageManage: ImageManage,
				otypeDetail: {},
				relationList: [],
				typeList: [],
				dict: new psde.GetDict(),
			}
		},
		props: ["objectDetail"],
		components: {
			"no-data-model": () => import("@/components/noDataModel")
		},
		watch: {
			objectDetail(val) {
				this.addRelationOtype(val);
			}
		},
		filters: {
			toGetName(arr) {
				let str = "";
				if(arr) {
					arr.forEach((item, index) => {
						if(index == arr.length - 1) {
							str += item.caption;
						} else {
							str += item.caption;
							str += "，";
						}
					})
				}
				return str;
			},
			initialName(str){
				if(typeof str !='string') return 'null'
				if(str.length) {
					return str.slice(0,2).toUpperCase();
				} else {
					return str.toUpperCase();
				}
			}
		},
		mounted() {
			this.listenEvent();
		},
		activated() {
			this.listenEvent();
			this.initData();
		},
		methods: {
			listenEvent(){
				// vm.$on('currentSobject',obj=>{
					
				// })
			},
			initData() {
				var val = this.objectDetail;
				this.addRelationOtype(val);
				
				this.dict.query(null, "relation").then(res => {
					this.typeList = res;
				})
				
			},
			addRelationOtype(val) {
				console.log(val,'ffffffffff')
				if(val.otype && val.otype.id) {
					//根据对象otypeid，获取对象关系列表
					this.otypeDetail = allotypemgr.getOtypeById(val.otype.id);
				}
				this.relationList = [];
				if(this.otypeDetail.connectors && this.otypeDetail.connectors.connectors && this.otypeDetail.connectors.connectors.length > 0) {
					this.otypeDetail.connectors.connectors.forEach((item, index) => {
						if(item.relation && item.relation.id) {
							if(this.relationList.length > 0) {
								var findIndex = this.relationList.findIndex(it => it.id == item.relation.id);
								if(findIndex == -1) {
									this.relationList.push(item.relation);
								}
							} else {
								this.relationList.push(item.relation);
							}
						}
					})
				}
			},
			showName(val) {
				try {
					if(val && val != "") {
						var type = this.typeList.find(item => item.value == val);
						return type.name
					}
				} catch(e) {
					//TODO handle the exception
				}
			},
			toName(arr) {
				let str = "";
				if(arr) {
					arr.forEach((item, index) => {
						if(index == arr.length - 1) {
							str += item.caption;
						} else {
							str += item.caption;
							str += ".";
						}
					})
				}
				return str;
			},
			backStep(){
				// this.$emit("openRelationInfo");
				vm.$emit(operate.currentComp,{name:'objectContent'});
			},
			openRelationObject(data){
				// this.$emit("openRelationObject" , data);
				console.log(data,'dfata')
				manager.currentRelation(data);
				vm.$emit(operate.currentComp,{name:'relationObject'})
			}
			
		},
		destroyed() {
			vm.$off(['currentSobject'])
		},
	}
</script>
<style scoped lang="less">
	@transition : all .3s linear 0s;
	.relation-list {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: #FFFFFF;
	}
	.relation-head{
		position: absolute;
	    top: 0;
	    left: 0;
	    right: 0;
	    height: 40px;
	    border-bottom: 1px solid #f1f1f1;
	    display: flex;
	    flex-direction: row;
	    justify-content: space-between;
	    line-height: 40px;
	    color: #666666;
	    padding: 0 30px;
	    i{
	    	font-size: 20px;
	    	cursor: pointer;
	    }
	    i:hover{
	    	color: #176de6;
	    }
	    span{
	    	font-size: 14px;
	    }
	}
	.relation-style{
		position: absolute;
	    top: 50px;
	    left: 0;
	    right: 0;
	    bottom: 0;
		.list-style {
			margin: 0;
			padding-left: 10px;
			li {
				position: relative;
				height: 105px;
				width: 250px;
				vertical-align: middle;
				>div:nth-of-type(1) {
					margin: 13px;
					width: 50px;
					height: 50px;
					border-radius: 5px;
					background-color: #b2d2ff;
					color: #fff;
					font-size: 14px;
					line-height: 50px;
					text-align: center;
					.r-initial{
						font-size: 14px;
						color: #FFFFFF;
					}
				}
				>div:nth-of-type(2) {
					position: absolute;
					left: 72px;
					right: 20px;
					top: 13px;
					height: 50px;
					p:nth-of-type(1) {
						color: #333;
						font-size: 14px;
					}
					p:nth-of-type(2),
					p:nth-of-type(3) {
						color: #999;
						font-size: 12px;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
					}
				}
			}
		}
	}
</style>
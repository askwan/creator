<template>
	<div class="diagram-otype-list">
		<div class="search-header">
			<common-search-bar @startSearch="searchList" :searchValue="searchValue"></common-search-bar>
		</div>
		<div class="diagram-otype-content" v-if="filterDiagrams && filterDiagrams.length>0">


			<div class="otype-content margin" v-if="hotFilterDiagram.length>0">
				<div class="otype-list" v-for="(it,ix) in hotFilterDiagram" :key="ix" @click="openOtype(it,ix)">
					<div class="otype-image">
						<img v-if="it.icon" :src="ImageManage.getImgUrl(it.icon)" :onerror="errorOtypeImg" alt="加载失败" />
						<span v-else>{{it.name|initialName}}</span>
					</div>
					<div class="otype-title">
						<span>{{it.name}}</span>
					</div>
					<div class="otype-btn" v-if="it.formStyles && it.formStyles.styles && it.formStyles.styles.length>0">
						<div class="otype-button">
							<span v-for="(m,n) in it.formStyles.styles" :key="n" :title="getName(m.type)" @click.prevent.stop="addObject(m,it)">
								<i v-if="m.type==21" class="iconfont icon-dian"></i>
								<i v-if="m.type==22" class="iconfont icon-xian1"></i>
								<i v-if="m.type==23" class="iconfont icon-mian1"></i>
								<i v-if="m.type==31" class="iconfont icon-yuedengyu"></i>
								<span v-if="m.type==32">Dem</span>
								<span v-if="m.type==33">Tin</span>
								<i v-if="m.type==40" class="iconfont icon-bim"></i>
								<i v-if="m.type==50" class="iconfont icon-ic_d_rotation"></i>
								<i v-if="m.type==61" class="iconfont icon-ganlanqiu"></i>
							</span>
						</div>
					</div>
				</div>
			</div>

			<div class="diagram-content" v-if="searchValue.length==0">
				<span class="diagram-top-line"></span>
				<div class="diagram-detail" @click="pathTo">
					<div class="diagram-image">
						<span>几何</span>
					</div>
					<div class="diagram-title">
						<i class="iconfont icon-youjiantou"></i>
						<span>复合多边形</span>
					</div>
				</div>
			</div>

			



			<div class="diagram-content" v-if="showDiagramList" v-for="(item,index) in filterDiagrams" :key="index">
				<span class="diagram-top-line"></span>
				<div class="diagram-detail" @click="openDiagram(item,index)">
					<div class="diagram-image">
						<img v-if="item.icon" :src="ImageManage.getImgUrl(item.icon)" :onerror="errorDiagramImg" alt="加载失败" />
						<span v-else>{{item.name|initialName}}</span>
					</div>
					<div class="diagram-title">
						<i class="iconfont" :class="{'icon-youjiantou':!(currentDiagram==item.id),'icon-icon1':currentDiagram==item.id}"></i>
						<span>{{item.name}}</span>
					</div>
				</div>
				<div class="otype-transition">
					<transition name="fade">
						<div class="otype-content" v-if="item.otypes && item.otypes.length>0 && currentDiagram==item.id">
							<i class="iconfont icon-shouqi-copy"></i>
							<div class="otype-list" v-for="(it,ix) in item.otypes" :key="ix" @click="openOtype(it,ix)">
								<div class="otype-image">
									<img v-if="it.icon" :src="ImageManage.getImgUrl(it.icon)" :onerror="errorOtypeImg" alt="加载失败" />
									<span v-else>{{it.name|initialName}}</span>
								</div>
								<div class="otype-title">
									<span>{{it.name}}</span>
								</div>
								<div class="otype-btn" v-if="it.formStyles && it.formStyles.styles && it.formStyles.styles.length>0">
									<div class="otype-button">
										<span v-for="(m,n) in it.formStyles.styles" :key="n" :title="getName(m.type)" @click.prevent.stop="addObject(m,it)">
											<i v-if="m.type==21" class="iconfont icon-dian"></i>
											<i v-if="m.type==22" class="iconfont icon-xian1"></i>
											<i v-if="m.type==23" class="iconfont icon-mian1"></i>
											<i v-if="m.type==31" class="iconfont icon-yuedengyu"></i>
											<span v-if="m.type==32">Dem</span>
											<span v-if="m.type==33">Tin</span>
											<i v-if="m.type==40" class="iconfont icon-bim"></i>
											<i v-if="m.type==50" class="iconfont icon-ic_d_rotation"></i>
											<i v-if="m.type==61" class="iconfont icon-ganlanqiu"></i>
										</span>
									</div>
								</div>
							</div>
						</div>
					</transition>
				</div>
			</div>


			<div class="otype-content" v-if="searchOtypeList.length>0 && !showDiagramList">
				<div class="otype-list" v-for="(it,ix) in searchOtypeList" :key="ix" @click="openOtype(it,ix)">
					<div class="otype-image">
						<img v-if="it.icon" :src="ImageManage.getImgUrl(it.icon)" :onerror="errorOtypeImg" alt="加载失败" />
						<span v-else>{{it.name|initialName}}</span>
					</div>
					<div class="otype-title">
						<span>{{it.name}}</span>
					</div>
					<div class="otype-btn" v-if="it.formStyles && it.formStyles.styles && it.formStyles.styles.length>0">
						<div class="otype-button">
							<span v-for="(m,n) in it.formStyles.styles" :key="n" :title="getName(m.type)" @click.prevent.stop="addObject(m,it)">
								<i v-if="m.type==21" class="iconfont icon-dian"></i>
								<i v-if="m.type==22" class="iconfont icon-xian1"></i>
								<i v-if="m.type==23" class="iconfont icon-mian1"></i>
								<i v-if="m.type==31" class="iconfont icon-yuedengyu"></i>
								<span v-if="m.type==32">Dem</span>
								<span v-if="m.type==33">Tin</span>
								<i v-if="m.type==40" class="iconfont icon-bim"></i>
								<i v-if="m.type==50" class="iconfont icon-ic_d_rotation"></i>
								<i v-if="m.type==61" class="iconfont icon-ganlanqiu"></i>
							</span>
						</div>
					</div>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
	import psde from "@/psde";
	import common from "@/script/common";
	import ImageManage from "@/psde/ImageManage";
	import EditManage from "@/script/mapbox/EditManage";
	import { getOtypeById,allOtype } from "@/script/allOtype";
	import { vm, operate } from "@/script/operate";

	import IdEdit from "@/script/id_edit/IdEdit";

	export default {
		data() {
			return {
				ImageManage: ImageManage,
				errorDiagramImg: 'this.src="' + require("../../../../../static/images/errorDiagram.jpg") + '"',
				errorOtypeImg: 'this.src="' + require("../../../../../static/images/errorOtype.jpg") + '"',
				lists: [],
				searchValue: "",
				copyDiagramList: [],
				currentDiagram: 0,
				type: 0,
				entityId: "",
				getDict: new psde.GetDict(),
				searchOtypeList: [],
				showDiagramList: true,
				formList: [],
				diagrams:[],
				hotOtypes:[]
			};
		},
		props: [ "entityObj"],
		components: {
			"common-search-bar": () => import("@/components/common/searchBar/searchBar")
		},
		computed: {
			filterDiagrams() {
				var str = JSON.stringify(this.diagrams);
				this.copyDiagramList = JSON.parse(str);
				let type = this.type;
				//if(type==0 || type==undefined) return this.copyDiagramList;
				if(type == 0 || type == undefined) return [];
				let arr = this.copyDiagramList.filter((diagram, i, copyDiagramList) => {
					if(diagram.otypes.length == 0) {
						return false;
					}
					diagram.otypes = diagram.otypes.filter(otype => {
						if(otype.formStyles.styles.length == 0) {
							return false;
						}
						otype.formStyles.styles = otype.formStyles.styles.filter(style => {
							if(
								style.positions &&
								style.positions.length > 0 &&
								style.type != 11 &&
								style.type != 12 &&
								style.type != 13
							) {
								return style.positions[0] == type;
							} else {
								return false;
							}
							//return style.type == type;
						});
						return otype.formStyles.styles.length > 0;
					});
					return diagram.otypes.length > 0;
				});
				// console.log(arr,'arr')
				return arr;
			},
			hotFilterDiagram(){
				return this.hotOtypes.filter(el=>{
					el.formStyles = el.formStyles || []
					let index = el.formStyles.styles.findIndex(ev=>ev.type==this.type);
					if(index>-1) return true
				})
			}
		},
		watch: {
			diagrams(val) {
				
			},
			entityObj(obj){
				this.showDiagramList = true;
				this.searchValue = "";

				this.type = obj.type;
				this.entityId = obj.entityId;
				this.$emit("enterDetail", true);
			}
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
		mounted() {
			this.listenEvent();
			// console.log(common.getInfo('id'))
			// this.diagrams = allOtype.userDiagram(common.getInfo('id'));
			// console.log(this.diagrams,'diagrams')
		},
		methods: {
			listenEvent() {
				this.getDict.query({}, "form").then(res => {
					this.formList = res;
				});
				vm.$on('readyDiagram',(list)=>{
					this.diagrams = allOtype.userDiagram(common.getInfo('id'));
				})
			},
			getName(data) {
				var find = this.formList.find(item => item.value == data);
				if(find) {
					return find.name;
				} else {
					return data;
				}
			},
			searchList(data) {
				this.searchValue = data;
				if(this.searchValue.length > 0) {
					if(this.filterDiagrams && this.filterDiagrams.length > 0) {
						this.showDiagramList = false;
						var otypesList = [];
						var listStr = JSON.stringify(this.filterDiagrams);
						var diagramList = JSON.parse(listStr);
						diagramList.forEach(diagram => {
							if(diagram.otypes.length > 0) {
								diagram.otypes.forEach(otype => {
									var findIndex = otypesList.findIndex(
										item => item.id == otype.id
									);
									if(findIndex == -1) {
										otypesList.push(otype);
									}
								});
							}
						});
						var str = JSON.stringify(otypesList);
						var arr = JSON.parse(str);
						this.searchOtypeList = arr.filter(otype => {
							return( otype.name.includes(this.searchValue) || String(otype.id).includes(this.searchValue) );
						});
					}
				} else {
					this.showDiagramList = true;
				}
				console.log(this.searchOtypeList, this.searchValue.length, "过滤成功");
			},
			openDiagram(item, index) {
				if(this.currentDiagram == item.id) {
					this.currentDiagram = 0;
				} else {
					this.currentDiagram = item.id;
				}
			},
			openOtype(it, ix) {
				/*this.$message({
					message: "请从右边选择具体的类型新建！",
					type: "warning",
					showClose: true
				});*/
			},
			addObject(m, it) {
				this.addHot(it);
				//let style = otype.formStyles.styles[0];
				let fromtype = m.type;
				let geotype = m.positions[0];
				let otype = getOtypeById(it.id);

				if(IdEdit.osmContent.entity(this.entityId).type=='relation') geotype = 24;

				// return 
				IdEdit.createSobject(this.entityId, otype, fromtype, geotype);
				this.currentDiagram = null;
				this.$emit("enterDetail", false);
			},
			pathTo(){
				vm.$emit('toRelation');
			},
			addHot(otype){
				let index = this.hotOtypes.findIndex(el=>el.id==otype.id);
				if(index>-1){
					this.hotOtypes.splice(index,1);
				}else{
					}
				this.hotOtypes.unshift(otype);
			}
		}
	};
</script>

<style scoped lang="less">
	.fade-enter-active,
	.fade-leave-active {
		transition: all 0.3s linear 0s;
	}
	
	.fade-enter,
	.fade-leave-to {
		transform: translateY(-100%);
		opacity: 0;
	}
	
	@radius: 2px;
	@transition : all 2s linear 0s;
	.diagram-otype-list {
		position: absolute;
		right: 0;
		left: 0;
		top: 0;
		bottom: 0;
		.search-header {
			margin: 10px;
			border: 1px solid #dcdfe6;
		}
		.diagram-otype-content {
			position: absolute;
			top: 60px;
			left: 0;
			right: 0;
			bottom: 0;
			/*display: flex;
			flex-direction: column;
			justify-content: flex-start;
			align-items: center;*/
			overflow-x: hidden;
			overflow-y: auto;
			.diagram-content {
				margin-top: -10px;
				.diagram-top-line {
					width: 266px;
					height: 3px;
					border-radius: 2px;
					border: 1px solid #ccc;
					display: inline-block;
					margin-left: 12px;
					position: relative;
					top: 3px;
					box-shadow: 0px 1px 5px #ccc;
				}
				.diagram-detail {
					display: block;
					width: 270px;
					height: 60px;
					margin-left: 10px;
					border: 1px solid #ccc;
					border-radius: @radius;
					background: #f6f6f6;
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					cursor: pointer;
					.diagram-image {
						display: inline-block;
						width: 60px;
						height: 58px;
						border-radius: @radius;
						img {
							background-color: #ffffff;
							width: 100%;
							height: 100%;
							background-position: center center;
							background-repeat: no-repeat;
							border-radius: @radius;
						}
						span {
							width: 100%;
							height: 100%;
							border-radius: @radius;
							background-color: #b2d2ff;
							display: flex;
							align-items: center;
							justify-content: center;
							font-size: 16px;
							color: #ffffff;
						}
					}
					.diagram-title {
						display: inline-block;
						width: 210px;
						height: 58px;
						border-left: 1px solid #ccc;
						display: flex;
						flex-direction: row;
						justify-content: flex-start;
						align-items: center;
						i {
							font-size: 16px;
							color: #333;
							font-weight: bold;
							margin-left: 5px;
						}
						span {
							font-size: 12px;
							color: #606266;
							font-weight: 500;
							margin-left: 5px;
						}
					}
				}
				.diagram-detail:hover {
					box-shadow: 0px 0px 10px #ccc;
					background: #ffffff;
				}
			}
			.otype-transition {
				position: relative;
				overflow: hidden;
				padding-top: 10px;
			}
			.otype-content {
				display: block;
				width: 270px;
				background: #f4f4f5;
				margin-left: 10px;
				border-radius: 5px;
				>i {
					font-size: 20px;
					color: #ececec;
					position: absolute;
					top: -12px;
					left: 130px;
				}
				.otype-list {
					display: block;
					width: 250px;
					height: 60px;
					margin-left: 10px;
					margin-bottom: 10px;
					border: 1px solid #d3d4d6;
					border-radius: @radius;
					background: #fff;
					display: flex;
					flex-direction: row;
					justify-content: flex-start;
					align-items: center;
					cursor: pointer;
					.otype-image {
						display: inline-block;
						width: 60px;
						height: 58px;
						border-radius: @radius;
						img {
							background-color: #ffffff;
							width: 50px;
							height: 50px;
							margin-left: 5px;
							margin-top: 4px;
							background-position: center center;
							background-repeat: no-repeat;
							border-radius: @radius;
						}
						span {
							width: 50px;
							height: 50px;
							margin-left: 5px;
							margin-top: 4px;
							border-radius: @radius;
							background: #b2d2ff;
							display: flex;
							align-items: center;
							justify-content: center;
							font-size: 16px;
							color: #ffffff;
						}
					}
					.otype-title {
						display: inline-block;
						width: 100px;
						height: 58px;
						/*border-left: 1px solid #ccc;*/
						display: flex;
						flex-direction: row;
						justify-content: flex-start;
						align-items: center;
						span {
							width: 95px;
							font-size: 12px;
							color: #606266;
							font-weight: 500;
							margin-left: 5px;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
					}
					.otype-btn {
						display: inline-block;
						width: 90px;
						height: 58px;
						/*border-left: 1px solid #ccc;*/
						.otype-button {
							width: 90px;
							height: 58px;
							display: flex;
							flex-direction: row;
							flex-wrap: wrap;
							justify-content: flex-start;
							align-items: center;
							overflow: hidden;
							>span {
								width: 40px;
								height: 25px;
								margin-left: 3px;
								margin-top: 2.5px;
								border-radius: 5px;
								text-align: center;
								line-height: 25px;
								font-size: 12px;
								border: 1px solid #ccc;
								background: #f4f4f5;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
								i {
									font-size: 20px;
								}
								span {
									font-size: 12px;
								}
							}
						}
					}
				}
			}
		}
	}
	.margin{
		margin: 20px 0;
	}
</style>
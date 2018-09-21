<template>
	<div class="mapbox">
		<div id='mapbox'></div>
		<ul class="tool" v-show="generalEdit">
			<li class="btn" v-for="(btn,i) in toolList" :key="i" @click="operate(btn)">

				<el-tooltip transition="none" effect="light" :content="btn.tip" placement="bottom">
					<i class="iconfont" :class="btn.icon"></i>
				</el-tooltip>
			</li>

		</ul>
		<tool-panel v-show="generalEdit" :otype="currentOtype"></tool-panel>
	</div>
</template>
<script>
	import { tabManage } from "@/components/designer/tabmanage";
	import * as btMap from "../../../../script/mapbox/map";
	import { vm, operate } from "@/script/operate";
	import EditManage from "@/script/mapbox/EditManage";
	import toolPanel from "../../left/toolOtype";

	let map;
	export default {
		data() {
			return {
				item: tabManage.getItemById("objectData"),
				posi: {},
				ifEdit: false,
				toolList: [
					// { icon: "icon-shangyibu1", id: "undo", tip: "撤销" },
					// { icon: "icon-xiayibu1", id: "redo", tip: "重做" },
					{
						icon: "icon-chuangjian",
						id: "select",
						tip: "选择"
					},
					{
						icon: "icon-tongyongleiyihuamian",
						id: "wadong",
						tip: "开始挖洞"
					},
					{
						icon: "icon-shitiguanxi",
						id: "relation",
						tip: "添加关系"
					},
					{
						icon: "icon-baocun",
						id: "save",
						tip: "保存"
					}
				],
				choose: "",
				currentOtype: {},
				generalEdit: false,
			};
		},
		props: ["childName", "childValue"],
		components: {
			toolPanel
		},
		mounted() {
			map = btMap.createMapboxMap("mapbox");

			this.listenEvent();
			map.resize();
			this.setPosi();
		},
		methods: {
			setPosi(){
				if(!window._POSITION_) return
				let posi = window._POSITION_;
				map.setCenter(posi.position);
				map.setZoom(posi.zoom);
			},
			listenEvent() {
				vm.$on(operate.ifEdit, obj => {
					this.ifEdit = obj.status;
				});
				vm.$on(operate.changeSlider, obj => {
					setTimeout(() => {
						map.resize();
					}, 500);
				});
				vm.$on("currentOtype", otype => {
					this.currentOtype = otype;
				});
				vm.$on(operate.generalEdit, obj => {
					this.generalEdit = obj.status;
				});
			},
			operate(mode) {
				this.choose = mode.id;

				if(mode.id == "save") {
					// console.log(EditManage.getHistory());
					EditManage.saveEdit();
				} else if(mode.id == "relation") {
					//创建对象关系
					EditManage.createRelation();
				}
			},
		},
		destroyed() {
			// console.log(map.getCenter(),'mapgl');
			let posi = [];

			posi[0] = map.getCenter().lng;
			posi[1] = map.getCenter().lat;
			let sess = {
				position: posi,
				zoom: map.getZoom()
			};
			window.posi = sess;
			sessionStorage.setItem('position',JSON.stringify(sess));
			window._POSITION_ = sess;
		}
	};
</script>
<style scoped lang="less">
	.mapbox {
		position: absolute;
		height: 100%;
		width: 100%;
		.tool {
			position: absolute;
			z-index: 100;
			left: 200px;
			top: 20px;
			display: flex;
			border: 1px solid #f1f1f1;
			border-radius: 5px;
			overflow: hidden;
			background-color: #fff;
			box-shadow: 0 0 3px #666;
			.btn {
				width: 60px;
				height: 40px;
				text-align: center;
				line-height: 40px;
				border-left: 1px solid #f1f1f1;
				cursor: pointer;
				color: #999;
				i {
					display: inline-block;
					width: 100%;
					height: 100%;
				}
			}
			.btn:nth-of-type(1) {
				border-left: none;
			}
			.btn:hover {
				background-color: #f1f1f1;
			}
			.actived {
				background-color: #f1f1f1;
				color: #176de6;
			}
			.activate {
				color: #333;
			}
		}
	}
	
	#mapbox {
		position: absolute;
		height: 100%;
		width: 100%;
		background-color: #ffffff;
		overflow: hidden;
	}
</style>
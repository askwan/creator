<template>
	<div class='root-detail'>
		<keep-alive>
			<component :is="component" :osmData="osmData" :objectDetail="objectDetail" :ifEdit='ifEdit' :diagrams="diagrams"
				@addObjectBehavior="addObjectBehavior"
			></component>
		</keep-alive>

		<!-- <transition name="public">
			<object-content v-show="showList" ref="objectContentRef" :osmData="osmData" :objectDetail="objectDetail" :ifEdit='ifEdit' :diagrams="diagrams" @objectContentEvent="objectContentEvent"></object-content>
		</transition>

		<transition name="public">
			<property-list v-show="propertyShow" :component="component" :ifEdit='ifEdit' :diagrams="diagrams" @enterDetail='enterDetail' :objectDetail="objectDetail"></property-list>
		</transition>

		<transition name="public">
			<relations-tab v-show="relationShow" ref="relationTabRef" :osmData="osmData" :objectDetail="objectDetail" :ifEdit="ifEdit" :diagrams="diagrams" @enterDetail="enterDetail" @addObjectParent="addObjectParent">
			</relations-tab>
		</transition>

		<transition name="public">
			<behavior-list v-show="BehaviorListShow" ref="behaviorListRef" :objectDetail="objectDetail" @addObjectBehavior="addObjectBehavior" @openBehaviorInfo="enterDetail"></behavior-list>
		</transition> -->

		<!-- <relation-operate></relation-operate> -->
		
	</div>
</template>

<script>
	import { vm, operate } from "@/script/operate";
	import ss from './tabs/objectContent'
	export default {
		data() {
			return {
				showList: false, //是否显示对象详情
				propertyShow: true, //是否显示otype列表与对象列表,就是点击空白地图时显示的内容
				relationShow: false, //是否显示关系切换tab页
				BehaviorListShow: false, //行为列表页
			};
		},
		props: {
			component: {
				type:String,
				default:'relationOperate'
			},
			osmData: Object,
			ifEdit: Boolean,
			objectDetail: Object,
			diagrams: Array
		},
		components: {
			objectContent: () => import("./tabs/objectContent"),
			propertyList: () => import("./tabs/propertyList"),
			propertyObject:()=>import('./tabs/propertyObject'),
			relationsTab: () => import("./tabs/relationsTab"),
			behaviorList: () => import("./tabs/behaviorList"),
			// relationOperate:()=>import('./tabs/relationOperate'),
			relationParentObject:()=>import('./tabs/relationParentObject'),
			relationList:()=>import('./tabs/relationList'),
			relationOperate:()=>import('./tabs/relationTab'),
			relationObject:()=>import('./tabs/relationObject')
		},
		computed: {

		},
		watch: {
			
		},
		mounted() {
			this.listenEvent();
		},
		methods: {
			listenEvent() {
				//键盘点击事件
				document.onkeydown = function(event) {
					var e = event || window.event || arguments.callee.caller.arguments[0];
					if(e && e.keyCode == 27) {
						console.log("点击了esc键")
					}
					if(e && e.ctrlKey && e.keyCode === 83) {
						console.log("你按下了CTRL+S")
						//阻止默认事件
						e.preventDefault();
					}
				}
			},
			//选过类模板之后进入对象编辑页面,查看对象详情,或者返回上一步进入对象详情页面,bool=false
			enterDetail(bool) {
				this.showList = !bool;
				this.propertyShow = bool;
				this.relationShow = bool;
				this.BehaviorListShow = bool;
			},
			//点击空白地图时显示的内容
			enterNull(bool){
				this.showList = !bool;
				this.propertyShow = bool;
				this.relationShow = !bool;
				this.BehaviorListShow = !bool;
			},
			//进入对象列表页面,选择父对象,bool=true
			objectListFn(bool) {
				this.showList = !bool;
				this.propertyShow = !bool;
				this.relationShow = bool;
				this.BehaviorListShow = !bool;
			},
			//进入行为列表页面，添加行为
			behaviorListFn(bool) {
				this.showList = !bool;
				this.propertyShow = !bool;
				this.relationShow = !bool;
				this.BehaviorListShow = bool;
			},
			//添加父对象中间转换
			addObjectParent(obj) {
				this.enterDetail(false);
				setTimeout(() => {
					this.$refs.objectContentRef.addObjectParent(obj);
				}, 10)
			},
			//添加行为中间转换
			addObjectBehavior(obj) {
				// this.enterDetail(false);
				// this.$emit('addObjectBehavior',obj)
				// setTimeout(() => {
				// 	this.$refs.objectContentRef.addObjectBehavior(obj);
				// }, 10)
			},
			//根据类型判断当前显示
			objectContentEvent(obj) {
				if(obj.id == "parent") {
					this.objectListFn(obj.value);
					setTimeout(() => {
						this.$refs.relationTabRef.openParentObject();
					}, 10)
				}
				if(obj.id == "relation") {
					this.objectListFn(obj.value);
					setTimeout(() => {
						this.$refs.relationTabRef.openRelationList();
					}, 10)
				}
				if(obj.id == "behavior") {
					this.behaviorListFn(obj.value);
					setTimeout(() => {
						this.$refs.behaviorListRef.startSearch();
					}, 10)
				}
			},

		}
	};
</script>
<style lang='less' scoped>
	.root-detail {
		position: relative;
		width: 100%;
		height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
	}
</style>
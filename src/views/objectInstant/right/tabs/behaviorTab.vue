<template>
	<div class='behavior-tab' v-if="objectDetail.id">
		<transition name="public">
			<behavior-info v-show="isBehaviorInfo" ref="behaviorInfoRef" :ifEdit="ifEdit" :objectDetail="objectDetail" @openBehaviorList="openBehaviorList"></behavior-info>
		</transition>
		<transition name="public">
			<behavior-list v-show="isBehaviorList" ref="behaviorListRef" :objectDetail="objectDetail" @addObjectBehavior="addObjectBehavior" @openBehaviorInfo="initData"></behavior-list>
		</transition>
	</div>
</template>
<script>
	import behaviorInfo from "./behaviorInfo";
	import behaviorList from "./behaviorList";
	export default {
		data() {
			return {
				isBehaviorInfo: true,
				isBehaviorList: false
			};
		},

		props: ["ifEdit", "objectDetail"],
		components: {
			behaviorInfo,
			behaviorList
		},
		computed: {},
		mounted() {
			this.initData();
		},
		activated() {
			this.initData();
		},

		watch: {
			objectDetail(val) {
				if(val.id) {
					//this.initData();
				}
			}
		},
		methods: {
			initData(){
				this.isBehaviorInfo = true;
				this.isBehaviorList = false;
			},
			addObjectBehavior(item){
				this.initData();
				var obj = {
					data: {
						data: item,
						id: 'behavior'
					}
				}
				setTimeout(() => {
					this.$refs.behaviorInfoRef.dropBehavior(obj);
				},10)
			},
			openBehaviorList(){
				this.isBehaviorInfo = false;
				this.isBehaviorList = true;
				setTimeout(() => {
					this.$refs.behaviorListRef.startSearch();
				},10)
			}
			
		}
	};
</script>
<style lang='less' scoped>
	.behavior-tab{
		/*position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;*/
		overflow: hidden;
		background: #FFFFFF;
		margin-bottom: 20px;
	}
</style>
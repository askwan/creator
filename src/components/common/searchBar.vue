<template>
	<div class="search-one cle" :class="{'active':checkedInput}">
		
		<div class="search-type"  @mouseleave="mouseOut" v-if="typeList.length>0">
			<div class="search-model" @click="show">
				<span>{{currentType.type||"请选择"}}</span>
				<i class="el-icon-caret-bottom"></i>
			</div>
			<div class="select-lists" v-show="typeShow" @mouseover="mouseOver">
				<div v-for="(item,i) in typeList" :key="i" class="select-lists-el" @click="select(item)">{{item.type}}</div>
				<!-- <div class="select-lists-el">dsfsdf</div> -->
			</div>
		</div>
		<div class="search-m">
			<input type="text" v-model="textVal" @blur="checkedInput=false" @focus="checkedInput=true" @input="searchInputFn">
		</div>
		<span class="search-a flex-center">
			<i class="font-18 font-gray" :class="{'el-icon-search':!loading,'el-icon-loading':loading}"></i>
		</span>
	</div>
</template>
<script>
	let showTimer;
	export default {
		data() {
			return {
				textVal: "",
				checkedInput: false,
				typeShow:false,
				// typeList:[{type:'idff'},{type:'全部'},{type:'sfas'},{type:'osg'},{type:'osgb'},{type:'gltf'}],
				currentType:{}
			};
		},
		props: ["searchValue",'loading'],
		props:{
			searchValue:{
				type:String
			},
			loading:{
				type:Boolean
			},
			typeList:{
				type:Array,
				default(){return []}
			}
		},
		watch: {
			searchValue(val) {
				this.textVal = val;
			}
		},
		mounted() {
			this.textVal = this.searchValue;
			if(this.typeList.length>0) this.currentType = this.typeList[0];
		},
		activated() {
			this.textVal = this.searchValue;
			if(this.typeList.length>0) this.currentType = this.typeList[0];
		},
		methods: {
			searchInputFn() {
				clearTimeout(this.times);
			
				this.times = setTimeout(()=>{
					if(this.typeList.length>0){
						this.$emit("startSearch", {searchValue:this.textVal,type:this.currentType});
					}else{
						this.$emit("startSearch", this.textVal);
					}
				},500)
			},
			select(item){
				this.currentType = item;
				this.typeShow = false;
				this.$emit("startSearch", {searchValue:this.textVal,type:this.currentType});
			},
			mouseOut(){
				clearTimeout(showTimer);
				showTimer = setTimeout(()=>this.typeShow=false,500);
			},
			mouseOver(){
				clearTimeout(showTimer);
			},
			show(){
				this.typeShow = true;
				// showTimer = setTimeout(()=>this.typeShow=false,1000);
			}
		}
	};
</script>
<style lang="scss" scoped>
	.search-one {
		position: relative;
		width: 100%;
		background: #fff;
		height: 38px;
		// border: 1px solid #ccc;
		transition: 2s all linear;
		display: flex;
		&.active {
			.search-a {
				background: #176de6;
				i{
					color: #fff;
				}
			}
		}
		.search-type{
			// width: 100px;
			
			height: 38px;
			border-right: 1px solid #f1f1f1;
			position: relative;
			z-index: 100000;
			font-size: 14px;
			cursor: pointer;
			.search-model{
				// line-height: 38px;
				padding: 0 10px;
				// color: #333;
				display: flex;
				// justify-content: center;
				align-items: center;
				span{
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					display: block;
					text-align: center;
					line-height: 38px;
					width: 40px;
					// max-width: 60px;
					height: 38px;
				}
				i{
					flex-shrink: 0;
				}
			}
			.select-lists{
				position: absolute;
				background-color: #fff;
				top: 42px;
				left:0px;
				box-shadow: 0 0 2px #999;
				.select-lists-el{
					padding: 5px 10px;
					max-width: 120px;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					border-bottom: 1px solid #eee;
					&:hover{
						background-color: #f1f1f1;
					}
				}
			}
		}
		.search-a {
			// position: absolute;
			top: 0px;
			border-left: 1px solid #eee;
			right: -1px;
			width: 38px;
			height: 38px;
			flex-shrink: 0;
		}
		.search-m {
			padding: 0 10px;
			// background-color: red;
			width: 100%;
			input {
				border: none;
				background: none;
				height: 38px;
				line-height: 38px;
				outline: none;
				display: block;
				width: 100%;
			}
		}
	}
</style>
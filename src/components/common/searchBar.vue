<template>
	<div class="search-one cle" :class="{'active':checkedInput}">
		<!-- <a href="javascript:;" class="search-a" @click="searchInputFn"></a> -->
		<span class="search-a flex-center">
			<i class="font-18 font-gray" :class="{'el-icon-search':!loading,'el-icon-loading':loading}"></i>
			<!-- <i class="el-icon-loading font-18 font-gray"></i> -->
		</span>
		<div class="search-m">
			<input type="text" v-model="textVal" @blur="checkedInput=false" @focus="checkedInput=true" @input="searchInputFn">
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				textVal: "",
				checkedInput: false
			};
		},
		props: ["searchValue",'loading'],
		watch: {
			searchValue(val) {
				this.textVal = val;
			}
		},
		mounted() {
			this.textVal = this.searchValue;
		},
		activated() {
			this.textVal = this.searchValue;
		},
		methods: {
			searchInputFn() {
				clearTimeout(this.times);
				this.times = setTimeout(() => {
					this.$emit("startSearch", this.textVal);
				}, 500)
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
		&.active {
			.search-a {
				background: #176de6;
				i{
					color: #fff;
				}
			}
		}
		.search-a {
			position: absolute;
			top: 0px;
			border-left: 1px solid #eee;
			right: -1px;
			width: 38px;
			height: 38px;
		}
		.search-m {
			margin: 0 30px 0 10px;
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
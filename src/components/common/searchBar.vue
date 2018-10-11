<template>
	<div class="search-one cle" :class="{'active':checkedInput}">
		<a href="javascript:;" class="search-a" @click="searchInputFn"></a>
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
		props: ["searchValue"],
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
			}
		}
		.search-a {
			position: absolute;
			top: 0px;
			border-left: 1px solid #eee;
			right: -1px;
			width: 38px;
			height: 38px;
			&:after,
			&:before {
				content: "";
				display: block;
				position: absolute;
			}
			&:after {
				top: 9px;
				right: 13px;
				width: 10px;
				height: 10px;
				border-radius: 50%;
				border: 2px solid #e3e4e6;
			}
			&:before {
				top: 22px;
				right: 11px;
				width: 5px;
				height: 2px;
				background: #e3e4e6;
				transform: rotate(45deg)
			}
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
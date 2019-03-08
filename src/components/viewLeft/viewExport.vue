<template>
	<div class="object-list">
		<div class="export-content">
			<input type="text" v-model="eastLongitude">
			<input type="text" v-model="westLongitude">
			<input type="text" v-model="southLatitude">
			<input type="text" v-model="northLatitude">
			<!-- <span>{{eastLongitude}}</span>
			<span>{{westLongitude}}</span>
			<span>{{southLatitude}}</span>
			<span>{{northLatitude}}</span> -->
		</div>
		<div class="export-button">
			<span class="export-span" @click="exportJsonFn">导出</span>
		</div>
	</div>
</template>
<script>
	import {mapboxMap} from '@/script/mapbox'
	import {psdeUrl} from '@/script/editor/psde/config'
	import { vm, operate } from '@/script/operate'
	export default {
		data() {
			return {
				eastLongitude: 0,//东经
				westLongitude: 0,//西经
				southLatitude: 0,//南纬
				northLatitude: 0,//北纬
			}
		},
		components: {
			
		},
		mounted(){
			this.initData();
			this.listenEvent();
		},
		methods:{
			initData(){
				var box = document.getElementById("mapbox");
				var pos = box.getBoundingClientRect();
				console.log(pos , "pos*-*--------------")
			},
			listenEvent(){
				vm.$on(operate.mapBoxZoom,arr=>{
					this.eastLongitude = arr[0][0];
					this.westLongitude = arr[1][0];
					this.northLatitude = arr[1][1]
					this.southLatitude = arr[0][1];
				})
			},
			exportJsonFn(){
				let boxArray = mapboxMap.getBounds().toArray();
				let sdomian = JSON.parse(sessionStorage.getItem('sdomain'));
				let bbox = `BBOX(${this.eastLongitude} ${this.westLongitude} ${this.southLatitude} ${this.northLatitude})`;
				let url = `${psdeUrl}object/query?token=${localStorage.getItem('token')||''}&geoWkt=${bbox}&loadForm=true&sdomains=${sdomian.id}`;
				window.open(url)
			}
		}
	}
</script>
<style scoped lang="scss">
	.object-list {
		position: absolute;
		right: 0;
		left: 0;
		top: 0;
		bottom: 0;
		height: 300px;
		background: #FFFFFF;
		.export-content{
			position: relative;
			width: 260px;
			height: 100px;
			background: #F0F0F0;
			margin: 20px 20px;
			border: 1px solid #ccc;
			input{
				display: inline-block;
				position: absolute;
				width: 70px;
				height: 24px;
				line-height: 24px;
				text-align: center;
				background: #FFF;
				border: 1px solid #ccc;
				overflow: hidden;
			}
			input:nth-of-type(1){
				left: -1px;
				top: 37px;
			}
			input:nth-of-type(2){
				right: -1px;
				top: 37px;
			}
			input:nth-of-type(3){
				left: 95px;
				top: -1px;
			}
			input:nth-of-type(4){
				left: 95px;
				top: 75px;
			}
		}
		.export-button{
			position: relative;
			width: 100%;
			height: 50px;
			display: flex;
			justify-content: center;
			align-items: center;
			.export-span{
				display: inline-block;
				font-size: 14px;
				cursor: pointer;
			    border: 0;
			    width: 120px;
			    height: 30px;
			    line-height: 30px;
			    text-align: center;
			    color: white;
			    background: #7092FF;
			    border-radius: 2px;
			}
		}
	}
</style>
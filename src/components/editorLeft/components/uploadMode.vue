<template>
	<div class="model-upload">
		<div v-if="centerDialogVisible" class="upWindow" @click.self="close">
			<div class="upWindow-con cle">
				<div class="del" @click="close">×</div>
				<el-form :label-position="labelPosition" label-width="80px">
					<el-form-item label="上传">
						<el-upload class="upload-demo" ref="upload" :action="modelFileUpload" name="file" :data="upData" :on-change="changeFn" :on-remove="removeFn" :file-list="fileList" :auto-upload="false" :before-upload="beforeUpload" :http-request="updateFn" :limit="1">
							<el-button slot="trigger" size="small" type="primary">选取文件</el-button>
						</el-upload>
					</el-form-item>
					<el-form-item label="名字">
						<el-input v-model="upData.name"></el-input>
					</el-form-item>
					<el-form-item label="描述">
						<el-input v-model="upData.desc"></el-input>
					</el-form-item>
				</el-form>
				<div class="btn">
					<el-button :loading="loading" type="primary" @click="submitUpload">确定</el-button>
					<el-button type="info" @click="close">取消</el-button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>

	import { vm, operate } from "@/script/operate";

	import {modelServer} from '@/script/server'

	export default {
		data() {
			return {
				loading: false,
				modelFileUpload:modelServer.uploadUrl(),
				upData: {
					name: "",
					desc: ""
				},
				fileList: [],
				file: "",
				// ---上传弹窗---------------------------

				labelPosition: "right",

				dataList: "",
				// ---分页---------------------------

				page: {
					pages: "",
					pageNum: 1,
					total: ""
				},
				page: {
					currentPage: 1,
					pageNum: 1,
					pageSize: 20,
					pageSizeArr: [4, 20, 40],
					total: 0
				}
			};
		},
		components: {},
		props: ['centerDialogVisible'],

		watch: {},
		filters: {},
		mounted() {
			
		},
		methods: {
			// --------拼接---------------------------------------------------

			getUrl(a, b) {
				return a + "/" + b;
			},
			beforeUpload(){
				this.modelFileUpload+=`name=${this.upData.name}&desc=${this.upData.desc}`;
			},
			updateFn(){
				// console.log('upload');
				// psde.fileServer.uploadMode(this.upData).then(res=>{
				// 	console.log(res.data)
				// 	this.$emit('successFn' , {data: res.data , sign: "success"});
				// },()=>{
				// 	console.log('err')
				// });
				this.loading = true;
				modelServer.uploadMode(this.upData).then(res=>{
					this.$emit('successFn' , {data: res.data , sign: "success"});
					this.loading = false;
				},(err)=>{
					this.loading = false;
					console.log(err,'err')
				})

			},
			// ---------上传--------------------------------------------------
			submitUpload() {
        let message;
				if(!this.upData.name) {
          message = '名字不能为空';
				} else if(!this.upData.desc) {
          message = '描述不能为空';
				} else if(!this.file.uid) {
          message = '文件不能为空';
				} else {
					this.$refs.upload.submit();
        }
        if(message){
          vm.$emit(operate.notice,{
            title:'提示',
            message:message
          })
        }
			},

			errorFn(err, file, fileList) {
        this.$emit('errorFn',{
          file,
          fileList
        })
				// this.$message.error("上传失败！");
			},
			successFn(response, file, fileList) {
        // this.$message({
        //   message: "上传成功",
				// 	type: "success"
				// });
				this.$emit('successFn' , {data: response.data , sign: "success"});
			},
			changeFn(file, fileList) {
				this.file = file;
				this.upData.file = file;
			},
			removeFn(file, fileList) {
				this.file = "";
			},
			// --------分页---------------------------------------------------
      close(){
        this.$emit('close');
      }
			// -----------------------------------------------------------
		}
	};
</script>

<style scoped lang="scss">
	.model-upload {
		position: absolute;
		// height: 100%;
		width: 100%;
		background-color: #ffffff;
		padding-left: 50px;
		.upWindow {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: rgba(0, 0, 0, 0.4);
			z-index: 50;
			.upWindow-con {
				margin: 200px auto;
				padding: 30px 20px;
				width: 500px;
				z-index: 5002;
				background: #ffffff;
				border-radius: 5px;
				box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
				position: relative;
				.del {
					position: absolute;
					right: 10px;
					top: -10px;
					font-size: 30px;
					cursor: pointer;
				}
				.btn {
					margin-left: 80px;
				}
			}
		}
	}
</style>
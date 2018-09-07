<template>
	<div class="model-upload">
		<div v-if="centerDialogVisible" class="upWindow" @click.self="centerDialogVisible = false">
			<div class="upWindow-con cle">
				<div class="del" @click="centerDialogVisible = false">×</div>
				<el-form :label-position="labelPosition" label-width="80px">
					<el-form-item label="上传">
						<el-upload class="upload-demo" ref="upload" :action="modelFileUpload.baseURL" name="file" :data="upData" :on-error="errorFn" :on-success="successFn" :on-change="changeFn" :on-remove="removeFn" :file-list="fileList" :auto-upload="false" :limit="1">
							<el-button slot="trigger" size="small" type="primary">选取文件</el-button>
						</el-upload>
					</el-form-item>
					<el-form-item label="名字">
						<el-input v-model="upData.name"></el-input>
					</el-form-item>
					<el-form-item label="描述">
						<el-input v-model="upData.des"></el-input>
					</el-form-item>
				</el-form>
				<div class="btn">
					<el-button type="primary" @click="submitUpload">确定</el-button>
					<el-button type="info" @click="centerDialogVisible = false">取消</el-button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import axios from "axios";

	import psde from "@/psde";
	import ImageManage from "@/psde/ImageManage";
	import { vm, operate } from "@/script/operate";
	import { tabManage } from "@/components/designer/tabmanage";

	import { modelFileUpload, queryModelFile, downloadFile } from "@/psde/config";

	export default {
		data() {
			return {
				loading: false,
				itemData: tabManage.getItemById("modelManager"),
				modelFileUpload,
				queryModelFile,
				downloadFile,
				upData: {
					name: "",
					des: ""
				},
				fileList: [],
				file: "",
				centerDialogVisible: false,
				// ---上传弹窗---------------------------

				labelPosition: "right",

				// ---保存---------------------------
				ImageManage,

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
		props: [],

		watch: {},
		filters: {},
		mounted() {
			this.requestMore();
		},
		methods: {
			// --------拼接---------------------------------------------------

			getUrl(a, b) {
				return a + "/" + b;
			},
			// ---------上传--------------------------------------------------
			submitUpload() {
				if(!this.upData.name) {
					this.$message.error("名字不能为空");
				} else if(!this.upData.des) {
					this.$message.error("描述不能为空");
				} else if(!this.file.uid) {
					this.$message.error("文件不能为空");
				} else {
					this.$refs.upload.submit();
				}
			},

			errorFn(err, file, fileList) {
				this.$message.error("上传失败！");
			},
			successFn(response, file, fileList) {
				vm.$emit(operate.modelUploadEvent , {data: response.data , sign: "success"});
				this.$message({
					message: "上传成功",
					type: "success"
				});
				this.centerDialogVisible = false;
			},
			changeFn(file, fileList) {
				this.file = file;
			},
			removeFn(file, fileList) {
				this.file = "";
			},
			// --------分页---------------------------------------------------

			handleCurrentChange(val) {
				this.page.pageNum = val;
				this.requestMore();
			},
			handleSizeChange(val) {
				this.page.pageSize = val;
				this.requestMore();
			},
			requestMore() {
				this.loading = false;
				this.dataList = [];
				//   let obj
				axios
					.get(this.queryModelFile.baseURL, {
						params: {
							pageSize: this.page.pageSize,
							pageNum: this.page.pageNum,
						}
					})
					.then(response => {
//						console.log(response.data.data, 11111111);
						this.dataList = response.data.data;
						this.page.pageNum = response.data.data.pageNum;
						this.page.pages = response.data.data.pages;
						this.page.total = response.data.data.total;
						this.loading = true;
					})
					.catch(function(error) {
						console.log(error, 22222222);
					});
			}
			// -----------------------------------------------------------
		}
	};
</script>

<style scoped lang="less">
	.model-upload {
		position: absolute;
		height: 100%;
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
			z-index: 5001;
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
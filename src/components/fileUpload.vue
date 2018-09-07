<template>
	<div class="upload-box cle">
		<div class="file-list">
			<div class="file-num" v-for="(file,i) in fileList" :key="i" @click="deleteFn(i)" :title="file.url">
				<div class="file-mask"></div>
				<a href="javascript:;" class="iconfont icon-guanbi1"></a>
			</div>
		</div>
		<el-upload class="upload-demo" :data="oidData" :show-file-list="false" :action="fileUpload.baseURL" name="file" :before-upload="splitFileName" :on-error="errorFn" :on-success="successFn" :file-list="fileList">
			<el-button size="small" type="primary" v-if="fileList.length < updateData.quantity" class="up-button">点击上传</el-button>
		</el-upload>
	</div>
</template>
<script>
import { fileUpload } from "@/psde/config";
export default {
  props: ["updateData", "preview"],
  data: function() {
    return {
      // updateData,
      fileUpload,
      fileList: [],
      header: {
        "Content-Type": "multipart/form-data"
      },
      oidData: {
        oid: "",
        from: null,
        blockType: ""
      }
    };
  },
  mounted() {
    this.oidData.oid = this.updateData.oid;
    if (this.updateData.from) {
      this.oidData.from = this.updateData.from;
    } else {
      this.oidData.from = 0;
    }
    this.oidData.blockType = this.updateData.blockType;

    if (this.preview && this.preview != 0) {
      this.fileList.push({
        name: this.preview,
        url: this.preview
      });
    }

    if (this.updateData.preview) {
      this.fileList.push({
        name: this.updateData.preview,
        url: this.updateData.preview
      });
      //				let jsonPreview = JSON.parse(this.updateData.preview);
      //				for(let i in jsonPreview) {
      //					this.fileList.push({
      //						name: i + 1,
      //						url: jsonPreview[i]
      //					})
      //				}
    }
    // console.log(fileUpload.baseURL)
  },
  methods: {
    deleteFn(i) {
      this.fileList.splice(i, 1);
      this.$emit("deleteFile");
    },
    successFn(response, file, fileList) {
      this.fileList.push({
        name: this.fileList.length + 1,
        url: response.data.bid
      });
      let arr = [];
      for (let oneFile of this.fileList) {
        arr.push(oneFile.url);
      }
      this.$emit("upScccess", arr);
    },
    errorFn(res) {
      this.$message({
        message: "上传失败！",
        type: "error",
        showClose: true
      });
    },
    splitFileName(name) {
      var fileName = name.name;
      var commaIndex = fileName.lastIndexOf(".");
      var Name = fileName.substring(0, commaIndex);
      var Ext = fileName.substring(commaIndex + 1);
      return true;
      //下面的上传文件限制暂时先不要了
      if (Ext == "max" || Ext == "dwg") {
        return true;
      } else {
        this.$message({
          message: "请选择max格式或者dwg格式的文件进行上传",
          type: "warning",
          showClose: true
        });
        return false;
      }
    }
  },
  created: function() {}
};
</script>
<style lang="less" scoped>
.file-num {
  width: 48px;
  height: 48px;
  background: url(../assets/images/file.png);
  float: left;
  position: relative;
  margin-top: 11px;
  &:hover {
    .file-mask {
      opacity: 0.5;
    }
    .icon-guanbi1 {
      opacity: 1;
    }
  }
  .file-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #000;
    opacity: 0;
    z-index: 2;
    transition: all 0.1s ease;
    cursor: pointer;
  }
  .icon-guanbi1 {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 3;
    color: #fff;
    opacity: 0;
    transform: translate(-50%, -50%);
    transition: all 0.1s ease;
  }
}

.up-button {
  float: left;
  margin-top: 22px;
}
</style>
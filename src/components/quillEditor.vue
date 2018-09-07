<script>
import { psdeImgUpload, psdeImgShow } from "@/psde/config";
import {quillEditor} from 'vue-quill-editor';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
export default {
  props:["value"],
  data() {
    return {
      proDes:this.value,
      editorOption: {
					modules:{//富文本编辑器配置
            toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{
              'list': 'ordered'
            }, {
              'list': 'bullet'
            }],
            [{
              'indent': '-1'
            }, {
              'indent': '+1'
            }],
            [{
              'color': []
            }, {
              'background': []
            }],
            [{
              'align': []
            }],
            ['link', 'image', ]
            ]
          },
					placeholder: "请输入订单描述 ...",
				},
    };
  },
  mounted(){
    this.quillImage();
  },
  watch:{
    "proDes"(){
        this.$emit('input',this.proDes)
    }
  },
  components:{
			"quill-editor":quillEditor
		},
  methods:{
   quillImage(){//点击编辑器图片
				var toolbar =this.$refs.quill.quill.getModule('toolbar');
				toolbar.addHandler('image', (()=>{
					this.$refs.uploadFile.value=""
					this.$refs.uploadFile.click();
				}));
			},
			selectImage(event){//选择图片
		        let file = event.target.files[0];
		        let _this = this;
		        var formData = new FormData(this.$refs.uploadForm);
            var oReq = new XMLHttpRequest();  
            oReq.open( "POST", psdeImgUpload.baseURL, true );  
		             oReq.onload = ((oEvent)=>{
		              if (oReq.status == 200) {  
		                  var response = JSON.parse(oReq.response);
		                  console.log(response.status == 200)
		                  if( response.status == 200 ){
		                    var reg = "\\"
		                    let imgSrc = psdeImgShow.baseURL + response.data.imageUrl;
		                    let img = document.createElement("img");
		                    img.setAttribute("src",imgSrc)
		                    this.$refs.quill.quill.insertEmbed(this.$refs.quill.quill.getSelection().index, 'image', imgSrc);
		                }else{
		                  console.log("上传失败")
		                }
		             } else {  
		                // _this.blue.popTips.redText("上传失败！");
		             }  
		        })
		        oReq.send(formData);  
		    },
  }
};
</script>
<template>
  <div>
       <quill-editor class="text-editor" v-model="proDes" :options="editorOption" ref="quill"></quill-editor>	
       <!-- ImageUploadStart -->
	    <form ref="uploadForm" class="uploadForm">
	      <input type="file" name="file" ref="uploadFile" @change="selectImage" class="upload-image-file" accept="image/gif,image/jpeg,image/png">
	    </form>
	    <!-- ImageUploadEnd -->
  </div>
</template>
<style lang="less" scoped>

.text-editor button {
    margin: 0 8px;
}
.text-editor .ql-toolbar.ql-snow,
  .text-editor .ql-container.ql-snow {
    border: 1px solid #e6e6e6;
}
.text-editor .ql-toolbar.ql-snow {
    border-bottom: 0;
}
.uploadForm {
  display: none;
}

</style>

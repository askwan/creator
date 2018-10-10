import AObject from './AObject'
import {
	apiConfig,
	psdeApi,
	psdeApiGet
} from '../config.js'
/**
 * 
 * 
 * @class OType
 * @extends {AObject}
 */
class OType extends AObject {
	constructor() {
		super()
		this.className = "otype"
		/**
		 * 标签
		 */
		this.defineProperty("tags", "")
		/**
		 * 描述
		 */
		this.defineProperty("des", "")
		/**
		 * 图标
		 */
		this.defineProperty("icon", "")
		/**
		 * 字段集合
		 */
		this.defineProperty("fields", {
			"fields": []
		})
		/**
		 * 空间参照
		 */
		this.defineProperty("srs", {})
		/**
		 * 时间参照
		 */
		this.defineProperty("trs", {})
		/**
		 * 形态样式
		 */
		this.defineProperty("formStyles", {
			"styles": []
		})
		/**
		 * 连接关系
		 */
		this.defineProperty("connectors", {
			"connectors": []
		})
		/**
		 * 行为列表
		 */
		this.defineProperty("models", {
			"models": []
		})
	}
	getApi() {
		return psdeApi;
	}
	getUrlName() {
		return apiConfig.OType;
	}
	updateBaseInfo(options=this) {
		this.editType = 'base';
		return this.update(options);
	}
	updateFormInfo(options=this) {
		this.editType = 'form';
		return this.update(options);
	}
}
export default OType
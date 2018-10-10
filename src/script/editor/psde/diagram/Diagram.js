import Proxy from '../Proxy'
import { psdeApi } from '../config'
/**
 * 
 * 类视图
 * 
 * @Diagram
 */
class Diagram extends Proxy {
	constructor() {
		super()
		this.className = "diagram"
		/**
		 * 视图名称
		 */
		this.defineProperty("name", "")
		/**
		 * 图标地址
		 */
		this.defineProperty("icon", "")
		/*
		 * 标签
		 */
		this.defineProperty("tags", "")
		/**
		 * 描述
		 */
		this.defineProperty("des", "")
	}

	getIndustrysTag() {
		if(this.tags != null && this.tags != "") {
			return this.tags.split(',');
		}
		return [];
	}
	pushTag(tag) {
		if(this.tags == null || this.tags == "") {
			this.tags = tag;
		} else {
			this.tags += "," + tag;
		}
	}
	removeTag(tag) {
		if(this.tags == null || this.tags == "") {
			return;
		}
		let tags = this.tags.split(',');
		tags.splice(tags.indexOf(tag), 1);
		this.tags = tags.join();
	}

	getApi() {
		return psdeApi;
	}
	getUrlName() {
		return this.className;
	}
}
export default Diagram;
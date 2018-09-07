
import axios from "axios"
import {psdeImgShow} from '@/psde/config'
import {baseConfig,processAjaxData} from "../request/util"

let baseUrl=`${baseConfig.baseRestUrl}/rest/v1.0/dataengine`;
let baseUrlImg=`${psdeImgShow.baseURL}`;


/**
 * 字段服务
 */
var OcategoryService = {
    /**
     * 根据父节点ID查询其所有子节点
     * 
     * @param {any}  parentId	Long	父节点ID（-1：加载根目录；0：加载一级目录）
     * 
     * @returns 
     */
    getListByParentId(parentId) {
        return processAjaxData(`${baseUrl}/ocategory/getListByParentId?parentId=${parentId}`);
    },
    /**
     * 新建对象种类
     * 
     * @param {any}  categoryName	String	对象种类名
     * @param {any}  parentId	Long	父类别ID
     * @returns 
     */
	createOcategory(categoryName,parentId){
        var parameters=new FormData();
        parameters.append("categoryName",categoryName);
        parameters.append("parentId",parentId);
        return processAjaxData(`${baseUrl}/ocategory/create`,'post',parameters);
    },
    /**
     * 删除对象种类
     * 
     * @param {any}  categoryId	Long	主键ID
     *
     * @returns 
     */
    deleteOcategory(nodeId,type){
    	var parameters=new FormData();
        parameters.append("nodeId",nodeId);
        parameters.append("type",type);
        return processAjaxData(`${baseUrl}/ocategory/deleteNode`,'post',parameters);
    },
    /**
     * 根据条件检索对象种类
     * 
     * @param {any}  querycase	String	检索条件（种类名/全拼/首字母） N
     *
     * @returns 
     */
    getListByCaseOcategory(querycase){
    	var parameters=new FormData();
        parameters.append("querycase",querycase);
        return processAjaxData(`${baseUrl}/ocategory/getListByCase`,'post',parameters);
    },
    /*
     * treeNode前面的小图标地址
     */
    getTreeNodeIconPath(){
		return baseUrlImg;
    },
    /**
     * 修改目录parentID，即拖拽事件用
     * 
     * @param {Long}  nodeId	Long	主键ID
     * @param {Long}  parentId	Long	父节点ID
     * @param {Integer}  type	Integer	节点类型
     *
     * @returns 
     */
    updateParentIdOcategory(nodeId, parentId, type){
    	var parameters=new FormData();
        parameters.append("nodeId",nodeId);
        parameters.append("parentId",parentId);
        parameters.append("type",type);
        return processAjaxData(`${baseUrl}/ocategory/updateParentId`,'post',parameters);
    },
    /**
     * 根据主键获取对象种类详情
     * Get
     * @param {any}  categoryId	 Long	主键ID
     * 
     * @returns 
     */
    getOcategoryDetail(categoryId) {
        return processAjaxData(`${baseUrl}/ocategory/${categoryId}`);
    }
}


export default OcategoryService;
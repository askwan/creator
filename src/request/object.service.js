import axios from "axios"

import {baseConfig,processAjaxData} from "./util"
import common from '@/script/common'

let baseUrl=`${baseConfig.dcbcRestUrl}`

const objectService = {
    /**
     * GET
     * @param 	token 令牌(String) (必填) 
     * @returns
     */
    queryObject(filter){
        return processAjaxData(`${baseUrl}object/query?token=${common.getItem('token')}`,'get',{
    		params:filter
   		});
    },
    /**
     * 对象的forms的增删改
     * 
     * @param {object} options 
     */
    editObject(options){
        return processAjaxData(`${baseUrl}object/saveObject1?token=${common.getItem('token')}`,"post",options)
    },
}

export default objectService;
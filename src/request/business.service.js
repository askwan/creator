import axios from "axios"

import {baseConfig,processAjaxData} from "./util"
import common from '@/script/common'

let baseUrl=`${baseConfig.dcbcRestUrl}`

const businessService = {
    /**
     * 异步构成业务流树
     * GET
     * @param 	token 令牌(String) (必填) 
	 * @param	pId   父ID (Long)
     * @returns
     */
    queryForTreeAsynTree(searchValue){
        return processAjaxData(`${baseUrl}/tree/queryForTreeAsyn?token=${common.getItem('token')}&pId=${searchValue}`,'get');
    },
    queryForTree(searchValue){
        return processAjaxData(`${baseUrl}/tree/queryForTree?token=${common.getItem('token')}&id=${searchValue}`,'get')
    }
}

export default businessService;
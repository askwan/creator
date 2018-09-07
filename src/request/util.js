import axios from "axios"


import {psdeUrl} from '@/psde/config'
export var baseConfig = {
    dcbcRestUrl: psdeUrl
}

/**
 * 统一处理异步请求结果
 * 
 * @export
 * @param {any} restUrl 异步请求的url地址
 * @param {string} [method='get']  请求的方法类型：post、get
 * @returns 过滤后的请求结果
 */
export function processAjaxData(restUrl, method = 'get', parameters = null) {
    var promise = null;

    var promise1 = new Promise(function (resolve, reject) {
        axios[method](restUrl, parameters)
        .then(response => {
            if(response.data.status==200){
                resolve(response.data.data);
            }else{
                reject(response.data);
            }
           
        })
        .catch((error) => {
            reject(error);
//				alert("网络错误！！！")
        })
    });

    return promise1;
/*
    if (parameters) {
        promise = Observable.fromPromise(axios[method](restUrl, parameters))
    } else {
        promise = Observable.fromPromise(axios[method](restUrl))
    }
    return promise.filter(result => result.data.status == 200).map(result => result.data.data);*/
}

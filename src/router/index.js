import Vue from 'vue'
import Router from 'vue-router'
import common from '@/script/common'
import Token from '@/views/token'
import objectInstant from '@/views/objectInstant/index'

import editObject from '@/views/editObject'

import edit from '@/views/objectInstant/middle/middleContent'
import view from '@/views/objectInstant/middle/middleContent/objectData'

Vue.use(Router)
var router = new Router({
	routes: [{
			path: "/",
			redirect: "/view"
		},
		{
			path: '/token',
			component: Token
		}, {
			path: '/instant',
			component: objectInstant
		},{
			path:"*",
			redirect:'/'
		},{
			path:'/edit',
			component: edit
		},{
			path:'/view',
			component: view
		}
	],
	linkActiveClass: "active"
})
router.beforeEach((to, from, next) => {
	let token = common.getItem("token");
	if(token) { //有token
		if(common.getInfo("id")) {
			if(sessionStorage.getItem("instant") == null && to.path != "/instant") {
				next()
			} else {
				next()
			}
		} else {
			common.getNewUser("get", "/account/authorize", {}, res => {
				common.setUserInfo(res);
				if(sessionStorage.getItem("instant") == null && to.path != "/instant") {
					next()
				} else {
					next()
				}
			})
		}
	} else { //没token
		if(to.path != "/token") { //不在token页
			console.log("进入token 页")
			next("/token");
		} else { //在token页
			next();
		}
	}
	document.body.scrollTop = 0; //滚动条复位
})
export default router;
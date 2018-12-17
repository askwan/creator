import Vue from 'vue'
import Router from 'vue-router'
import Edit from '@/views/edit'
import View from '@/views/view'

Vue.use(Router)

var router =new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      redirect:'/view'
    },{
      path:'/token',
      name:'token',
      component:()=>import('@/views/token')
    },{
      path:'/view',
      name:'view',
      component:View
    },{
      path:'/edit',
      name: 'edit',
      component: Edit
    }
  ]
});

// router.beforeEach((to, from, next) => {
// 	let token = common.getItem("token");
// 	if(token) { //有token
// 		if(common.getInfo("id")) {
// 			next();
// 		} else {
//       console.log(window.user)
// 			common.getNewUser("get", "/account/authorize", {}, res => {
//         common.setUserInfo(res);
//         next();
// 			},()=>{
//         next();
//       })
//     }
    
// 	} else { //没token
// 		if(to.path != "/token") { //不在token页
// 			console.log("进入token 页")
// 			next("/token");
// 		} else { //在token页
// 			next();
// 		}
// 	}
// 	document.body.scrollTop = 0; //滚动条复位
// })

export default router

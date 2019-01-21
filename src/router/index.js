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

export default router

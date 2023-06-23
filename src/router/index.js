import Vue from 'vue'
import Router from 'vue-router'
import {MapRouter} from "./mapRouter";
import { Message } from "element-ui";
import NProgress from "nprogress";

Vue.use(Router);

let router = new Router({
  mode: 'hash',
  routes: MapRouter
});

router.beforeEach((to, from, next) => {
  let isAuthorized = sessionStorage.getItem("token")
  NProgress.start()
  if (isAuthorized) {
    if (to.path === "/intercept") {
      Message.warning("您是受邀用户")
      next({path: "/traSearch"})
      NProgress.done()
      return
    }else {
      next()
    }
  }else {
    if(to.path === "/intercept") {
      next()
      return
    }
    alert("您无权访问！")
    next({path:"/intercept"})
    NProgress.done()
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router

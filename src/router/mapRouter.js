// import layoutIndex from "../views/index"
import layoutIndex from "../views/index"

let MapRouter = [
  {
    path: '/',
    redirect: {
      name: 'intercept'
    }
  },
  {
    path: "/intercept",
    name: "intercept",
    component: () => import("../views/intercept")
  },
  {
    path: "",
    name: "",
    component: layoutIndex,
    children: [
      {
        path: "/cityFlow",
        name: "cityFlow",
        component: () => import("../views/cityFlow.vue")
      }
    ]
  },
  {
    path: "",
    name: "",
    component: layoutIndex,
    children: [
      {
        path: "/dataProcess",
        name: "dataProcess",
        component: () => import("../views/dataProcess.vue")
      }
    ]
  },
]

export {MapRouter};

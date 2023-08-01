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
  {
    path: "",
    name: "",
    component: layoutIndex,
    children: [
      {
        path: "/carTrajectory",
        name: "carTrajectory",
        component: () => import("../views/carTrajectory.vue")
      }
    ]
  },
  {
    path: "",
    name: "",
    component: layoutIndex,
    children: [
      {
        path: "/carDetail",
        name: "carDetail",
        component: () => import("../views/carDetail.vue")
      }
    ]
  },
  {
    path: "",
    name: "",
    component: layoutIndex,
    children: [
      {
        path: "/camFlow",
        name: "camFlow",
        component: () => import("../views/camFlow.vue")
      }
    ]
  },
]

export {MapRouter};

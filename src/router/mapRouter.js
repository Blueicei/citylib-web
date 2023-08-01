// import layoutIndex from "../views/index"
import layoutIndex from "../views/index";

let MapRouter = [
  {
    path: "/",
    redirect: {
      name: "intercept",
    },
  },
  {
    path: "/intercept",
    name: "intercept",
    component: () => import("../views/intercept"),
  },
  {
    path: "",
    name: "",
    component: layoutIndex,
    children: [
      {
        path: "/cityFlow",
        name: "cityFlow",
        component: () => import("../views/cityFlow.vue"),
      },
    ],
  },
  {
    path: "",
    name: "",
    component: layoutIndex,
    children: [
      {
        path: "/dataProcess",
        name: "dataProcess",
        component: () => import("../views/dataProcess.vue"),
      },
    ],
  },
  {
    path: "",
    name: "",
    component: layoutIndex,
    children: [
      {
        path: "/carTrajectory",
        name: "carTrajectory",
        component: () => import("../views/carTrajectory.vue"),
      },
    ],
  },
  {
    path: "",
    name: "",
    component: layoutIndex,
    children: [
      {
        path: "/carDetail",
        name: "carDetail",
        component: () => import("../views/carDetail.vue"),
      },
    ],
  },
  {
    path: "",
    name: "",
    component: layoutIndex,
    children: [
      {
        path: "/taxiTra",
        name: "taxiTra",
        component: () => import("../views/taxiView/taxiTrajectory.vue"),
      },
    ],
  },
  {
    path: "",
    name: "",
    component: layoutIndex,
    children: [
      {
        path: "/taxiDetail",
        name: "taxiDetail",
        component: () => import("../views/taxiView/taxiDetail.vue"),
      },
    ],
  },
  {
    path: "",
    name: "",
    component: layoutIndex,
    children: [
      {
        path: "/taxiFlow",
        name: "taxiFlow",
        component: () => import("../views/taxiView/taxiFlow.vue"),
      },
    ],
  },
];

export { MapRouter };

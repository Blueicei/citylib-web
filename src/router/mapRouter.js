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
        path: "/traSearch",
        name: "traSearch",
        component: () => import("../views/traSearch")
      }
    ]
  },
]

export {MapRouter};

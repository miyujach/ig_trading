import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Layout from "../views/Layout.vue";
import Home from "../views/pages/Home.vue";

const routes: RouteRecordRaw[] = [
	{ path: "/:catchAll(.*)", redirect: "/" },
	{
		path: "/",
		component: Layout,
		name: "Layout",
		redirect: () => "flights",
		meta: { dataIsLoad: true },
		children: [
			{
				path: "/",
				name: "Home",
				meta: { description: "Home" },
				component: Home,
			},
		],
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

export default router;

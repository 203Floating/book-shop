import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PageView from '../views/PageView.vue'

//登陆
import Login from "../views/LoginView.vue"
//注册
import Register from "../views/RegisterView.vue"
//后台
import GoodsView from "../views/Home/components/GoodsView.vue"
import UserView from "../views/Home/components/UserView.vue"
import CateGory from "../views/Home/components/CateGory.vue"
import Comments from "../views/Home/components/CommentsView.vue"
import OrderForm from "../views/Home/components/OrderForm.vue"
import Carousel from "../views/Home/components/CarouselView.vue"
import Menu from "../views/Home/components/MenuView.vue"
import Links from "../views/Home/components/LinksView.vue"
//前台
// import Goods from "../views/Page/components/GoodsView.vue"
// import UserCenter from "../views/Page/components/UserCenter.vue"
import ShopingCart from "../views/Page/components/ShopingCart.vue"
import OrderView from "../views/Page/components/OrderView.vue"
// import PayView from "../views/Page/components/PayView.vue"
import AddressView from "../views/Page/components/AddressView.vue"
import CollectView from "../views/Page/components/CollectView.vue"
import OrderList from "../views/Page/components/OrderList.vue"
import MainPage from "../views/Page/MainPage.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: '',
          name: 'GoodsView',
          component: GoodsView
        },
        {
          path: 'user',
          name: 'UserView',
          component: UserView
        },
        {
          path: 'category',
          name: 'CateGory',
          component: CateGory
        },
        {
          path: 'comments',
          name: 'Comments',
          component: Comments
        },
        {
          path: 'orderform',
          name: 'OrderForm',
          component: OrderForm,
        },
        {
          path: 'carousel',
          name: 'Carousel',
          component: Carousel
        },
        {
          path: 'menu',
          name: 'Menu',
          component: Menu
        },
        {
          path: 'links',
          name: 'Links',
          component: Links
        }
      ],
      // beforeEnter: (to, form, next) => {
      //   let isAuthorization = sessionStorage.getItem('isAuthorization')
      //   console.log(isAuthorization)
      //   if (isAuthorization) {
      //     console.log(to.path)
      //     console.log(to.name)
      //     if (to.path === '/') {
      //       next({ path: '/goods' })
      //     } else {
      //       next()
      //     }
      //   } else {
      //     alert('请先登陆')
      //     next({
      //       path: '/login'
      //     })
      //   }
      // }
    },
    {
      path: '/pageview',
      name: 'PageView',
      component: PageView,
      children: [
        {
          path: '',
          name: 'MainPage',
          component: MainPage
        },
        {
          path: 'shopingcart',
          name: 'ShopingCart',
          component: ShopingCart
        },
        {
          path: 'orderview',
          name: 'OrderView',
          component: OrderView
        },
        {
          path: 'collectview',
          name: 'CollectView',
          component: CollectView
        },
        {
          path: 'addressview',
          name: 'AddressView',
          component: AddressView
        },
        {
          path: 'orderlist',
          name: 'OrderList',
          component: OrderList
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },

  ]
})
router.beforeEach((to, from) => {
  let isAuthorization = sessionStorage.getItem('isAuthorization')
  // ❗️ 避免无限重定向 
  // 检查用户是否已登录
  if (!isAuthorization && to.name !== 'Login' && to.name != 'Register') {
    // 将用户重定向到登录页面
    return { name: 'Login' }
  }
})
export default router

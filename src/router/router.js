//子级路由
const InitialRoutes = [
  {
    path:'/home',
    alias: '/',
    name:'Home',
    component:() => import('../views/Home.vue')
  },
  {
    path:'/menu',
    name:'Menu',
    component:() => import('../views/Menu.vue')
  },
  {
    path:'/bags',
    name:'Bags',
    component:() => import('../views/Bags.vue')
  },
  {
    path:'/mine',
    name:'Mine',
    component:() => import('../views/Mine.vue')
  }
]


export const routes = [
  {
    path:'/',
    name:'Initial',
    component:()=>import('../views/Initial.vue'),
    children:InitialRoutes
  },
  {
    path: '/login',
    name: 'Login',
    component: ()=>import('../views/Login.vue')
  },
  {
    path:'/dtail/:pid',
    name:'Detail',
    component:() => import('../views/Detail.vue')
  },
  {
    path:'/addresslist',
    name:'AddressList',
    component:() => import('../views/AddressList.vue')
  },
  //问号代表aid可传递可不传递
  {
    path:'/addressedit/:aid?',
    name:'AddressEdit',
    component:() => import('../views/AddressEdit.vue')
  },
  {
    path:'/settlement/:sid',
    name:'Settlement',
    component:() => import('../views/Settlement.vue')
  },
  {
    path:'/orderdetails',
    name:'OrderDetails',
    component:() => import('../views/OrderDetails.vue')
  },
  {
    path:'/accountInfo',
    name:'AccountInfo',
    component:() => import('../views/AccountInfo.vue')
  },
  {
    path:'/myCollection',
    name:'MyCollection',
    component:() => import('../views/MyCollection.vue')
  },
  {
    path:'/securityCenter',
    name:'SecurityCenter',
    component:() => import('../views/SecurityCenter.vue')
  }
]
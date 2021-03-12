import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import axios from 'axios'
import VueAxios from 'vue-axios'

import VueCookies from 'vue-cookies'

import 'lib-flexible/flexible'

import {
  NavBar,
  Field ,
  Icon ,
  Button ,
  Popup ,
  Toast,
  Tabbar, 
  TabbarItem,
  Search,
  Swipe, 
  SwipeItem,
  Stepper ,
  GoodsAction, 
  GoodsActionIcon,
  GoodsActionButton,
  SubmitBar,
  Checkbox,
  CheckboxGroup,
  SwipeCell ,
  AddressList,
  AddressEdit ,
  Tab, 
  Tabs,
  List,
  Card ,
  Cell,
  Empty ,
  Uploader,
  CellGroup,
  Grid,
  GridItem
} from 'vant'

axios.interceptors.request.use(config =>{
  if(config.method === 'post'){
    let paramStr = '';
    for(let key in config.data){
      paramStr += `${key}=${config.data[key]}&`
    }
    config.data = paramStr.slice(0,-1);
  }

  // console.log('config.data ==> ', config.data);

  return config
})

Vue.use(VueAxios, axios)

Vue.use(VueCookies)

Vue.config.productionTip = false

Vue
    .use(NavBar)
    .use(Field )
    .use(Icon )
    .use(Button )
    .use(Popup )
    .use(Toast)
    .use(Tabbar)
    .use(TabbarItem)
    .use(Search)
    .use(Swipe)
    .use(SwipeItem)
    .use(Stepper )
    .use(GoodsAction)
    .use(GoodsActionIcon)
    .use(GoodsActionButton)
    .use(SubmitBar)
    .use(Checkbox)
    .use(CheckboxGroup)
    .use(SwipeCell )
    .use(AddressList)
    .use(AddressEdit)
    .use(Tab)
    .use(Tabs)
    .use(List)
    .use(Card )
    .use(Cell)
    .use(Empty )
    .use(Uploader)
    .use(CellGroup)
    .use(Grid)
    .use(GridItem)

Vue.prototype.baseUrl = 'http://www.kangliuyong.com:10002',
Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA='

//全局过滤器
Vue.filter('formatDate', (data, format) => {
  //data: 需要进行格式化的数据
  //format: 格式
  // console.log('data ==> ', data);
  // console.log('format ==> ', format);

  let date = new Date(data);
  // console.log('date ==> ', date);

  //获取年份
  let year = date.getFullYear().toString();
  // console.log('year ==> ', year);

  if (/(y+)/.test(format)) {
    // console.log('有年份');
    //获取匹配组的内容
    let yearContent = RegExp.$1;
    // console.log('yearContent ==> ', yearContent);

    format = format.replace(yearContent, year.slice(year.length - yearContent.length));
  }

  //替换月日时分秒
  let dateObject = {
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  };

  for (let key in dateObject) {
    //生成动态正则表达式
    let reg = new RegExp(`(${key}+)`);
    // console.log('reg ==> ', reg);
    if (reg.test(format)) {
      //获取匹配组的内容
      let content = RegExp.$1;
      // console.log('content ==> ', content);

      format = format.replace(content, dateObject[key] >= 10 ? dateObject[key] : content.length === 2 ? '0' + dateObject[key] : dateObject[key]);
    }
  }

  return format;
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

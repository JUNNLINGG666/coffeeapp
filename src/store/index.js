import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //购物袋商品数量
    shopbagNum : 0,

    LoadshopbagNum:false
  },
  mutations:{
    changeShopbagNum(state,data){
      state.shopbagNum = data
    },
    changeLoadshopbagNum(state,data){
      state.LoadshopbagNum = data
    }
  }
})

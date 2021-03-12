<template>
    <div class="initial">
        <form action="/">
            <van-search
                v-model="value"
                clearable
                shape="round"
                placeholder="请输入搜索关键词"
                @search="search"
            />
        </form>
        <div class="view">
             <router-view></router-view>
        </div>
        <van-tabbar v-model="activeIndex" active-color="#ec6941" incative-color="#d1a248" route>
            <van-tabbar-item 
            v-for="(v,i) in bottomNav" 
            :key="i" 
            :badge="v.badge > 0 ? v.badge : ''"
            :dot="v.dot" 
            :to="v.to"
            >
                <span>{{v.title}}</span>
                <template #icon="props">
                    <img :src="props.active ? v.icon.active : v.icon.inactive" />
                </template>
            </van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
import {mapState , mapMutations} from 'vuex'
    export default {
        name:'Initial',
        data(){
            return {
                 activeIndex : 0,
                 value: '',
            }
        },
        computed:{
            ...mapState(["shopbagNum" , 'LoadshopbagNum']),
            bottomNav(){
                return [
                    {
                        title:'首页',
                        icon : {
                            active : require('../assets/imgs/home_active.png'),
                            inactive : require('../assets/imgs/home.png')
                        },
                        to: '/'
                    },
                    {
                        title:'菜单',
                        icon : {
                            active : require('../assets/imgs/menu_active.png'),
                            inactive : require('../assets/imgs/menu.png')
                        },
                        to: '/menu'
                    },
                    {
                        title:'购物袋',
                        icon : {
                            active : require('../assets/imgs/shopbag_active.png'),
                            inactive : require('../assets/imgs/shopbag.png')
                        },
                        badge: this.shopbagNum,
                        to: '/bags'
                    },
                    {
                        title:'我的',
                        icon : {
                            active : require('../assets/imgs/my_active.png'),
                            inactive : require('../assets/imgs/my.png')
                        },
                        dot:false,
                        to: '/mine'
                    },
                ]
            }
        },
        methods:{
            ...mapMutations(['changeShopbagNum' , 'changeLoadshopbagNum']),
            search(){
                this.$toast.loading({
                    message:'加载中.....',
                    forbidClic:true,
                    duration:0
                })

                this.axios({
                    method:'GET',
                    url:this.baseUrl + '/search',
                    params:{
                        appkey:this.appkey,
                        name:this.value
                    }
                }).then(res => {
                    this.$toast.clear();
                    console.log(res);
                })
            },
            getshopbagNum(){
                console.log(this.LoadshopbagNum);
                if(this.LoadshopbagNum) {
                    return
                }

                let tokenString = this.$cookies.get('tokenString');

                if(!tokenString){
                    console.log("浏览器token不存在");
                    return
                }
                console.log("浏览器token存在");
                this.$toast.loading({
                    message:'加载中.....',
                    forbidClic:true,
                    duration:0
                });

                this.axios({
                    methods:'GET',
                    url:this.baseUrl + '/shopcartRows',
                    params:{
                        appkey:this.appkey,
                        tokenString
                    }
                }).then(res =>{
                    this.$toast.clear();
                    console.log(res);
                    if(res.data.code == 700){
                        return
                    }

                    if(res.data.code === 8000){
                        // console.log(res);
                        this.changeShopbagNum(res.data.result);
                        this.changeLoadshopbagNum(true)
                        console.log(this.shopbagNum);
                    }
                }).catch(err => {
                    this.$toast.clear();
                    console.log('err==>' , err);
                })
                console.log(this.bottomNav);
            }
        },
        
        created(){
            this.getshopbagNum()
            // console.log("this.shopbagNum ==> ", this.shopbagNum);
            // this.getshopbagNum()
        }
    }
</script>

<style lang="less" scoped>
.initial{
    .view{
        // position: fixed;
        // top: 0;
        // bottom: 0;
        // left: 0;
        // right: 0;
        background-color: #fefefe;
        min-height: 613px;
    }
}
</style>
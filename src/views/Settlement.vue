<template>
    <div class="settlement">
        <div class="nav">
            <van-nav-bar
            title="订单结算"
            left-text="返回"
            left-arrow
            @click-left="back"
            />
        </div>
        <div class="order">
            <div class="address">
                <van-cell is-link title="选择地址" @click="show = true" />
                <div class="text">
                    <div class="top">
                        <span class="name">{{currentAddress.name}}</span>
                        <span class="tel">{{currentAddress.tel}}</span>
                        <div v-show="currentAddress.isDefault" class="default">默认</div>
                    </div>
                    <div class="bottom">
                        <span>{{currentAddress.address}}</span>
                    </div>
                </div>
                <van-popup v-model="show" position="bottom"  >
                    <van-address-list
                    v-model="chosenAddressId"
                    :list="actions"
                    default-tag-text="默认"
                    @add="onAdd"
                    @select="changeAddress"
                    />
                </van-popup>
            </div>
            <div class="order">
                <Order :pro-info="proInfo">
                    <template #order-item>
                        <OrderItem v-for="(v,i) in buyShopbag" :key="i" :product="v"></OrderItem>
                    </template>
                </Order>
            </div>
        </div>
         <div class="pay-btn">
            <van-button color="#e4393c" block round @click="buy">立即结算</van-button>
        </div>
    </div>
</template>

<script>
import { Form } from 'vant'
import Order from '../components/Order.vue'
import OrderItem from '../components/OrderItem.vue'
import {mapState , mapMutations} from 'vuex'
    export default {
        name:'Settlement',
        data(){
            return {
                show: false,
                //地址选项
                actions: [],
                //默认地址
                currentAddress:{

                },
                //选中的地址
                chosenAddressId:'',

                //商品sid数组
                sids:[],

                //订单货物
                buyShopbag:[],

                //下单数量、总价和时间
                proInfo:{
                    count:0,
                    total:0,
                }
            }
        },
        components: {
            Order,
            OrderItem
        },
        computed: {
            ...mapState(['shopbagNum'])
        },
        methods:{
            ...mapMutations(['changeShopbagNum']),
            back(){
                this.$router.back()
            },
            //获取地址
            getCurrentAddress(){
                this.$toast.loading({
                    message:'加载中....',
                    forbidClick:true,
                    duration:0
                });

                let tokenString = this.$cookies.get('tokenString');

                if(!tokenString){
                    this.$toast.clear();
                    return this.$router.push({name:'Login'})
                }

                this.axios({
                    method:'GET',
                    url:this.baseUrl +'/findAddress',
                    params:{
                        appkey:this.appkey,
                        tokenString
                    }
                }).then(res => {
                    this.$toast.clear();
                    if(res.data.code == 700){
                        this.$toast({
                            message:res.data.msg,
                            forbidClick:true,
                            duration:3000
                        });
                        return this.$router.push({name:'Login'})
                    }

                    if(res.data.code == 20000) {
                        console.log(res);
                        res.data.result.forEach(v => {
                            v.address = `${v.province}${v.city}${v.county}${v.addressDetail}`;
                            v.isDefault = Boolean(v.isDefault)
                            if(v.isDefault){
                                this.currentAddress = {...v}
                                this.chosenAddressId = v.id
                            }
                                this.actions.push(v)
                        })
                        console.log(this.actions);
                    }
                })
            },
            //新增地址
            onAdd() {
                this.$router.push({name:'AddressEdit'})
            },
            //点击切换地址
            changeAddress(item){
                this.currentAddress = item;
                this.show = false
            },
            //获取用户订单
            getShopbag(){
                let tokenString = this.$cookies.get('tokenString');
                if(!tokenString){
                    return this.$router.push({name:"Login"})
                }

                this.$toast.loading({
                    message:'加载中.....',
                    forbidClick:true,
                    duration:0
                });

                this.axios({
                    method:"GET",
                    url:this.baseUrl + '/commitShopcart',
                    params:{
                        appkey:this.appkey,
                        tokenString,
                        sids:JSON.stringify(this.sids)
                    }
                }).then(res => {
                    this.$toast.clear();
                    if(res.data.code == 700){
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 3000,
                            });
                        return this.$router.push({ name: "Login" });
                    }
                    if(res.data.code === 50000) {
                        if(res.data.result.length === 0){
                            return this.$router.push({path:'/'})
                        }
                        res.data.result.forEach(v => {
                            this.proInfo.count += v.count;
                            this.proInfo.total += v.count * v.price
                        })
                        this.buyShopbag = res.data.result
                    }
                    else{
                        this.$toast({
                            message:res.data.msg,
                            forbidClick:true,
                            duration:3000
                        })
                    }
                }).catch(err => {
                    this.$toast.clear();
                    console.log('err==>' , err);
                })
            },
            //结算功能
            buy(){
                //确认地址选项
                if (!this.currentAddress.aid) {
                    return this.$toast({
                    message: "选择收货地址",
                    forbidClick: true,
                    duration: 3000,
                    });
                }

                let tokenString = this.$cookies.get('tokenString');
                if(!tokenString){
                    return this.$router.push({name:"Login"})
                }

                let data = {
                    appkey:this.appkey,
                    tokenString,
                    sids:JSON.stringify( this.sids ),
                    phone:this.currentAddress.tel,
                    address:this.currentAddress.address,
                    receiver:this.currentAddress.name
                }

                this.axios({
                    method:"POST",
                    url:this.baseUrl + '/pay',
                    data
                }).then(res => {
                    this.$toast.clear();

                    if(res.data.code == 700){
                        this.$toast({
                            message:res.data.msg,
                            forbidClick:true,
                            duration:3000
                        })
                        return this.$router.push({name:"Login"})
                    }
                    if(res.data.code === 60000) {
                        this.changeShopbagNum(this.shopbagNum - this.sids.length);
                        this.$router.push({name:"OrderDetails"})
                    }else{
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 3000,
                        });
                    }
                }).catch(err => {
                    this.$toast.clear();
                    console.log('err==>' , err);
                })
            }
        },
        created(){
            this.sids = this.$route.query.sids.split('-')
            this.getShopbag()
            this.getCurrentAddress()
        }
    }
</script>

<style lang="less" scoped>
.settlement{
    background-color: #e5e5e5;
    .order{
        padding: 10px 10px 50px;
        >div{
            padding: 5px;
            background-color: #fff;
            text-align: left;
            border-radius: 10px;
            /deep/ .van-cell {
                border-radius: 10px;
                /deep/ .van-cell__title{
                    flex: none;
                }
            }
            &.address{
                margin-bottom: 10px;
                background-color: #fff;
                border-radius: 10px;
                .text{
                    padding: 10px 16px;
                    // margin: 10px 0 5px 0;
                    .top{
                        margin: 10px 0;
                        display: flex;
                        .name{
                            font-size: 16px;
                            color: blue;
                            font-weight: bold;
                            margin-right: 20px;
                        }
                        .tel{
                            font-size: 14px;
                            margin-right: 20px;
                        }
                        .default{
                            border-radius: 20px;
                            color: #fff;
                            background-color: blue;
                            padding:0 5px;
                        }
                    }
                    .bottom{
                        text-align: left;
                        font-size: 14px;
                    }
                }
                /deep/ .van-popup{
                    border-radius: 0;
                    text-align: left;
                    .content{}
                }
            }
        }
    }
    .pay-btn{
        position: fixed;
        left: 0;
        bottom: 0;
        padding: 10px;
        width: calc(100% - 20px);
    }
}
</style>
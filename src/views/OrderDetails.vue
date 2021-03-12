<template>
    <div class="orderDetails">
        <van-nav-bar
        title="订单详情"
        left-text="返回"
        left-arrow
        @click-left="back"
        />
        <div class="content">
            <div class="bg"></div>
            <div class="block">
                <van-tabs v-model="activeTabIndex" @change="changeOrderStatus" :line-height="2">
                    <van-tab v-for="(v,i) in nav" :key="i" :title="v.title">
                        <div class="tab-content">
                            <div v-if="orderlis.length > 0">
                                <div class="tab-box" v-for="(v1, i1) in orderlis" :key="i1">
                                    <Order :pro-info="v1.proInfo">
                                        <template #title>
                                            <div class="pay-title-box">
                                                <div class="pay-t">{{v1.oid}}</div>
                                                <div class="pay-s" v-if="v1.status === 2">
                                                    <div class="pay-text">已完成</div>
                                                    <div class="pay-icon" @click="removeOrder(v1.oid, i1)">
                                                        <van-icon name="delete-o" />
                                                    </div>
                                                </div>
                                                <div class="pay-s" v-if="v1.status === 1">
                                                    <div class="pay-text" @click="ConfirmOrder(v1, i1)">确认订单</div>
                                                </div>
                                            </div>
                                        </template>
                                        <template #order-item>
                                            <OrderItem v-for="(v2, i2) in v1.data" :key="i2" :product="v2"></OrderItem>
                                        </template>
                                    </Order>
                                </div>
                            </div>
                            <div v-else>
                                <van-empty description="没有该状态的订单" />
                            </div>
                        </div>
                    </van-tab>
                </van-tabs>
            </div>
        </div>
    </div>
</template>

<script>
import Order from '../components/Order.vue'
import OrderItem from '../components/OrderItem.vue'
    export default {
        name:'OrderDetails',
        data(){
            return {
                activeTabIndex: 0,

                nav:[
                    {
                        title:'全部',
                        status:0
                    },
                    {
                        title:'运输中',
                        status:1
                    },
                    {
                        title:'已完成',
                        status:2
                    },
                ],

                //对应状态订单列表
                orderlis:[]
            }
        },
        components:{
            Order,
            OrderItem
        },
        created(){
            this.getOrderLis(0)
        },
        methods:{
            back(){
                this.$router.back()
            },
            //获取订单数据
            getOrderLis(status){
                let tokenString = this.$cookies.get('tokenString');
                if(!tokenString){
                    return this.$router.push({name:"Login"})
                }
                this.$toast.loading({
                    message:'加载中.....',
                    frobidClick:true,
                    duration:0
                })

                this.axios({
                    method:"GET",
                    url:this.baseUrl + '/findOrder',
                    params:{
                        appkey:this.appkey,
                        tokenString,
                        status
                    }
                }).then(res => {
                    this.$toast.clear();

                    if(res.data.code == 700) {
                        this.$toast({
                            message:res.data.msg,
                            frobidClick:true,
                            duration:3000
                        })
                        return this.$router.push({name:"Login"})
                    }
                    if(res.data.code === 70000){
                        let products = [];

                        let oids = [];
                        // console.log('res==>',res);
                        res.data.result.forEach(v => {
                            v.small_img = v.smallImg;
                            //查找oid，并整合数据
                            if(oids.indexOf(v.oid) === -1){
                                // console.log('v===>',v);
                                let o = {
                                    oid:v.oid,
                                    status:v.status,
                                    proInfo :{
                                        date:v.updatedAt,
                                        count:0,
                                        total:0
                                    },
                                    data:[]
                                };
                                oids.push(v.oid);
                                products.push(o)
                                // console.log('data==>',o.proInfo.date);
                            };
                        })

                        products.forEach(v => {
                            res.data.result.forEach(item => {
                                if(v.oid === item.oid) {
                                    // console.log('item===>',item);
                                    v.data.push(item);
                                    v.proInfo.count += item.count;
                                    v.proInfo.total += item.count * item.price
                                }
                            })
                        })
                        this.orderlis = products
                    }
                    else{
                        this.$toast({
                            message:res.data.msg,
                            frobidClick:true,
                            duration:3000
                        })
                    }
                }).catch(err => {
                    this.$toast.clear();
                    console.log('err==>' , err);
                })
            },

            //切换订单
            changeOrderStatus(name,title){
                this.getOrderLis(name)
            },

            //确认收货
            ConfirmOrder(item , index){
                let tokenString = this.$cookies.get('tokenString');

                if(!tokenString) {
                    return this.$router.push({name:'Login'})
                }

                this.$toast.loading({
                    message:'加载中',
                    frobidClick:true,
                    duration:0
                })

                this.axios({
                    method:"POST",
                    url:this.baseUrl + '/receive',
                    data:{
                        appkey:this.appkey,
                        tokenString,
                        oid:item.oid
                    }
                }).then(res => {
                    this.$toast.clear();

                    if(res.data.code == 700){
                        this.$toast({
                            message:res.data.msg,
                            frobidClick:true,
                            duration:3000
                        })
                        return this.$router.push({name:"Login"})
                    }
                    if(res.data.code === 80000) {
                        item.status = 2
                        if(this.activeTabIndex === 1){
                            this.orderlis.splice(index,1)
                        }
                    }

                    this.$toast({
                        message:res.data.msg,
                        frobidClick:true,
                        duration:3000
                    })
                }).catch(err => {
                    this.$toast.clear();
                    console.log('err==>',err);
                })
            },

            //删除订单
            removeOrder(oid,index){
                let tokenString = this.$cookies.get('tokenString');
                if(!tokenString){
                    return this.$router.push({name:"Login"})
                }

                this.$toast.loading({
                    message:'加载中.....',
                    frobidClick:true,
                    duration:0
                });

                this.axios({
                    method:"POST",
                    url:this.baseUrl + '/removeOrder',
                    data:{
                        appkey:this.appkey,
                        tokenString,
                        oid
                    }
                }).then(res => {
                    this.$toast.clear();

                    if(res.data.code == 700){
                        this.$toast({
                            message:res.data.msg,
                            frobidClick:true,
                            duration:3000
                        })
                        return this.$router.push({name:"Login"})
                    }
                    if(res.data.code === 90000) {
                        this.orderlis.splice(index,1)
                    }

                    this.$toast({
                        message:res.data.msg,
                        frobidClick:true,
                        duration:3000
                    })
                }).catch(err => {
                    this.$toast.clear();
                    console.log('err==>',err);
                })
            }
        }
    }
</script>

<style lang="less" scoped>
.orderDetails{
    .content{
        width: 100%;
        position: relative;
        .bg{
            height: 80px;
            width: 100%;
            background-color: #e4393c;
        }
        .block{
            position: absolute;
            top: 65px;
            padding:0 5px 0px;
            text-align: left !important;
            margin: auto;
            width: calc(100% - 10px);
            overflow: hidden;
            // background-color: #e8e6e6;
            /deep/ .van-tabs__wrap{
                margin-bottom: 10px;
                border-radius: 10px;
            }
            .pay-title-box{
                display: flex;
                justify-content: space-between;
                .pay-s{
                    display: flex;
                    i{
                        line-height: 16px;
                    }
                }
            }
            .tab-box{
                // margin-bottom: 10px;
                padding: 10px 5px 10px;
                // padding-top: 10px;
                background-color: #fff;
                border-top-left-radius: 10px;
                border-top-right-radius: 10px;
                border-bottom: 10px solid #e8e6e6;
            }
        }
    }
}
</style>
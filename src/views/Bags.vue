<template>
    <div class="bags">
        <van-nav-bar
        title="购物袋"
        left-text="返回"
        left-arrow
        right-text="编辑"
        @click-left="back"
        @click-right="EditMode = true"
        v-show="!EditMode"
        />
         <van-nav-bar
        title="购物袋"
        left-text="返回"
        left-arrow
        right-text="完成"
        @click-left="back"
        @click-right="EditMode = false"
        v-show="EditMode"
        />
        <div v-if="shopBagsData.length > 0">
            <van-swipe-cell v-for="(v,i) in shopBagsData" :key="v.sid">
                <div class="check">
                    <van-checkbox v-model="v.isselected" @click="changeSelect"></van-checkbox>
                </div>
                <div class="pro-info">
                    <div class="pro-img">
                        <img :src="v.small_img" />
                    </div>
                    <div class="pro-text">
                        <div class="top-text">
                            <div class="top">
                                <div class="name">{{v.name}}</div>
                                <div class="rule">{{v.rule}}</div>
                            </div>
                            <div class="enname">{{v.enname}}</div>
                        </div>
                        <div class="bottom-text">
                            <div class="price">￥<span>{{v.price}}</span></div>
                            <van-stepper v-model="v.count" theme="round" button-size="22" disable-input @change="totalPrice"/>
                        </div>
                    </div>
                </div>
                <template #right>
                    <van-button square text="删除" type="danger" class="delete-button" @click="deleshop([v.sid],i)"/>
                </template>
            </van-swipe-cell>
        </div>
        <div v-else>
            <van-empty description="购物车空空的，赶紧来逛一逛吧">
                <van-button round type="danger" class="bottom-button" @click="toBuy">开始购物</van-button>
            </van-empty>
        </div>
        <van-submit-bar :price="total" button-text="提交订单" @submit="Submit" v-show="!EditMode">
            <van-checkbox v-model="selected" @click="allSelect">全选</van-checkbox>
        </van-submit-bar>
        <van-submit-bar  button-text="删除所选" @submit="EditModedelo" v-show="EditMode" class="editmode">
            <van-checkbox v-model="selected" @click="allSelect">全选</van-checkbox>
        </van-submit-bar>
    </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
    export default {
        name:'Bags',
        data(){
            return {
                //购物车数组
                shopBagsData:[],

                //全选状态
                selected:false,

                //总金额
                total:0,

                //编辑模式
                EditMode:false
            }
        },
        computed: {
            ...mapState(["shopbagNum"])
        },
        methods:{
            ...mapMutations(["changeShopbagNum"]),
            back(){
                this.$router.back()
            },
            getshopBags(){
                let tokenString = this.$cookies.get('tokenString');

                if(!tokenString){
                    return this.$router.push({name:"Login"})
                }

                this.$toast.loading({
                    message:'加载中....',
                    forbidClick:true,
                    duration:0
                })

                this.axios({
                    method:"GET",
                    url:this.baseUrl + '/findAllShopcart',
                    params : {
                        appkey:this.appkey,
                        tokenString
                    }
                }).then(res => {
                    this.$toast.clear();
                    // console.log(res);

                    if(res.data.code === 700){
                        this.$toast({
                            message:res.data.msg,
                            forbidClick:true,
                            duration:3000
                        })
                        return this.$router.push({name:"Login"})
                    }

                    if(res.data.code === 5000){
                        console.log(res);
                        res.data.result.forEach(v => {
                            v.isselected = false;
                        });

                        this.shopBagsData = res.data.result;


                        // res.data.result.forEach(v => {
                            
                        // })
                    }
                })
            },
            allSelect(){
                this.shopBagsData.forEach(v => {
                    v.isselected = this.selected
                })
                this.totalPrice()
            },
            totalPrice(){
                let total = 0
                this.shopBagsData.forEach(v => {
                    if(v.isselected){
                        total += v.price * v.count
                    }
                })
                this.total = total * 100
                console.log(this.total);
            },
            changeSelect(){
                this.totalPrice();
                for (let i = 0;i < this.shopBagsData.length;i++){
                    if(!this.shopBagsData[i].isselected){
                        this.selected = false;
                        return
                    }
                }

                this.selected = true
            },
            deleshop(sid,index){
                let tokenString = this.$cookies.get('tokenString');

                if(!tokenString){
                    return this.$router.push({name:"Login"});
                }

                this.$toast.loading({
                    message:'加载中...',
                    forbidClick:true,
                    duration:0
                })
                this.axios({
                    method:"POST",
                    url:this.baseUrl + '/deleteShopcart',
                    data:{
                        appkey:this.appkey,
                        tokenString,
                        sids:JSON.stringify(sid)
                    }
                }).then(res => {
                    console.log('访问成功');
                    console.log(sid);
                    this.$toast.clear();
                    console.log('res==>>',res);
                    if(res.data.code === 700){
                        console.log('还没登陆');
                        this.$toast({
                            message:res.data.msg,
                            forbidClick:true,
                            duration:3000
                        })
                        return this.$router.push({name:"Login"})
                    }

                    if(res.data.code == 7000){
                        console.log('原来的===》',this.changeShopbagNum);
                        if(index != undefined){
                            this.shopBagsData.splice(index,1);

                            this.changeShopbagNum(this.shopbagNum - 1);

                            this.totalPrice()
                            console.log('删除成功');
                            console.log('删除后的===》',this.changeShopbagNum);
                        }
                    }
                })
            },
            EditModedelo(){
                let sids = [];
                this.shopBagsData.forEach(v => {
                    if(v.isselected){
                        sids.push(v.sid)
                    }
                })

                let tokenString = this.$cookies.get('tokenString');

                if(!tokenString){
                    return this.$router.push({name:"Login"});
                }

                this.$toast.loading({
                    message:'加载中...',
                    forbidClick:true,
                    duration:0
                })
                this.axios({
                    method:"POST",
                    url:this.baseUrl + '/deleteShopcart',
                    data:{
                        appkey:this.appkey,
                        tokenString,
                        sids:JSON.stringify(sids)
                    }
                }).then(res => {
                    this.$toast.clear()
                    if(res.data.code == 700){
                        this.$toast({
                            message:res.data.msg,
                            forbidClick:true,
                            duration:3000
                        })
                        return this.$router.push({name:"Login"})
                    }
                    if(res.data.code === 7000){
                        for(let i =0;i < this.shopBagsData.length;i++){
                            if(this.shopBagsData[i].isselected){
                                this.shopBagsData.splice(i,1)
                                i--
                            }
                        }

                        this.changeShopbagNum(this.shopbagNum - sids.length);
                        if(this.shopbagNum == 0){
                            this.selected = false;
                        }
                        this.totalPrice()
                    }
                })
            },
            Submit(){

                let tokenString = this.$cookies.get('tokenString')
                if(!tokenString){
                    return this.$router.push({name:"Login"})
                }


                let sids = []
                this.shopBagsData.forEach(v => {
                    if(v.isselected){
                        sids.push(v.sid)
                    }
                })

                if(sids.length === 0) {
                    this.$toast({
                        message:'请选择购买的商品',
                        forbidClick:true,
                        duration:3000
                    })
                    return
                }

                this.$router.push({name:'Settlement',query:{sids:sids.join('-')}})
            },
            //购物
            toBuy(){
                this.$router.push({path:'/'})
            }
        },
        created(){
            this.getshopBags()
        }
    }
</script>

<style lang="less" scoped>
.bags{
    margin-bottom: 100px;
    padding: 0 5px;
    /deep/ .van-submit-bar{
        bottom: 50px;
    };
    /deep/ .van-swipe-cell__wrapper{
        height: 80px;
        padding: 5px;
        margin: 10px 0;
        display: flex;
        // justify-content: space-between;
        background-color: #ece9e9;
        // box-shadow: 10px 10px 5px #888888;
        border-radius: 10px;
        .check{
            // flex: 1;
            display: flex;
            align-items: center;
            padding: 0 10px 0 0;
        }
        .pro-info{
            display: flex;
            flex: 1;
            .pro-img{
                height: 100%;
                width: 80px;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            .pro-text{
                margin: 0 5px;
                flex: 1;
                .top-text{
                    .top{
                        text-align: left;
                        margin: 5px 0;
                        div{
                            display: inline-block;
                            margin: 0 10px;
                            &.name{
                                font-size: 14px;
                                color: #000;
                            }
                            &.rule{
                                font-size: 12px;
                                color: #666;
                            }
                        }
                    }
                    .enname{
                        color: #666;
                        font-size: 12px;
                        text-align: left;
                        padding-left: 10px;
                    }
                }
                .bottom-text{
                    display: flex;
                    justify-content: space-between;
                    padding: 10px;
                    .price{
                        font-size: 16px;
                        font-weight: bold;
                        color: #e4393c;
                    }
                }
            }
        }
        .van-swipe-cell__right{
            button{
                width: 100%;
                height: 100%;
            }
        }
    }
    .editmode{
        /deep/ .van-submit-bar__bar{
            justify-content: space-between;
        }
    }
}
.bottom-button {
  width: 160px;
  height: 40px;
}
</style>
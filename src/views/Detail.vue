<template>
    <div class="Detail">
        <van-nav-bar
        :title="`${vname}`"
        left-text="返回"
        left-arrow
        class="Detailnav"
        @click-left="back"
        />
        <div class="pcr">
            <img :src="`${detailData.large_img}`">
        </div>
        <div class="text">
            <div class="top">
                <div class="left">
                    <p>{{detailData.name}}</p>
                    <p>{{detailData.enname}}</p>
                </div>
                <div class="right">
                    ￥<span>{{detailData.price}}</span>
                </div>
            </div>
            <div class="options">
                <div class="option" v-for="(v,i) in detailData.lis" :key="i">
                    <div class="title">{{v.title}}</div>
                    <div class="choose">
                        <div v-for="(va,ia) in v.li" :key="ia"  :class="{active:v.lisIndex === ia}" @click="click(v, ia)">{{va.title}}</div>
                    </div>
                </div>
            </div>
            <div class="num">
                <div class="choose-num">选择数量</div>
                <div class="AS">
                    <van-stepper v-model="num" theme="round" button-size="22" disable-input />
                </div>
            </div>
            <div class="describe">
                <p>商品描述</p>
                <ul>
                    <li v-for="(v,i) in detailData.desc" :key="i">{{ (i+1) +'、'+ v }}</li>
                </ul>
            </div>
        </div>
        <van-goods-action>
            <van-goods-action-icon :icon="likeflag ?'like':'like-o'" :text="likeflag ?'已收藏':'收藏'"  :color="likeflag ? 'red':'#000'" @click="changelike"/>
            <van-goods-action-icon icon="cart-o" text="购物车" :badge="shopbagNum > 0?shopbagNum:''" @click="toBags"/>
            <van-goods-action-button type="warning" text="加入购物车" color="#d1a248" @click="addShopbag"/>
            <van-goods-action-button type="danger" text="立即购买" color="#7232dd"/>
        </van-goods-action>
    </div>
</template>

<script>
import {mapState , mapMutations} from 'vuex'
export default {
        name:'Detail',

        data(){
            return {
                pid:'',
                vname:'',
                detailData:{},
                num:1,
                likeflag:false
            };
        },
        computed:{
            ...mapState(['shopbagNum'])
        },
        methods:{
            ...mapMutations(['changeShopbagNum']),
            getDetailData(){
                console.log(this.$route.params.pid);
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0
                });

                this.axios({
                    method:'GET',
                    url : this.baseUrl + '/productDetail',
                    params: {
                        appkey:this.appkey,
                        pid : this.$route.params.pid
                    }
                }).then(res => {
                    this.$toast.clear();
                    if(res.data.code === 600){
                        let data = res.data.result[0];
                        this.vname = data.name
                        let check = ['cream' , 'milk' , 'sugar' , 'tem']

                        data.lis = [];

                        check.forEach(i => {
                            if(!data[i]){
                                return
                            }
                            
                            let options = data[i].split('/');

                            let lisText = {
                                title:data[i + '_desc'],
                                li:[],
                                lisIndex:0
                            }

                            options.forEach(v => {
                                lisText.li.push({title : v})
                            })

                            data.lis.push(lisText)
                        })

                        data.desc = data.desc.split(/\n/);

                        console.log(data);

                        this.detailData = data
                    }else{
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 3000
                        })
                    }
                    
                }).catch(err => {
                    this.$toast.clear();
                    console.log('err==>' , err);
                })
            },
            back(){
                this.$router.back()
            },
            click(v,i){
                if(v.lisIndex === i){
                    return
                }
                v.lisIndex = i
            },
            changelike(){
                this.likeflag = !this.likeflag
                if(this.likeflag){
                    this.Like()
                }else{
                    this.noLike()
                }
            },
            Like(){
                let tokenString = this.$cookies.get('tokenString');

                if(!tokenString){
                    return this.$router.push({name:'Login'})
                }

                this.$toast.loading({
                    message: "加载中...",
                    forbidClick: true,
                    duration: 0,
                })

                this.axios({
                    method:"POST",
                    url:this.baseUrl + '/like',
                    data:{
                        appkey:this.appkey,
                        pid:this.pid,
                        tokenString
                    }
                }).then(res =>{
                    this.$toast.clear()
                    if(res.data.code === 700){
                        this.$toast({
                            message: res.data.msg,
                            forbidClick:true,
                            duration:3000
                        });

                        return this.$router.push({name:"Login"})
                    }else if(res.data.code === 800){
                        this.$toast({
                            message : '已收藏',
                            forbidClick:true,
                            duration:2000
                        })
                    }else{
                        this.$toast({
                            message :res.data.msg,
                            forbidClick:true,
                            duration:3000
                        })
                    }
                    // console.log('收藏商品接口res==>' , res);
                }).catch(err => {
                    this.$toast.clear();
                    console.log('err==>' , err);
                })
            },
            noLike(){
                let tokenString = this.$cookies.get('tokenString');

                if(!tokenString){
                    return this.$router.push({name:'Login'})
                }

                this.$toast.loading({
                    message: "加载中...",
                    forbidClick: true,
                    duration: 0,
                });

                this.axios({
                    method:"POST",
                    url:this.baseUrl + '/notlike',
                    data:{
                        appkey:this.appkey,
                        pid:this.pid,
                        tokenString,
                    }
                }).then(res => {
                    this.$toast.clear();

                    if(res.data.code === 700){
                        this.$toast({
                            message:res.data.msg,
                            forbidClick:true,
                            duration:3000
                        })
                        return this.$router.push({name:"Login"})
                    }else if(res.data.code === 900){
                        this.$toast({
                            message : '取消收藏',
                            forbidClick:true,
                            duration:2000
                        })
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
            },
            // ...mapMutations('changeShopbagNum'),
            addShopbag(){
                let tokenString = this.$cookies.get("tokenString");
                if (!tokenString) {
                    console.log("浏览器token不存在");
                    return this.$router.push({ name: "Login" });
                }
                let rules = [];
                
                this.detailData.lis.forEach(v => {
                    rules.push(v.li[v.lisIndex].title)
                })

                this.$toast({
                    message:'加载中',
                    forbidClick:true,
                    duration:0
                })

                this.axios({
                    method:'POST',
                    url:this.baseUrl + '/addShopcart',
                    data:{
                        pid:this.pid,
                        count:this.num,
                        rule:rules.join('/'),
                        appkey:this.appkey,
                        tokenString
                    }
                }).then(res => {
                    this.$toast.clear();
                    if(res.data.code === 700){
                        this.$toast({
                            message:res.data.msg,
                            forbidClick:true,
                            duration:3000,
                        })
                        return this.$router.push({name:'Login'})
                    }
                    if(res.data.code === 3000){
                        if(res.data.status === 1){
                            this.changeShopbagNum(this.shopbagNum + 1);

                            this.$toast({
                                message:res.data.msg,
                                forbidClick:true,
                                duration:1000
                            })
                            console.log(this.shopbagNum);
                        }
                    }else{
                        this.$toast({
                            message:res.data.msg,
                            forbidClick:true,
                            duration:3000
                        })
                    }
                    console.log(res);
                }).catch(err => {
                    this.$toast.clear();
                    console.log('err==>' , err);
                })
                //创建添加的购物车种类数组
                // console.log(this.detailData);
            },
            toBags(){
                this.$router.push({name:"Bags"})
            },
            checkLike(){
                let tokenString = this.$cookies.get("tokenString");

                if(!tokenString){
                    return
                }

                this.$toast.loading({
                    message:'加载中...',
                    forbidClick:true,
                    duration:0
                })

                this.axios({
                    method:"GET",
                    url:this.baseUrl + '/findlike',
                    params: {
                        appkey:this.appkey,
                        pid:this.pid,
                        tokenString
                    }
                }).then(res => {
                    this.$toast.clear();

                    if(res.data.code === 700){
                        return
                    }

                    if(res.data.code === 1000){
                        if(res.data.result.length > 0){
                            this.likeflag = true
                        }
                    }
                }).catch(err => {
                    this.$toast.clear();
                    console.log('err==>' , err);
                })
            }
        },
        created(){
            this.pid = this.$route.params.pid;

            this.getDetailData();

            this.checkLike()
        }
    }
</script>

<style lang="less" scoped>
.Detail{
    position: relative;
    p{
        margin: 0;
    }
    .Detailnav{
        background-color: #d1a248;
        color: #fff;
        /deep/ .van-nav-bar__left{
            background-color: rgba(0, 0, 0, 0.3);
            // color: #fff;
            i{
                color: #fff;
            }
            span{
                color: #fff;
            }
        }
        /deep/ .van-ellipsis{
            color: #fff;
        }
    }
    .pcr{
        width: 100%;
        height: 250px;
        img{
            width: 100%;
            height: 100%;
        }
    }
    .text{
        position: absolute;
        top: 250px;
        width: 90%;
        left: 0;
        right: 0;
        margin: 0 auto;
        background-color: rgb(180, 178, 178);
        border-top-left-radius: 15px;
        border-top-right-radius: 15px;
        padding: 0 10px;
        .top{
            padding-top: 10px;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .left{
                p:nth-child(1){
                    font-size: 16px;
                    text-align: left;
                    text-indent: 5px;
                    color: rgb(100,125,181);
                    font-weight: bold;
                }
                p:nth-child(2){
                    font-size: 12px;
                    color: rgb(153,166,166);
                }
            }
            .right{
                font-size: 16px;
                color: rgb(12,52,186);
                font-weight: bold;
            }
        }
        .options{
            margin-top: 20px;
            margin-bottom: 10px;
            border-bottom: 1px solid grey;
            width: 100%;
            .option{
                margin: 10px 0;
                text-align: left;
                .title{
                    display: inline-block;
                    margin-right: 20px;
                    min-width: 24px;
                }
                .choose{
                    display: inline-block;
                    div{
                        box-sizing: border-box;
                        min-width: 64px;
                        text-align: center;
                        border-radius: 30px;
                        padding: 5px 20px;
                        background-color: rgb(232,232,232);
                        color: #000;
                        display: inline-block;
                        margin: 0 10px;
                        &.active{
                            background-color: rgb(12,52,186);
                            color: #fff;
                        }
                    }
                }
            }
        }
        .num{
            padding: 10px 0;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid grey;
            .choose-num{
                font-size: 16px;
            }
            /deep/ button{
                background-color: #ec6941;
            }
        }
        .describe{
            margin: 10px 0;
            text-align: left;
            p{
                margin: 5px 0;
                font-size: 14px;
            }
            ul{
                li{
                    margin: 5px;
                    font-size: 12px;
                    margin: 10px 0;
                }
            }
        }
    }
}
</style>
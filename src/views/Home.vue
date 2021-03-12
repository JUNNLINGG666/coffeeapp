<template>
    <div class="home">
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
            <van-swipe-item v-for="(img , index) in banner" :key="index" @click="toDetail(img.pid)">
                <img :src="img.bannerImg" class="bannerImg">
            </van-swipe-item>
        </van-swipe>
        <div class="hotgoods">
           <div class="hotTitle">
               <span>热卖专区</span>
           </div>
            <div class="goods">
                <div v-for="v in hotArr" :key="v.id" @click="toDetail(v.pid)">
                    <div class="pcr">
                        <img :src="v.largeImg">
                        <img src="../assets/imgs/热门.png">
                    </div>
                    <p>{{ v.name }}</p>
                    <p>{{ v.enname }}</p>
                    <p>
                        ￥<span>{{ v.price }}</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name:'Home',
        data(){
            return {
                banner:[],
                hotArr:[]
            }
        },
        methods:{
            getBannerData() {
                this.$toast.loading({
                    message:'加载中....',
                    forbidClick: true,
                    duration: 0
                })

                this.axios({
                    method:'GET',
                    url:this.baseUrl + '/banner',
                    params:{
                        appkey : this.appkey
                    }
                }).then(res => {
                    this.$toast.clear();

                    if(res.data.code === 300){
                        this.banner = res.data.result;
                    }else{
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 3000
                        })
                    }
                }).catch(err => {
                    this.$toast.clear();
                    console.log('err ==> ', err);
                })
            },
            getHotData() {
                this.$toast.loading({
                    message:'加载中....',
                    forbidClick: true,
                    duration: 0
                })

                this.axios({
                    method:'GET',
                    url:this.baseUrl + '/typeProducts',
                    params:{
                        appkey:this.appkey,
                        key:'isHot',
                        value:1
                    }
                }).then(res =>{
                    this.$toast.clear();

                    if(res.data.code === 500){
                        this.hotArr = res.data.result;
                        // console.log(this.hotArr);
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
            toDetail(pid){
                this.$router.push({name:'Detail',params:{pid}})
            }
        },
        created(){
            this.getBannerData();
            this.getHotData()
        }
    }
</script>

<style lang="less" scoped>
.home{
    background-color: #fff;
    .my-swipe{
        height: 240px;
        img{
            width: 100%;
            height: 100%;
        }
    }
    .hotgoods{
        margin-top: 20px;
        .hotTitle{
            width: 100%;
            height: 50px;
            padding-top: 10px;
            box-sizing: border-box;
            background-color:#eeeeee;
            span{
                display: block;
                width: 80px;
                height: 30px;
                font-size: 16px;
                line-height: 20px;
                padding: 5px;
                border-top-right-radius: 10px;
                background-color: #d1a248;
                box-sizing: border-box;
                animation: hotbuy 10s linear infinite;
            }
        }
        .goods{
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            margin-top: 5px;
            padding-bottom: 50px;
            >div{
                width: calc(50% - 5px);
                background-color:#eeeeee;
                box-sizing: border-box;
                padding: 5px;
                margin: 0px 5px 5px 5px;
                text-align: left;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                &:nth-child(2n){
                    margin-right: 0;
                }
                &:nth-child(2n+1){
                    margin-left: 0;
                }
                .pcr{
                    width: 100%;
                    height: 60%;
                    position: relative;
                    img:nth-child(1){
                        width: 100%;
                        height: 100%;
                    }
                    img:nth-child(2){
                        width: 20px;
                        height: 20px;
                        // display: block;
                        position: absolute;
                        top: 0;
                        right: 0px;
                    }
                }
                p{
                    margin: 0;
                    &:nth-child(2){
                        font-size: 16px;
                        color: rgb(100,101,151);
                    }
                    &:nth-child(3){
                        color: rgb(196,166,153);
                        font-size: 10px;
                    }
                    &:nth-child(4){
                        color: rgb(12,52,186);
                        font-size: 15px;
                        font-weight: bold;
                    }
                }
            }
        }
    }
}
@keyframes hotbuy {
    0% {transform: translateX(0px);}
    50% {transform: translateX(295px);}
    100%{transform: translateX(0px);}
}
</style>
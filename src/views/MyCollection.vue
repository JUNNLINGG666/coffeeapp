<template>
    <div class="myCollection">
        <div class="nav">
            <van-nav-bar
            title="个人收藏"
            left-text="返回"
            left-arrow
            @click-left="back"
            />
        </div>
        <div class="count">
            <div class="bg"></div>
            <div v-if="collectionlis.length > 0">
                <div class="last">
                    <div class="car">
                        <van-swipe-cell v-for="(v,i) in collectionlis" :key="i">
                            <van-card
                                :desc="v.desc"
                                :title="v.name"
                                class="goods-card"
                                :thumb="v.smallImg"
                            />
                            <template #right>
                                <van-button square text="删除" type="danger" class="delete-button" />
                            </template>
                        </van-swipe-cell>
                    </div>
                </div>
            </div>
             <div v-else>
                <van-empty description="购物车空空的，赶紧来逛一逛吧">
                    <van-button round type="danger" class="bottom-button" @click="toBuy">开始购物</van-button>
                </van-empty>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name:'MyCollection',
        data(){
            return {
                collectionlis:[]
            }
        },
        created(){
            this.getCollection()
        },
        methods:{
            back(){
                this.$router.back()
            },
            //获取收藏品
            getCollection(){
                let tokenString = this.$cookies.get('tokenString');

                if(!tokenString) {
                    this.$router.push({name:'Login'})
                }
                this.$toast.loading({
                    message:"加载中.....",
                    forbidClick:true,
                    duration:0
                });

                this.axios({
                    method:'GET',
                    url:this.baseUrl + '/findAllLike',
                    params:{
                        appkey:this.appkey,
                        tokenString
                    }
                }).then(res => {
                    this.$toast.clear();
                    if(res.data.code == 700) {
                        return this.$router.push({name:'Login'})
                    }
                    if(res.data.code === 2000){
                        this.collectionlis = res.data.result
                    }
                    console.log('res==>',res);
                })
            },
            toBuy(){
                this.$router.push({path:'/'})
            }
        }
    }
</script>

<style lang="less" scoped>
.myCollection{
    text-align: left;
    .count{
       display: flex;
       flex-direction: column;
       .bg{
           width: 100%;
           height: 150px;
           background-color: #c4393c;
       }
       .last{
           position: relative;
           padding: 0 10px;
           .car{
               width: calc(100% - 20px);
               border-radius: 10px;
               overflow: hidden;
               position: absolute;
               top: -40px;
           }
       }
    }
}
.goods-card {
  margin: 0;
  background-color: white;
}
.delete-button {
  height: 100%;
}
</style>
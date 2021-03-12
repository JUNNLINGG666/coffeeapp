<template>
    <div class="menu">
        <div class="tab">
           <van-tabs  @click="changeType">
                <van-tab v-for="v in typeArr" :title="v.typeDesc" :key="v.id">
                        <van-card
                        :price="v.price"
                        :desc="v.enname"
                        :title="v.name"
                        :thumb="v.smallImg"
                        v-for="v in tablist"
                        :key="v.id"
                        :tag="v.isHot>0?'Hot':''"
                        @click="toDetail(v.pid)"
                        />
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                typeArr:[],
                typevalue:'',
                tablist:[]
            }
        },
        methods:{
            //获取商品类型
            gettype(){
                this.$toast.loading({
                    message:'加载中....',
                    forbidClick:true,
                    duration:0
                });

                this.axios({
                    method:"GET",
                    url:this.baseUrl + '/type',
                    params:{
                        appkey:this.appkey
                    }
                }).then(res => {
                    this.$toast.clear()
                    console.log('res==>',res);
                    this.typeArr = res.data.result
                    console.log('typeArr==>',this.typeArr);
                })
            },
            //根据商品类型获取商品
            getTypePro(){
                 this.$toast.loading({
                    message:'加载中....',
                    forbidClick:true,
                    duration:0
                });

                this.axios({
                    method:"GET",
                    url:this.baseUrl + '/typeProducts',
                    params:{
                        appkey:this.appkey,
                        key:'type',
                        value:this.typevalue
                    }
                }).then(res => {
                    this.$toast.clear(),
                    console.log('res==>',res);
                    this.tablist = res.data.result
                    console.log('tablist==>',this.tablist);
                })
            },
            //点击商品进去详情
            toDetail(pid){
                this.$router.push({name:'Detail',params:{pid}})
            },
            //切换类型
            changeType(i){
                this.typevalue = this.typeArr[i].type;
                console.log('变化之后的typevalue==>',this.typevalue);
                this.getTypePro()
                console.log('变化之后的tablist==>',this.tablist);
            }
        },
        created(){
            this.typevalue = 'latte'
            this.gettype(),
            this.getTypePro()
        }
    }
</script>

<style lang="less" scoped>
/deep/ .van-tab__pane{
    padding-bottom: 50px;
    text-align: left;
    padding: 10px 10px 60px;
    >div{
        background-color: #d1d0d0;
        border-radius: 20px;
    }
}
</style>
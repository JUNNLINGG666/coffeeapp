<template>
    <div class="address">
        <div class="nav">
            <van-nav-bar
            title="地址列表"
            left-text="返回"
            left-arrow
            @click-left="back"
            />
        </div>
        <Card>
            <van-address-list
            :list="list"
            default-tag-text="默认"
            @add="onAdd"
            @edit="onEdit"
            />
        </Card>
    </div>
</template>

<script>
import Card from '../components/Card';
    export default {
        name:'AddressList',
        components:{
            Card
        },
        data() {
            return {
                list:[]
            }
        },
        methods: {
            onAdd() {
                this.$router.push({name:'AddressEdit'})
            },
            onEdit({aid}){
                this.$router.push({name:'AddressEdit',params:{aid}})
            },
            back(){
                this.$router.back()
            },
            getAddressList(){
                let tokenString = this.$cookies.get('tokenString');

                if(!tokenString){
                    console.log('浏览器token不存在');
                    return this.$router.push({name:"Login"})
                }

                this.$toast.loading({
                    message:'加载中....',
                    frobidClick:true,
                    duration:0
                });

                this.axios({
                    method:"GET",
                    url:this.baseUrl + '/findAddress',
                    params:{
                        appkey:this.appkey,
                        tokenString
                    }
                }).then(res => {
                    this.$toast.clear();

                    if(res.data.code == 700){
                        this.$toast({
                            message:res.data.msg,
                            frobidClick:true,
                            duration:3000,
                        })
                        return this.$router.push({name:"Login"})
                    }
                    if(res.data.code === 20000) {
                        console.log(res);
                        res.data.result.forEach(v => {
                            v.address = `${v.province}${v.city}${v.county}${v.addressDetail}`
                            v.isDefault = Boolean(v.isDefault)
                        })

                        this.list = res.data.result

                        console.log(this.list);
                    }
                    else{
                        this.$toast({
                            message:res.data.msg,
                            frobidClick:true,
                            duration:3000
                        });
                    }
                }).catch(err => {
                    this.$toast.clear();
                    console.log('err==>' , err);
                })
            }
        },
        created(){
            this.getAddressList()
         }
    }
</script>

<style lang="less" scoped>
/deep/ .van-address-item{
    border-radius: 0;
    border-bottom: 1px solid #d7cece;
    &:last-child{
        border: 0;
    }
}
</style>
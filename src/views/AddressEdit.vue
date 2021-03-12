<template>
    <div class="Changeaddress">
        <div class="nav">
            <van-nav-bar
            :title="aid?'修改地址':'新增地址'"
            left-text="返回"
            left-arrow
            @click-left="back"
            />
        </div>
        <Card>
            <van-address-edit
            :area-list="areaList"
            show-postal
            :show-delete="!!aid"
            show-set-default
            show-search-result
            :detail-maxlength="30"
            :area-columns-placeholder="['请选择', '请选择', '请选择']"
            :address-info="originAddressInfo"
            @save="save"
            />
        </Card>
    </div>
</template>

<script>
import Card from '../components/Card'
import areaList from '../assets/js/area'
    export default {
        name:'AddressEdit',
        components:{
            Card
        },
        data(){
            return {
                //省市区数据
                areaList,
                //编辑地址的aid
                aid:'',
                //编辑地址的初始值
                originAddressInfo:{}
            }
        },
        created(){
                this.aid = this.$route.params.aid;
                // console.log('1');
                // console.log(this.aid);
                this.getorigin()
        },
        methods:{
            back(){
                this.$router.back()
            },
            //保存
            save(value){
                console.log(value);
                if(this.aid){
                    console.log('点击有反应');
                    let isEdit = false;

                    for(let key in this.originAddressInfo) {
                        if(this.originAddressInfo[key] !== value[key]) {
                            isEdit = true
                            console.log('有数据被修改');
                            break;
                        }
                    }

                    if(isEdit) {
                        console.log('开始保存更改后数据');
                        let tokenString = this.$cookies.get('tokenString');

                        if(!tokenString) {
                            return this.$router.push({name:'Login'})
                        }

                        // console.log(value);
                        value.isDefault = Number(value.isDefault)
                        let data = {
                            ...value ,
                            tokenString ,
                            appkey:this.appkey,
                            aid:this.aid
                        }
                        console.log('data==>' , data);
                        this.$toast.loading({
                            message:'加载中...',
                            forbidClick:true,
                            duration:0
                        })

                        this.axios({
                            method:"POST",
                            url:this.baseUrl + '/editAddress',
                            data
                        }).then(res => {
                            console.log(res);
                            console.log('请求成功');
                            this.$toast.clear();

                            if(res.data.code == 700) {
                                console.log('没有登陆，回去登录页面');
                                this.$toast({
                                    message:res.data.msg,
                                    forbidClick:true,
                                    duration:3000
                                })
                                return this.$router.push({name:"Login"})
                            }

                            if(res.data.code === 30000) {
                                console.log('修改成功');
                                this.$router.push({name:"AddressList"})
                            }

                            this.$toast({
                                message:res.data.msg,
                                forbidClick:true,
                                duration:3000
                            })
                        }).catch(err => {
                            this.$toast.clear();
                            console.log('err==>' , err);
                        })
                    }else{
                        this.$toast({
                            message:'如不需要编辑，请点击左上角返回键',
                            forbidClick:true,
                            duration:2000
                        })
                    }
                }else{
                    let tokenString = this.$cookies.get('tokenString');

                    if(!tokenString){
                        return this.$router.push({name:"Login"})
                    }

                    let data = {
                        ...value,
                        tokenString,
                        appkey:this.appkey
                    }
                    delete data.country;
                    data.isDefault = Number(data.isDefault);

                    this.$toast.loading({
                        message:'加载中....',
                        forbidClick:true,
                        duration:0
                    });

                    this.axios({
                        method:"POST",
                        url:this.baseUrl + '/addAddress',
                        data
                    }).then(res => {
                        this.$toast.clear();

                        if(res.data.code === 700) {
                            this.$toast({
                                message:Res.data.msg,
                                forbidClick:true,
                                duration:3000
                            });

                            return this.$router.push({name:"Login"})
                        }

                        if(res.data.code === 9000){
                            this.$toast({
                                message:'添加成功',
                                forbidClick:true,
                                duration:1000
                            })
                            this.$router.push({name:"AddressList"})
                        }
                    }).catch(err => {
                        console.log('err==>' , err);
                        this.$toast.clear()
                    })

                }
            },

            //获取初始信息
            getorigin() {
                // console.log(this.aid);
                let tokenString = this.$cookies.get('tokenString')

                if(!tokenString){
                    return this.$router.push({name:'Login'})
                }

                this.$toast.loading({
                    message:'加载中',
                    forbidClick:true,
                    duration:0
                })

                this.axios({
                    method:'GET',
                    url:this.baseUrl + '/findAddressByAid',
                    params:{
                        appkey:this.appkey,
                        aid:this.aid,
                        tokenString
                    }
                }).then(res => {
                    this.$toast.clear()
                    let data = res.data.result[0];
                    data.isDefault = !!data.isDefault;

                    this.originAddressInfo = data
                }).catch(err => {
                    console.log('err===>' , err);
                    this.$toast.clear()
                })
            }
        }
    }
</script>

<style lang="less" scoped>
/deep/ .van-address-edit{
    padding: 0;
}
/deep/ .van-cell__title{
    text-align: left;
}
</style>
<template>
    <div class="SecurityCenter">
        <div class="nav">
            <van-nav-bar
            title="安全中心"
            left-text="返回"
            left-arrow
            @click-left="back"
            />
        </div>
        <div class="content">
            <div class="bg"></div>
            <div class="cell">
                <van-cell title="修改密码" is-link  @click="changepossword = true"/>
                <van-popup v-model="changepossword" position="bottom"  closeable class="changepossword">
                    <div>
                        <h1>修改密码</h1>
                        <div class="usermsg">
                        <van-field v-model="oldpassword" label="旧密码"  :right-icon="issee ? 'eye-o':'closed-eye'" :type="issee ? 'text':'password'" @click-right-icon="changeType"/>
                        <van-field v-model="newpassword" label="新密码" placeholder="请输入用户密码(首位为字母的6-16位字符)"  :right-icon="issee ? 'eye-o':'closed-eye'" :type="issee ? 'text':'password'" @click-right-icon="changeType"/>
                        </div>
                        <div class="forgot"><span>忘记密码？</span></div>
                        <van-button type="info" round block @click="updatePassword">确认修改</van-button>
                    </div>
                </van-popup>
                <van-cell title="注销账号" is-link  @click="destroy"/>
            </div>
            <van-button type="primary" size="large" round @click="offline">退出登录</van-button>
        </div>
    </div>
</template>

<script>
import {Dialog} from 'vant'
    export default {
        name:'SecurityCenter',
        data(){
            return {
                changepossword:false,
                oldpassword:'',
                newpassword:'',
                issee:false
            }
        },
        methods:{
            back(){
                this.$router.back()
            },
            //退出登录，切入登录界面
            offline(){
                this.$toast.loading({
                    message:'加载中...',
                    forbidClick:true,
                    duration:0
                })

                let tokenString = this.$cookies.get('tokenString');
                if(!tokenString){
                    return this.$router.push({name:'Login'})
                }

                this.axios({
                    method:'POST',
                    url:this.baseUrl + '/logout',
                    data:{
                        appkey:this.appkey,
                        tokenString
                    }
                }).then(res => {
                    this.$toast.clear();
                    if(res.data.code == 700) {
                        return this.$router.push({name:'Login'})
                    }
                    if(res.data.code === 'F001') {
                        this.$toast({
                            message:res.data.msg,
                            forbidClick:true,
                            duration:3000
                        })
                        return this.$router.push({name:'Login'})
                    }
                    this.$toast({
                        message:res.data.msg,
                        forbidClick:true,
                        duration:3000
                    })
                }).catch(err =>{
                    this.$toast.clear();
                    console.log('err==>',err);
                })
            },
            //注销账号
            destroy(){
                Dialog.confirm({
                    title:'注销账号',
                    message:'是否确定注销该账号'
                }).then(() => {
                    this.$toast.loading({
                        message:'加载中...',
                        forbidClick:true,
                        duration:0
                    })

                    let tokenString = this.$cookies.get('tokenString');
                    if(!tokenString){
                        return this.$router.push({name:'Login'})
                    }

                    this.axios({
                        method:'POST',
                        url:this.baseUrl + '/destroyAccount',
                        data:{
                            appkey:this.appkey,
                            tokenString
                        }
                    }).then(res => {
                        this.$toast.clear();
                        console.log('res==>',res);
                        if(res.data.code == 700) {
                            return this.$router.push({name:'Login'})
                        }
                        if(res.data.code === 'G001') {
                            this.$toast({
                                message:res.data.msg,
                                forbidClick:true,
                                duration:3000
                            })
                            return this.$router.push({name:'Login'})
                        }
                        this.$toast({
                            message:res.data.msg,
                            forbidClick:true,
                            duration:3000
                        })
                    }).catch(err =>{
                        this.$toast.clear();
                        console.log('err==>',err);
                    })
                }).catch(() => {
                    return
                })
            },
            changeType(){
                this.issee = !this.issee
            },
            //修改密码
            updatePassword(){
                let tokenString = this.$cookies.get('tokenString');

                if(!tokenString){
                    this.$router.push({name:'Login'})
                }

                this.$toast.loading({
                    message:"加载中.....",
                    forbidClick:true,
                    duration:0
                });

                this.axios({
                    method:"POST",
                    url:this.baseUrl + '/updatePassword',
                    data:{
                        appkey:this.appkey,
                        tokenString,
                        password:this.newpassword,
                        oldPassword:this.oldpassword
                    }
                }).then(res => {
                    this.$toast.clear();
                    if(res.data.code == 700  || res.data.code === 'E001') {
                        this.$toast({
                            message:res.data.msg,
                            forbidClick:true,
                            duration:3000
                        })

                        return this.$router.push({name:'Login'})
                    }
                    this.$toast({
                        message:res.data.msg,
                        forbidClick:true,
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
.SecurityCenter{
    .content{
        display: flex;
        flex-direction: column;
        .bg{
            width: 100%;
            height: 150px;
            background-color: #c4393c;
        }
        .cell{
            .changepossword{
                >div{
                    padding: 10px;
                    h1{
                    font-weight: bold;
                    text-align: left;
                    margin-bottom: 30px;
                    }
                    .usermsg{
                        .van-cell{
                        padding-left: 0;
                        // padding-right: 0;
                        // margin: 0;
                        // margin: 0;
                        }
                        margin-bottom: 30px;
                    }
                    .forgot{
                        text-align: right;
                    }
                }
            }
        }
    }
}
</style>
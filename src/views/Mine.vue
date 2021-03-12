<template>
    <div class="mine">
        <div class="bg" :style="{backgroundImage: `url(${userInfo.userBg})`}">
            <van-uploader :after-read="uploadBg"/>
        </div>
        <div class="perinfo">
            <div class="top">
                <div class="portrait">
                    <img :src="userInfo.userImg">

                    <div class="up-img">
                        <van-uploader :max-size="500 * 1024" :after-read="uploadImg" />
                    </div>
                </div>
                <div class="usertext">
                    <div class="name">{{userInfo.nickName}}</div>
                    <div class="text">{{userInfo.desc ? userInfo.desc : '空空如也哦，写点东西吧'}}</div>
                </div>
            </div>
            <div class="uls">
               <van-cell 
               :title="v.title" 
               is-link 
               v-for="(v,i) in cellDate"
               :key="i"
               @click="goPage(v.name)"
               />
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name:"Mine",
        data() {
            return {
                userInfo:{},
                cellDate:[
                    {title:'个人资料' , name:'AccountInfo'},
                    {title:'我的订单' , name:'OrderDetails'},
                    {title:'我的收藏' , name:'MyCollection'},
                    {title:'地址管理' , name:'AddressList'},
                    {title:'安全中心' , name:'SecurityCenter'}
                ]
            }
        },
        created(){
            this.getUserInfo()
        },
        methods:{
            //路由跳转
            goPage(x){
                this.$router.push({name:x})
            },
            //获取用户信息
            getUserInfo(){
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
                    method:"GET",
                    url:this.baseUrl + '/findMy',
                    params:{
                        appkey:this.appkey,
                        tokenString
                    }
                }).then(res => {
                    console.log('res==>',res);
                    this.$toast.clear()

                    if(res.data.code == 700) {
                        this.$toast({
                            message:res.data.msg,
                            forbidClick:true,
                            duration:3000
                        })

                        return this.$router.push({name:'Login'})
                    }

                    if(res.data.code === 'A001') {
                        this.userInfo = res.data.result[0]
                        console.log('userInfo==>',this.userInfo);
                    }else{
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

            //上传图片
            uploadImg(file) {
                //限制上传文件类型
                let types = ['png','gif','jpg','jpeg'];
                console.log('file==>',file);
                //截取上传图片类型
                let type = file.file.type.split('/')[1];

                if(types.indexOf(type) === -1){
                    return this.$toast({
                        message:`文件类型只支持${types.join(',')}`,
                        forbidClick:true,
                        duration:3000
                    })
                }

                let base64 = file.content.replace(/data:image\/[A-Za-z]+;base64,/,'');

                let tokenString = this.$cookies.get('tokenString');

                if(!tokenString){
                    return this.$router.push({name:'Login'})
                }

                this.$toast.loading({
                    message:'加载中....',
                    forbidClick:true,
                    duration:0
                })

                this.axios({
                    method:"POST",
                    url:this.baseUrl + '/updateAvatar',
                    data:{
                        appkey:this.appkey,
                        tokenString,
                        imgType:type,
                        serverBase64Img:base64
                    }
                }).then(res => {
                    console.log('res==>',res);

                    this.$toast.clear();

                    if(res.data.code == 700){
                        this.$toast({
                            message:res.data.msg,
                            forbidClick:true,
                            duration:3000
                        })
                        return this.$router.push({name:'Login'})
                    }

                    if(res.data.code === 'H001') {
                        if(res.data.result[0]=== 1) {
                            this.userInfo.userImg = res.data.userImg
                        }
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
            },
            //改变背景图片
            uploadBg(file){
                //限制上传文件类型
                let types = ['png','gif','jpg','jpeg'];
                console.log('file==>',file);
                //截取上传图片类型
                let type = file.file.type.split('/')[1];

                if(types.indexOf(type) === -1){
                    return this.$toast({
                        message:`文件类型只支持${types.join(',')}`,
                        forbidClick:true,
                        duration:3000
                    })
                }

                let base64 = file.content.replace(/data:image\/[A-Za-z]+;base64,/,'');

                let tokenString = this.$cookies.get('tokenString');

                if(!tokenString){
                    return this.$router.push({name:'Login'})
                }

                this.$toast.loading({
                    message:'加载中....',
                    forbidClick:true,
                    duration:0
                })

                this.axios({
                    method:"POST",
                    url:this.baseUrl + '/updateUserBg',
                    data:{
                        appkey:this.appkey,
                        tokenString,
                        imgType:type,
                        serverBase64Img:base64
                    }
                }).then(res => {
                    this.$toast.clear();
                    if(res.data.code == 700){
                        this.$toast({
                            message:res.data.msg,
                            forbidClick:true,
                            duration:3000
                        })
                        return this.$router.push({name:'Login'})
                    }

                    if(res.data.code === 'I001'){
                        this.userInfo.userBg = res.data.userBg
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
.mine{
    background-color:#e8e6e6;
    padding-bottom: 117px;
    /deep/ .van-uploader{
        width: 100%;
        height: 100%;
        display: block;
        opacity: 0;
    }
    .bg{
        width: 100%;
        height: 180px;
        background-size: cover;
        background-repeat: no-repeat;
    }
    .perinfo{
        margin: 0 10px 10px;
        padding: 0 0 20px;
        border-radius: 10px;
        width: calc(100% - 20px);
        background-color: rgba(255, 255, 255);
        text-align: left;
        position: relative;
        .top{
            padding: 5px;
            display: flex;
            position: absolute;
            top: -30px;
            width: calc(100% - 10px);
            background-color: rgba(255, 255, 255, 0.8);
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            .portrait{
                width: 60px;
                height: 60px;
                border-radius: 50%;
                overflow: hidden;
                margin-right: 10px;
                img{
                    width: 100%;
                    height: 100%;
                }
                .up-img{
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }
            }
            .usertext{
               display: flex;
               flex-direction: column;
               .name{
                   margin-bottom: 10px;
                   font-size: 16px;
                   font-weight: bold;
                   color: #c4393c;
               }
               .text{
                   font-size: 14px;
                   color: #999;
               }
            }   
        }
        .uls{
            padding-top: 70px;
            .van-cell{
                padding: 10px 16px 15px;
            }
        }
    }
}
/deep/ .van-uploader__wrapper{
    width: 100%;
    height: 100%;
    /deep/ .van-uploader__upload{
        width: 100%;
        height: 100%;
    }
}
</style>
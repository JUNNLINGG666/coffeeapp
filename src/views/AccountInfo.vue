<template>
    <div class="accountInfo">
        <div class="nav">
            <van-nav-bar
            title="个人资料"
            left-text="返回"
            left-arrow
            @click-left="back"
            />
        </div>
        <div class="count">
            <div class="bg"></div>
            <div class="lost">
                <div class="text">
                    <van-cell-group>
                        <van-cell title="头像">
                            <template #right-icon>
                                <img :src="lis.userImg">
                            </template>
                        </van-cell>
                        <van-cell title="用户id" :value="lis.userId" />
                        <van-cell title="昵称" :value="lis.nickName" @click="showname = true"/>
                        <van-cell title="简介" :value="lis.desc == ''?'这家伙很懒，什么都没留下': lis.desc" @click="showdesc = true"/>
                    </van-cell-group>
                </div>
            </div>
        </div>
        <van-popup v-model="showname"  position="bottom" closeable round>
             <van-field v-model="newname" label="新昵称" :placeholder="lis.nickName" />
             <van-button type="primary" size="large" round @click="updateName">确认提交</van-button>
        </van-popup>
        <van-popup v-model="showdesc"  position="bottom" closeable round>
             <van-field v-model="newdesc" label="新简介" :placeholder="lis.desc" />
             <van-button type="primary" size="large" round @click="updateDesc">确认提交</van-button>
        </van-popup>
    </div>
</template>

<script>
    export default {
        name:'AccountInfo',
        data(){
            return {
                //个人信息列表
                lis:[],
                showname:false,
                showdesc:false,
                newname:'',
                newdesc:''
            }
        },
        created(){
            this.getlis()
        },
        methods:{
            back(){
                this.$router.back()
            },
            //获取个人信息
            getlis(){
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
                    url:this.baseUrl + '/findAccountInfo',
                    params:{
                        appkey:this.appkey,
                        tokenString
                    }
                }).then(res => {
                    this.$toast.clear();
                    if(res.data.code == 700) {
                        this.$router.push({name:'Login'})
                    }
                    if(res.data.code === 'B001'){
                        this.lis = res.data.result[0]
                    }
                    else{
                        this.$toast({
                            message:res.data.msg,
                            forbidClick:true,
                            duration:3000
                        })
                    }
                }).catch(err => {
                    this.$toast.clear();
                    console.log('err==>',err);
                })
            },
            //更改昵称
            updateName(){
                if(this.newname == ''){
                    this.$toast({
                        message:'昵称为空',
                        forbidClick:true,
                        duration:3000
                    })
                    return
                }

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
                    method:"POST",
                    url:this.baseUrl + '/updateNickName',
                    data:{
                        appkey:this.appkey,
                        tokenString,
                        nickName:this.newname
                    }
                }).then(res => {
                    this.$toast.clear();
                    if(res.data.code == 700) {
                        return this.$router.push({name:'Login'})
                    }
                    if(res.data.code === 'C001') {
                        this.lis.nickName = res.data.nickName
                    }
                   else{
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
                this.showdesc = false
            },
            //更改简介
            updateDesc(){
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
                    method:"POST",
                    url:this.baseUrl + '/updateDesc',
                    data:{
                        appkey:this.appkey,
                        tokenString,
                        desc:this.newdesc
                    }
                }).then(res => {
                    this.$toast.clear();
                    console.log('res==>',res);
                    if(res.data.code == 700) {
                        return this.$router.push({name:'Login'})
                    }
                    if(res.data.code === 'D001') {
                        this.lis.desc = res.data.desc
                    }
                   else{
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
                this.showdesc = false
            }
        }
    }
</script>

<style lang="less" scoped>
.accountInfo{
    .count{
        display: flex;
        flex-direction: column;
        .bg{
            width: 100%;
            height: 150px;
            background-color: #c4393c;
        }
        .lost{
            flex: 1;
            background-color: #b4b9b9;
            position: relative;
            padding: 0 5px;
            .text{
                width: calc(100% - 20px );
                padding: 10px 5px;
                text-align: left;
                border-radius: 10px;
                background-color: #fff;
                position: absolute;
                top: -20px;
                .van-cell{
                    align-items: center;
                    img{
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                    }
                }
            }
        }
    }
}
</style>
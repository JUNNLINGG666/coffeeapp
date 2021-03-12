<template>
  <div class="home">
    <Top />
    <div class="home-box">
      <div class="box-text">
        <div class="welcome">欢迎回来！</div>
        <div class="loginPlease">Please login to your accounts</div>
      </div>
      <div class="box-input">
          <van-field v-model="userinfor.account" label="手机号" placeholder="请输入手机号" />
          <van-field v-model="userinfor.password" label="密码" placeholder="请输入用户密码"  :right-icon="issee ? 'eye-o':'closed-eye'" :type="issee ? 'text':'password'" @click-right-icon="changeType"/>
      </div>
      <div class="forgot"><span>忘记密码？</span></div>
      <div class="box-btn">
        <van-button type="info" round block @click="login">登录</van-button>
        <van-button type="default" round block class="registered" @click="isregistered=true">注册</van-button>
      </div>
    </div>
    <van-popup v-model="isregistered" position="bottom" class="home-registered" closeable click-close-icon="isregistered=false">
      <div>
        <h1>注册</h1>
        <div class="usermsg">
          <van-field v-model="userregistered.account" label="手机号" placeholder="请输入11位手机号" />
          <van-field v-model="userregistered.password" label="密码" placeholder="请输入用户密码(首位为字母的6-16位字符)"  :right-icon="issee ? 'eye-o':'closed-eye'" :type="issee ? 'text':'password'" @click-right-icon="changeType"/>
          <van-field v-model="userregistered.name" label="昵称" placeholder="昵称(最长可达6位)" />
        </div>
        <van-button type="info" round block @click="registered">注册</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
// @ is an alias to /src
import Top from '../components/HomeTop'
import {check} from '../assets/js/checknewuser'

export default {
  data(){
    return {
      userinfor : {
        account:'',
        password:''
      },
      userregistered :{
        account:'',
        password:'',
        name:''
      },
      isregistered:false,
      issee:false
    }
  },
  components:{
    Top
  },
  methods:{
    changeType(){
      this.issee = !this.issee
    },
    registered(){
      let newuser = {
        account :{
          value:this.userregistered.account,
          reg:/^1[3-9]\d{9}$/,
          errorMsg:'请输入正确的手机号码'
        },
        password :{
          value:this.userregistered.password,
          reg:/^[A-Za-z]\w{6,9}$/,
          errorMsg:'密码格式不正确(首位为字母且密码长度为6到10位)'
        },
        name:{
          value:this.userregistered.name,
          reg:/^[\u4e00-\u9fa5A-Za-z0-9]{2,6}$/,
          errorMsg:'昵称支持汉字字母数字组合且长度在2到6位'
        }
      };

      if(!check.validation(newuser)){
        return
      }


      this.$toast.loading({
        message:'加载中',
        forbidClick:true,
        duration:0
      })
      // console.log(this.appkey);
      this.axios({
        method:'POST',
        url:this.baseUrl +  '/register',
        data:{
          appkey: this.appkey,
          nickName:this.userregistered.name,
          phone:this.userregistered.account,
          password:this.userregistered.password,
        }
      }).then(res =>{
        console.log('res==>' , res);
        this.$toast.clear();
        if(res.data.code == 100){//请求成功
          this.isregistered=false
          for(let i in this.userregistered){
            this.userregistered[i] = '';
          }
        }else{//请求失败
          this.$toast({
            message:res.data.msg,
            forbidClick: true,
            duration: 3000
          })
        }
      }).catch(err => {
        this.$toast.clear();
        console.log('err==>',err);
      })
    },

    login(){
      let newuser = {
        account :{
          value:this.userinfor.account,
          reg:/^1[3-9]\d{9}$/,
          errorMsg:'请输入正确的手机号码'
        },
        password :{
          value:this.userinfor.password,
          reg:/^[A-Za-z]\w{6,9}$/,
          errorMsg:'密码格式不正确(首位为字母且密码长度为6到10位)'
        }
      };

      if(!check.validation(newuser)){
        return
      }

      this.$toast.loading({
        message:'加载中.....',
        forbidClick: true,
        duration: 0
      })

      this.axios({
        method:'POST',
        url:this.baseUrl + '/login',

        data:{
          appkey:this.appkey,
          phone:this.userinfor.account,
          password:this.userinfor.password
        }
      }).then(res => {
        this.$toast.clear();
        console.log(res);
        if(res.data.code === 200){//请求成功
          this.$cookies.set('tokenString' , res.data.token,'1d')

          //跳转到其他页面
          this.$router.push({path:'/'})
        }else{
          this.$toast({
            message: res.data.msg,
            forbidClick: true,
            duration: 3000
          })
        }
      }).catch(err => {
        this.$toast.clear();
      })
    }
  }
}
</script>
<style lang="less" scoped>
.home{
  position: fixed;
  // width: 100%;
  // height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url(../assets/imgs/Login_Bg.jpg) 100% 100% no-repeat;
}
.home-box{
  padding: 20px;
  .box-text{
    text-align: left;
    .welcome{
      font-size: 30px;
      font-weight: bold;
      color: #5B5B5B;
    }
    .loginPlease{
      margin-top: 10px;
      font-size: 16px;
      color: #666;
    }
    margin-bottom: 20px;
  }
  .box-input{
    margin-bottom: 10px;
  }
  .forgot{
    text-align: right;
  }
  .box-btn{
    margin-top: 50px;
    .registered{
      margin-top: 20px;
    }
  }
}
.home-registered{
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
  }
}
</style>

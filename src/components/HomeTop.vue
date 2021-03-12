<template>
  <div class="nav">
    <van-nav-bar left-arrow>
         <template #left>
            <div class="left-title">
                <div class="logo">
                    <img src="../assets/imgs/home_active.png" class="auto-img">
                </div>
                <div class="logo-text">Luckin Coffee</div>
            </div>
        </template>

        <template #right>
            <div class="right-title" @click="running">先逛一逛</div>
        </template>
    </van-nav-bar>
  </div>
</template>

<script>
export default {
    name:'HomeTop',
    methods:{
        //逛一逛
        running(){
            this.$router.push({path:'/'})
        }
    }
};
</script>

<style lang="less" scoped>
    .nav{
        margin-bottom: 80px;
        .left-title{
            display: flex;
            .logo{
                width: 30px;
                height: 30px;
                border-radius: 50%;
                img{
                    width: 100%;
                    display: block;
                }
            }
            .logo-text{
                color: #666;
                font-weight: bold;
                font-size: 18px;
                line-height: 30px;
                margin-left: 10px;
            }
        }
        .right-title{
            color: #FF7E3D;
            font-weight: bold;
        }
    }
</style>
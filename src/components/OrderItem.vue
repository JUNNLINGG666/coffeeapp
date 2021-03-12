<template>
    <div class="item">
        <div class="img">
            <img :src="product.small_img">
        </div>
        <div class="pro-info">
            <div class="top">
                <div class="pro-name">
                    <div class="name">{{product.name}}</div>
                    <div class="rule">{{product.rule}}</div>
                </div>
                <div class="enname">{{product.enname}}</div>
            </div>
            <div class="bottom">
                <div class="price">&yen;{{product.price}}</div>
                <div class="count">{{product.count}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name:'OrderItem',
        props: {
            product: {
                type:Object,
                default(){
                    return {}
                }
            }
        }
    }
</script>

<style lang="less" scoped>
.item{
    display: flex;
    margin-bottom: 10px;
    &:last-child{
        margin-bottom: 0;
    }
    .img{
        width: 60px;
        margin-right: 10px;
        img{
            width: 100%;
            display: block;
        }
    }
    .pro-info{
        width: calc(100%-70px);
        .top{
            height: 40px;
            .pro-name{
                display: flex;
                .name{
                    font-size: 14px;
                    color: #666;
                    margin-right: 10px;
                }
                .rule,.enname{
                    font-size: 12px;
                    color: #999;
                }
                .rule{
                    line-height: 22px;
                }
            }
        }
        .bottom{
            height: 20px;
            display: flex;
            .price{
                font-size: 14px;
                color: blue;
                margin-right: auto;
                line-height: 20px;
                font-weight: bold;
            }
            .count{
                font-size: 14px;
                color: #999;
                line-height: 20px;
            }
        }
    }
}
</style>
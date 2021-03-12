<template>
    <div class="order">
        <div class="name">
            <slot name="title">
                <div class="title">订单信息</div>
            </slot>
        </div>
        <div class="list">
            <slot name="order-item"></slot>
        </div>
        <div class="text">
            <div class="line">
                <div class="line-left"></div>
                <div class="line-right"></div>
            </div>
            <div class="proInfo">
                <div class="time" v-if="proInfo.date">{{proInfo.date | formatDate('yyyy-MM-dd hh:mm:ss')}}</div>
                <div class="num">
                    <div class="count">共计 {{proInfo.count}} 件</div>
                    <div class="total">合计 &yen;{{proInfo.total}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name:'Order',
        props:{
            proInfo: {
                type:Object,
                default() {
                    return {
                        count:0,
                        total:0,
                        date:''
                    }
                }
            }
        }
    }
</script>

<style lang="less" scoped>
.order{
    .name{
        .title{
            font-size: 14px;
            color: #666;
        }
    }
    .list{
            padding: 10px 0;
    }
    .text{
        .line{
            border-bottom: 1px dashed #e8e8e8;
            position: relative;
            >div{
                position: absolute;
                top: -10px;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background-color: #e5e5e5;
                &.line-left{
                    left: -20px;
                }
                &.line-right{
                    right: -20px;
                }
            }
        }
        .proInfo{
            padding-top: 20px;
            .time{
                color: #999;
                font-size: 12px;
            }
            .num{
                display: flex;
                margin-top: 10px;
                .count{
                    margin-right: auto;
                    color: #666;
                    font-size: 14px;
                }
                .total{
                    font-size: 14px;
                    color: blue;
                    font-weight: bold;
                }
            }
        }
    }
}
</style>
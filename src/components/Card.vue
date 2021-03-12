<template>
    <div class="card">
        <div class="card-top"></div>
        <div class="card-text">
            <slot>内容</slot>
        </div>
    </div>
</template>

<script>
    export default {
        name:'Card'
    }
</script>

<style lang="less" scoped>
.card{
    .card-top{
        height: 120px;
        background-color: #c4393c;
    }
    .card-text{
        margin: 0 10px;
        padding: 10px;
        background-color: #fff;
        position: relative;
        top: -20px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }
}
</style>
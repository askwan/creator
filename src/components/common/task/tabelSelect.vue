<script>
    export default {
        data(){
            return {
                banner:['关联任务','关联工具'],
                mark:0,
            }
        },
        methods:{
            selectBanner(i){
                this.mark = i;
                this.$emit('getSelect',i);
            }
        }
    }
</script>
<template>
    <div class="tabel-bar">
        <div class="task animate" :class="{'active':mark==i}" @click="selectBanner(i)" v-for="(item,i) in banner" :key="i">{{item}}</div>
    </div>
</template>
<style lang="less" scoped>
    .tabel-bar{
        height: 36px;
        color: #666;
        font-size: 14px;
        >div{
            display: inline-block;
            line-height: 36px;
            text-align: center;
            width: 50%;
            background: #f0f2f5;
            font-weight: 600;
            cursor: pointer;
            &:hover,&.active{
                color: #333;
            }
            &.active{
                background: #fff;
            }
        }
    }
</style>

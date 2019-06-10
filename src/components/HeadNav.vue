<template>
    <header class="head-nav">
        <el-row>
            <el-col :span="6" class="logo-container">
                <img src="../assets/logo.png" class="logo" alt="">
                <span class="title">碳云云管系统</span>
            </el-col>
        </el-row>
    </header>
</template>

<script>
    export  default {
        name:'head-nav',
    };
</script>
<style scoped>
    .head-nav {
        width: 100%;
        height: 60px;
        min-width: 600px;
        padding: 5px;
        background: #324057;
        color: #fff;
        border-bottom: 1px solid #1f2d3d;
    }
    .logo-container {
        line-height: 60px;
        min-width: 400px;
    }
    .logo {
        height: 50px;
        width: 50px;
        margin-right: 5px;
        vertical-align: middle;
        display: inline-block;
    }
    .title {
        vertical-align: middle;
        font-size: 22px;
        font-family: "Microsoft YaHei";
        letter-spacing: 3px;
    }
</style>

<template>
    <el-row class="manu_page">
        <el-col>
            <el-menu
                    class="el-menu-vertical-demo"
                    background-color="#324057"
                    text-color="#fff"
                    active-text-color="#409eff">
                <router-link to="/home">
                    <el-menu-item index="0">
                        <span slot="title">首页</span>
                    </el-menu-item>
                </router-link>
                <template v-for="item in items">
                    <el-submenu v-if="item.children" :index="item.path" :key="item.path">
                        <template slot="title">
                            <i :class="'fa fa-margin '+item.icon"></i>
                            <span slot="title">{{item.name}}</span>
                        </template>
                        <router-link v-for="(citem,cindex) in item.children" :to="citem.path" :key="cindex">
                            <el-menu-item :index="citem.path">
                                <span slot="title">{{citem.name}}</span>
                            </el-menu-item>
                        </router-link>
                    </el-submenu>
                </template>
            </el-menu>
        </el-col>
    </el-row>
</template>

<style scoped>
    .manu_page {
        position: fixed;
        top: 71px;
        left: 0;
        min-height: 100%;
        background-color: #324057;
        z-index: 99;
    }
    .el-menu {
        border: none;
    }
    .fa-margin {
        margin-right: 5px;
    }
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 180px;
        min-height: 400px;
    }
    .el-menu-vertical-demo {
        width: 35px;
    }
    .el-submenu .el-menu-item {
        min-width: 180px;
    }

    .hiddenDropdown,
    .hiddenDropname {
        display: none;
    }
    .fa {
        text-decoration: none;
    }

    .el-dropdown-link {
        cursor: pointer;
        color: #409EFF;
    }
    .el-icon-arrow-down {
        font-size: 12px;
    }
    .demonstration {
        display: block;
        color: #8492a6;
        font-size: 14px;
        margin-bottom: 20px;
    }
</style>

<script>
    export default {
        name:'left-manu',
        data(){
            return {
                items:[
                    {
                        icon:'fa-money',
                        name:'资产管理',
                        path:'fund',
                        children:[
                            {
                                path:'foundlist',
                                name:'腾讯云资产详情'
                            },
                            {
                                path:'assetlist',
                                name:'公司网络资产详情'
                            },
                            {
                                path:'serverlist',
                                name:'公司服务器资产详情'
                            },
                            {
                                path:'auditlist',
                                name:'cvm申请详情'
                            }
                        ]
                    },
                    {
                        icon:'fa-pencil',
                        name:'应用管理',
                        path:'pod',
                        children:[
                            {
                                path:'podlist',
                                name:'应用管理详情'
                            }
                        ]
                    }
                ]
            }
        }
    }
</script>

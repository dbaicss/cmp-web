<template>
    <div class="fillcontain">
        <div>
            <el-form :inline="true" ref="search_data" :model="search_data">
                <!-- 时间筛选 -->
                <el-form-item class="btnRight">
                        <el-input v-model="input" placeholder="请输入要查找的ip"></el-input>
                </el-form-item>
                <el-form-item class="btnRight">               
                        <el-button ype="primary" size ="middle" icon="el-icon-search" @click='onSearchPod()'>查找</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table_container">
            <el-table
                    v-if="tableData.length > 0"
                    :data="tableData"
                    max-height="650"
                    border
                    style="width: 100%">
                <el-table-column
                        prop="instanceId"
                        label="实例id"
                        align='center'
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="instanceState"
                        label="实例状态"
                        align='center'
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="instanceType"
                        label="实例类型"
                        align='center'
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="instanceName"
                        label="实例名"
                        align='center'
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="zone"
                        label="区域"
                        align='center'
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="createdTime"
                        label="创建时间"
                        align='center'
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="expiredTime"
                        label="到期时间"
                        align='center'
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="publicIpAddresses"
                        label="外网ip"
                        align='center'
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="privateIpAddresses"
                        label="内网ip"
                        align='center'
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="imageId"
                        label="镜像id"
                        align='center'
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="osName"
                        label="操作系统"
                        align='center'
                        width="250">
                </el-table-column>
                <el-table-column
                        prop="resource"
                        label="详细资源"
                        align='center'
                        width="350">
                </el-table-column>
                <el-table-column
                        prop="internetAccessible"
                        label="外网带宽"
                        align='center'
                        width="80">
                </el-table-column>
                <el-table-column
                    prop="operation"
                    align='center'
                    label="操作"
                    fixed="right"
                    width="150">
                    <template slot-scope='scope'>
                        <el-button 
                            type="success" 
                            icon='edit' 
                            size="small"
                            @click='onEditMoney(scope.row)'
                        >服务详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-row>
                <el-col :span="24">
                    <div class="pagination">
                        <el-pagination
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page.sync="paginations.page_index"
                                :page-sizes="paginations.page_sizes"
                                :page-size="paginations.page_size"
                                :layout="paginations.layout"
                                :total="paginations.total">
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!-- 使用dialog -->
        <!--ServiceFound :dialog='dialog' :form='form' @update="getService"></ServiceFound-->
        <ServiceFound :dialog='dialog' ></ServiceFound>
    </div>
</template>

<script>
import ServiceFound from "../components/ServiceFound";
    export default {
        name: 'fundlist',
        data(){
            return {
                search_data: {
                    startTime: '',
                    endTime: ''
                },
                paginations: {
                    page_index: 1,   //当前页数
                    total: 0,    //总条数
                    page_size: 5,   //当前页显示多少条
                    page_sizes: [5,50,100,200],   //可选每页显示多少条
                    layout: 'total,sizes,prev,next,pager,jumper'
                },
                tableData: [],
                allTableData: [],
                filterTableData: [],
                input: '',
                dialog: {
                    show: false,
                    title: ""
                },
                form:{
                    instanceId:'',
                    instanceState:'',
                    instanceType:'',
                    instanceName:'',
                    zone:'',
                    createdTime:'',
                    expiredTime:'',
                    publicIpAddresses:'',
                    privateIpAddresses:'',
                    imageId:'',
                    osName:'',
                    resource:'',
                    internetAccessible:'',
                },
            }
        },
        components: {
            ServiceFound
        },
        created(){
            this.getProfile();
        },
        methods: {
            getProfile(){
                //获取后端数据
                this.$axios.get("/api/crontab/list")
                    .then(res => {
                        this.allTableData = res.data.data;
                        this.filterTableData = res.data.data;
                        //设置分页数据
                        this.setPaginations();
                    });
            },
            onEditMoney(row) {
                // 编辑
                this.dialog = {
                    show: true,
                    title: "服务列表",
                };
                
            },
            setPaginations(){
                //分页属性设置
                this.paginations.total = this.allTableData.length;
                this.paginations.page_index = 1;
                this.paginations.page_size = 5;
                //设置默认的分页数据
                this.tableData = this.allTableData.filter((item, index) => {
                    return index < this.paginations.page_size;
                });
            },
            handleSizeChange(page_size){
                //切换size
                this.paginations.page_index = 1;
                this.paginations.page_size = page_size;
                console.log(this.allTableData);
                this.tableData = this.allTableData.filter((item, index) => {
                    return index < page_size;
                });
            },
            handleCurrentChange(page){
                //获取当前页
                let index = this.paginations.page_size * (page -1);
                //数据总数
                let nums = this.paginations.page_size * page;
                let tables = [];
                for (let i=index;i<nums;i++){
                    if (this.allTableData[i]) {
                        tables.push(this.allTableData[i]);
                    }
                    this.tableData = tables;
                }
            },            
            onSearchPod(){
                const ip = this.input
                this.allTableData = this.filterTableData.filter(item => {
                    return ((item.privateIpAddresses).indexOf(ip) != -1)
                });
                this.setPaginations();
            },

            handleSearch(){
                //筛选
                if(!this.search_data.startTime|| !this.search_data.endTime) {
                    this.$message({
                        type:'warning',
                        message:'请选择时间区间'

                    });
                    this.getProfile();
                    return;
                }
                const sTime = this.search_data.startTime.getTime();
                const eTime = this.search_data.endTime.getTime();
                this.allTableData = this.filterTableData.filter(item => {
                    let date = new Date(item.createdTime);
                    let time = date.getTime();
                    return time >= sTime && time <= eTime;
                });
                //重新调用分页方法
                this.setPaginations();
            }
        },
    };
</script>
<style scoped>
    .fillcontain {
        width: 100%;
        height: 100%;
        padding: 16px;
        box-sizing: border-box;
    }
    .btnRight {
        float: right;
    }
    .pagination {
        text-align: right;
        margin-top: 10px;
    }
</style>

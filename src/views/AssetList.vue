<template>
    <div class="fillcontain">
        <div>
            <el-form :inline="true" ref="search_data" :model="search_data">
                <!-- 时间筛选 -->
                <el-form-item class="btnRight">
                        <el-input v-model="input" placeholder="请输入要查找的ip"></el-input>
                </el-form-item>
                <el-form-item class="btnRight">               
                        <el-button type="primary" size ="middle" icon="el-icon-search" @click='onSearchPod()'>查找</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table_container">
            <el-table
                    v-if="tableData.length > 0"
                    :data="tableData"
                    max-height="650"
                    border
                    :default-sort = "{prop: 'ip', order: 'descending'}"
                    style="width: 100%">
                <el-table-column
                        prop="model"
                        label="产品型号"
                        align='center'
                        width="250">
                </el-table-column>
                <el-table-column
                        prop="sn"
                        label="sn码"
                        align='center'
                        width="400">
                </el-table-column>
                <el-table-column
                        prop="location"
                        label="放置地点"
                        align='center'
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="ip"
                        label="ip地址 ip"
                        align='center'
                        width="160"
                        sortable>
                        <template slot-scope="scope">
                            <el-icon name="ip"></el-icon>
                            <span style="margin-left: 10px">{{ scope.row.ip }}</span>
                        </template>
                </el-table-column>
                <el-table-column
                        prop="port"
                        label="端口"
                        align='center'
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="kind"
                        label="设备类型"
                        align='center'
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="status"
                        label="当前状态"
                        align='center'
                        width="150">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status=='使用中'" style="color: green">{{ scope.row.status }}</span>
                            <span v-else style="color: red">{{ scope.row.status }}</span>
                        </template>
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
                            icon='share' 
                            size="small"
                            @click='handlePodTerminal(scope.row)'
                        >查看详情</el-button>
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
        <!--Dialog :dialog='dialog' :form='form' @update="getProfile"></Dialog-->
    </div>
</template>

<script>
    export default {
        name: 'assetlist',
        data(){
            return {
                search_data: {
                    startTime: '',
                    endTime: ''
                },
                input: '',
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
                nName: '',
                nNameOpt: [],
                form:{
                    model:'',
                    sn:'',
                    location:'',
                    ip:'',
                    port:'',
                    kind:'',
                    status:''
                },
                dialog: {
                    show: false,
                    title:'',
                    option:'edit'
                }
            }
        },
        computed: {

        },
        created(){
            this.getProfile();
        },
        methods: {
            getProfile(){
                //获取后端数据
                this.$axios.get("/api/asset/list")
                    .then(res => {
                        this.allTableData = res.data.data;
                        this.filterTableData = res.data.data;
                        //设置分页数据
                        this.setPaginations();

                    });
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
            onSearchPod(){
                const podname = this.input
                this.allTableData = this.filterTableData.filter(item => {
                    return ((item.ip).indexOf(podname) != -1)
                });
                this.setPaginations();
            },
            handleSizeChange(page_size){
                //切换size
                this.paginations.page_index = 1;
                this.paginations.page_size = page_size;
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
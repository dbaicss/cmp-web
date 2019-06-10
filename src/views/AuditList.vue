<template>
    <div class="fillcontain">
        <div>
            <el-form :inline="true" ref="search_data" :model="search_data">
                <!-- 时间筛选 -->
                <el-form-item label="按照时间筛选">
                    <el-date-picker
                            v-model="search_data.startTime"
                            type="datetime"
                            placeholder="选择开始时间">
                    </el-date-picker> --
                    <el-date-picker
                            v-model="search_data.endTime"
                            type="datetime"
                            placeholder="选择结束时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size ="small" icon="search" @click='handleSearch()'>筛选</el-button>
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
                        prop="kind"
                        label="实例类型"
                        align='center'
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="disk"
                        label="磁盘大小"
                        align='center'
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="disk_type"
                        label="磁盘类型"
                        align='center'
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="os_version"
                        label="操作系统"
                        align='center'
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="network"
                        label="外网带宽(M)"
                        align='center'
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="instance_count"
                        label="实例数量(个)"
                        align='center'
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="live_time"
                        label="使用时长(天)"
                        align='center'
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="deploy_time"
                        label="交付日期"
                        align='center'
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="description"
                        label="项目描述"
                        align='center'
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="apply_name"
                        label="申请人"
                        align='center'
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="sp_status"
                        label="审核状态"
                        align='center'
                        width="50">
                </el-table-column>
                <el-table-column
                        prop="apply_time"
                        label="申请时间"
                        align='center'
                        width="250">
                </el-table-column>
                <el-table-column
                        prop="sp_num"
                        label="申请单号"
                        align='center'
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="sp_name"
                        label="申请名称"
                        align='center'
                        width="250">
                </el-table-column>
                <el-table-column
                        prop="apply_org"
                        label="申请人部门"
                        align='center'
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="approval_name"
                        label="审批人姓名"
                        align='center'
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="notify_name"
                        label="抄送人姓名"
                        align='center'
                        width="250">
                </el-table-column>
                <el-table-column
                        prop="apply_user_id"
                        label="提交申请人userid"
                        align='center'
                        width="150">
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
        name: 'auditlist',
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
                form:{
                    kind:'',
                    disk:'',
                    disk_type:'',
                    os_version:'',
                    network:'',
                    instance_count:'',
                    live_time:'',
                    deploy_time:'',
                    description:'',
                    apply_name:'',
                    sp_status:'',
                    apply_time:'',
                    sp_num:'',
                    sp_name:'',
                    apply_org:'',
                    approval_name:'',
                    notify_name:'',
                    apply_user_id:'',
                },
                //dialog: {
                //    show: false,
                //    title:'',
                //    option:'edit'
                //}
            }
        },
        created(){
            this.getProfile();
        },
        methods: {
            getProfile(){
                //获取后端数据
                this.$axios.get("/api/audit/list")
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
                    let date = new Date(item.apply_time);
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

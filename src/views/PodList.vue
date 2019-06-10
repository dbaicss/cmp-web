<template>
    <div class="fillcontain">
        <div>
            <el-form :inline="true" ref="search_data" :model="search_data">
                 <el-select v-model="nName" placeholder="请选择namespace"  @change="changed">
                    <el-option v-for="item in nNameOpt"  :key="item"  :value="item" >
                    </el-option>
                </el-select>
                <!-- 时间筛选 -->
                <el-form-item class="btnRight">
                        <el-input v-model="input" placeholder="请输入要查找的pod名"></el-input>
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
                    :default-sort = "{prop: 'start_time', order: 'descending', prop: 'name', order: 'descending'}"
                    style="width: 100%">
                <el-table-column
                        prop="name"
                        label="pod名字"
                        align='center'
                        width="350"
                        sortable>
                        <template slot-scope="scope">
                            <el-icon name="view"></el-icon>
                            <span style="margin-left: 10px">{{ scope.row.name }}</span>
                        </template>
                </el-table-column>
                <el-table-column
                        prop="namespace"
                        label="命名空间"
                        align='center'
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="status"
                        label="pod状态"
                        align='center'
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="pod_ip"
                        label="pod ip"
                        align='center'
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="host_ip"
                        label="主机ip"
                        align='center'
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="start_time"
                        label="启动时间"
                        align='center'
                        width="200"
                        sortable>
                        <template slot-scope="scope">
                            <el-icon name="time"></el-icon>
                            <span style="margin-left: 10px">{{ scope.row.start_time }}</span>
                        </template>
                </el-table-column>
                <el-table-column
                    prop="operation"
                    align='center'
                    label="操作"
                    fixed="right"
                    width="250">
                    <template slot-scope='scope'>
                        <el-button 
                            type="info" 
                            icon='edit' 
                            size="small"
                            @click='handlePodTerminal(scope.row)'
                        >进入容器</el-button>
                        <el-button 
                            type="primary" 
                            icon='delete' 
                            size="small"
                            @click='handleLogTerminal(scope.row)'
                        >查看日志</el-button>
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
        name: 'podlist',
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
                    name:'',
                    namespace:'',
                    status:'',
                    pod_ip:'',
                    host_ip:'',
                    start_time:''
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
            //this.getProfile();
            //this.getNs();
            this.getNs().then(()=>{
                this.getProfile();
            });
        },
        methods: {
            getProfile(){
                //获取后端数据
                this.$axios.get("/api/pod/list?ns="+this.nName)
                    .then(res => {
                        this.allTableData = res.data.data;
                        this.filterTableData = res.data.data;
                        //设置分页数据
                        this.setPaginations();

                    });
            },
            getNs() {
                const _self = this
                return new Promise((resolve,reject)=>{
                    this.$axios.get("/api/namespace/list")
                    .then(res => {
                        this.$set(this,'nNameOpt',res.data.data)
                        this.nName = res.data.data[0]
                        resolve(this.nName)
                    }).catch(e=>{
                        reject(e)
                    })
                })
            },
            changed() {
                this.$axios.get("/api/pod/list?ns="+this.nName)
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
                    return ((item.name).indexOf(podname) != -1)
                });
                this.setPaginations();
            },
            handlePodTerminal(row) {
            const routeUrl = this.$router.resolve({
                //name: 'WebSSH',
                name: 'Terminal',
                params: {
                namespace: row.namespace,
                pod: row.name,
                //container: this.ticketDetail.ars.fat.container_name
                }
            })
            localStorage.setItem("namespace",row.namespace),
            localStorage.setItem("name",row.name),
            window.open(routeUrl.href, '_blank')
    
            },
            handleLogTerminal(row) {
                const routeUrl = this.$router.resolve({
                    //name: 'WebSSH',
                    name: 'loglist',
                    params: {
                    namespace: row.namespace,
                    pod: row.name,
                    //container: this.ticketDetail.ars.fat.container_name
                    }
                })
            localStorage.setItem("namespace",row.namespace),
            localStorage.setItem("name",row.name),
            window.open(routeUrl.href, '_blank')
    
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
                    let date = new Date(item.start_time);
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


<template>
    <div class="logFund">
         <el-dialog 
            :title="dialog.title" 
            :visible.sync="dialog.show"
            :close-on-click-modal='false'
            :close-on-press-escape='false'
            :modal-append-to-body="false">
            <div class="table_container">
            <el-table
                    v-if="tableData.length > 0"
                    :data="tableData"
                    max-height="650"
                    border
                    style="width: 100%">
                <el-table-column
                        prop="createtime"
                        label="创建时间"
                        align='center'
                        width="250">
                </el-table-column>
                <el-table-column
                        prop="fullpath"
                        label="服务路径"
                        align='center'
                        width="300">
                </el-table-column>
                <el-table-column
                        prop="pid"
                        label="进程号"
                        align='center'
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="ppid"
                        label="父进程号"
                        align='center'
                        width="80">
                </el-table-column>
                <el-table-column
                        prop="processname"
                        label="进程名"
                        align='center'
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="username"
                        label="启动用户"
                        align='center'
                        width="100">
                </el-table-column>
            </el-table>
        </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
  name: "logfound",
  props: {
    dialog: {
        type: Object,
        default: () => {}
    },
  //  form: Object,
  },
  watch: {
      dialog(val) {
        if (val.show === true) 
        this.getService()
      }
  },
  data() {
    return {
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
            createtime:'',
            fullpath:'',
            pid:'',
            ppid:'',
            processname:'',
            username:'',
        },
    };
  },
  created(){
    this.getService();
  },
  methods: {
    getService(){
    //获取后端数据
        this.$axios.get("/api/service/list")
            .then(res => {
                this.allTableData = res.data.data;
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
    onSearchPod(){
        const pn = this.input
        this.allTableData = this.filterTableData.filter(item => {
            return ((item.processname).indexOf(pn) != -1)
        });
        this.setPaginations();
    },
  }
};
</script>
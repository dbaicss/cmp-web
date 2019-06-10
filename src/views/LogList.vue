<template>
        <div v-html="tableData.replace(/\n/g, '<br />')"></div>
        <!--span class="content span_left_down" style="" v-html="tableData"></span-->
</template>

<script>
    export default {
        name: 'loglist',
        data(){
            return {
                tableData: '',
            }
        },
        computed: {
            namespace() {
                return localStorage.getItem('namespace')
            },
            pod() {
                return localStorage.getItem('name')
            },
            //container() {
            //    return 'redis'
            //},
        },
        created(){
            this.getProfile();
        },
        methods: {
            getProfile(){
                //获取后端数据
                //this.$axios.get("/api/log/list?ns="+this.namespace+"&name="+this.pod+"&container="+this.container)
                this.$axios.get("/api/log/list?ns="+this.namespace+"&name="+this.pod)
                    .then(res => {
                        this.tableData = res.data.data;
                        //this.tableData = this.tableData.replace(/\\n/gm,"<br/>");
                        console.log(this.tableData)
                    });
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

</style>


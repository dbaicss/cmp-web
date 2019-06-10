<template>
    <div class="logFund">
         <el-dialog 
            :title="dialog.title" 
            :visible.sync="dialog.show"
            :close-on-click-modal='false'
            :close-on-press-escape='false'
            :modal-append-to-body="false">
            <div class="form">
                <el-form 
                    ref="form" 
                    :model="form"
                    :rules="form_rules"
                    label-width="120px" 
                    style="margin:10px;width:auto;">

                    <el-form-item prop="name" label="服务器名称:" >
                        <el-input type="name" v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item prop='location' label="存放位置:">
                        <el-input type="location" v-model="form.location"></el-input>
                    </el-form-item>

                    <el-form-item prop='model'  label="型号:">
                        <el-input type="model" v-model="form.model" :disable="this.dialog.isedit"></el-input>
                    </el-form-item>

                    <el-form-item prop='sn' label="sn码:">
                        <el-input type="sn" v-model="form.sn" :disable="this.dialog.isedit"></el-input>
                    </el-form-item>

                    <el-form-item prop='ip' label="ip地址:">
                        <el-input type="ip" v-model="form.ip"></el-input>
                    </el-form-item>

                     <el-form-item prop='purch_time' label="上架时间:">
                        <el-input type="purch_time" v-model="form.purch_time" :disable="this.dialog.isedit"></el-input>
                    </el-form-item>

                    <el-form-item prop='used' label="用途:">
                        <el-input type="used" v-model="form.used"></el-input>
                    </el-form-item>

                    <el-form-item prop='department' label="所属部门:">
                        <el-input type="department" v-model="form.department"></el-input>
                    </el-form-item>


                    <el-form-item prop='audit' label="负责人:">
                        <el-input type="audit" v-model="form.audit"></el-input>
                    </el-form-item>

                    <el-form-item prop='isvirtual' label="是否虚拟化:">
                        <el-input type="isvirtual" v-model="form.isvirtual"></el-input>
                    </el-form-item>

                    <el-form-item prop='status' label="状态:">
                        <el-input type="status" v-model="form.status"></el-input>
                    </el-form-item>

                    <el-form-item prop='description' label="描述:">
                        <el-input type="textarea" v-model="form.description"></el-input>
                    </el-form-item>

                    <el-form-item  class="text_right">
                        <el-button @click="dialog.show = false">取 消</el-button>
                        <el-button type="primary" @click='onSubmit("form")'>提  交</el-button>
                    </el-form-item>

                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
  name: "logfound",
  props: {
    dialog: Object,
    form: Object,
  },
  data() {
    return {
      form_rules: {
        name: [{ required: true, message: "服务器名称不能为空！", trigger: "blur" }],
        location: [{ required: true, message: "当前位置为空！", trigger: "blur" }],
        model: [{ required: true, message: "服务器型号不能为空！", trigger: "blur" }],
        sn: [{ required: true, message: "sn码不能为空！", trigger: "blur" }],
        ip: [{ required: true, message: "ip不能为空！", trigger: "blur" }],
        purch_time: [{ required: true, message: "上架时间不能为空！", trigger: "blur" }],
        used: [{ required: true, message: "用途不能为空！", trigger: "blur" }],
        department: [{ required: true, message: "所属部门不能为空！", trigger: "blur" }],
        audit: [{ required: true, message: "负责人不能为空！", trigger: "blur" }],
        isvirtual: [{ required: true, message: "是否虚拟化不能为空！", trigger: "blur" }],
        status: [{ required: true, message: "状态不能为空！", trigger: "blur" }]
      }
    };
  },
  methods: {
    onSubmit(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          //表单数据验证完成之后，提交数据;
          const url =
            this.dialog.option == "add" ? "add" : `edit/${this.form.id}`;
          this.$axios.post(`/api/server/${url}`, this.form).then(res => {
            // 操作成功
            this.$message({
              message: "保存成功！",
              type: "success"
            });
            this.dialog.show = true;
            this.$emit("update");
          });
        }
      });
    }
  }
};
</script>

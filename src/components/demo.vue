<template>
  <el-upload
    ref="upload"
    multiple
    class="upload-item"
    :action="action"
    :limit="limit"
    :headers="myHeaders"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :on-success="handleSuccess"
    :on-change="handleChange"
    :on-error="handleError"
    :on-exceed="handleExceed"
    :file-list="fileList"
    :show-file-list="false"
    :auto-upload="false"
  >
    <el-input
      slot="trigger"
      size="small"
      placeholder="请选择文件"
      v-model="fileName"
      suffix-icon="el-icon-upload"
    ></el-input>
    <!-- <el-button size="small"  type="primary" @click="submitUpload" :disabled="disabled">上传数据</el-button> -->
    <el-button
      type="primary"
      :disabled="disabled"
      size="small"
      class="uploadBtn"
      @click="submitUpload"
    >
      <span v-if="!disabled" class="refresh">
        <span>上传数据</span>
      </span>
      <span class="syncLoading" v-else>
        上传中...
        <i class="el-icon-loading el-icon--right"></i>
      </span>
    </el-button>
  </el-upload>
</template>
<script>
export default {
  props: {
    routeName: {
      type: String,
      default: ''
    },
    prop: {
      type: String,
      default: ''
    },
    action: {
      type: String,
      default: '/api/admin_config/v1/upload_files'
    },
    deleteUrl: {
      type: String,
      default: ''
    },
    limit: {
      type: Number,
      default: 10
    },
    counterpartyName: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    headers: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      fileName: '',
      fileList: [],
      isSubmit: false,
      requiredTip: false,
      ifUploadFileExists: false,
      upload_files_msg: ''
    }
  },
  computed: {
    myHeaders () {
      let headers = { Authorization: this.token }
      if (JSON.stringify(this.headers) !== '{}') {
        for (let key in this.headers) {
          headers[key] = this.headers[key]
        }
      }
      //   return headers;
      return {
        project: 'xilingmen',
        lotter_upload_file_type: 'bg_pic',
        Authorization: 'Bearer ' + window.localStorage.xlmAccessToken,
        'Content-Type': 'multipart/form-data'
      }
    }
  },
  methods: {
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },

    submit () {
      console.log('submit')
      this.$refs.upload.submit()
    },
    handleError (err, file, fileList) {
      this.task_notifi(`${file.name}上传失败`, 'error')
    },
    handleChange (file, fileList) {
      this.fileList = fileList
      this.fileName = file.name
    },
    submitUpload () {
      if (this.fileList.length < 1) {
        this.$message.info('请选择要上传的文件')
        return
      }
      console.log(this.fileName, 'fileName')

      console.log('submit')
      this.$refs.upload.submit()
      this.$emit('submit', this.fileName)
    },
    setTipe (fileList) {
      if (fileList.length !== 0) {
        this.isSubmit = true
        this.requiredTip = false
      } else {
        this.isSubmit = false
        this.requiredTip = this.required
      }
    },
    setNoTip () {
      this.requiredTip = false
    },
    handleSuccess (res) {
      this.clearFiles()
      if (res.code === 0) {
        // this.task_notifi(res.msg, "success");
        console.log(res.msg)
        this.handle_global_info([
          this.routeName,
          '上传成功 ' + res.filename,
          'data_upload',
          'success',
          'add',
          ''
        ])
      } else {
        this.task_notifi(res.msg, 'error')
        this.handle_global_info([
          this.routeName,
          res.msg,
          'data_upload',
          'failure',
          'add',
          ''
        ])
      }
      this.$emit('handleSuccess', this.prop)
    },
    handleExceed (files, fileList) {
      this.$message.warning(`限制选择 ${this.limit} 个文件`)
    },
    handleRemove (file, fileList) {
      if (!this.deleteUrl) {

      }
    },
    clearFiles () {
      this.$refs.upload.clearFiles()
      this.$nextTick(() => {
        this.fileName = ''
      })
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    getStatus () {
      if (this.isSubmit) {
        this.requiredTip = false
      } else {
        this.requiredTip = true
      }
      return this.isSubmit
    },
    statusChange () {
      this.$emit('statusChange')
    }
  },
  watch: {
    fileList: {
      deep: true,
      immediate: true,
      handler (newVal) {
        if (newVal.length > 1) {
          this.fileList.shift()
        }
      }
    }
  }
}
</script>

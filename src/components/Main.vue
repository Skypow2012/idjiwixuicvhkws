<template>
  <div class="content">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="1">活动中心</el-menu-item>
    </el-menu>
    <el-row>
      <div
        v-for="(o, index) in arr"
        :key="o.index"
        :offset="index % 6 != 0 ? 1 : 0"
        class="active-card"
        style="padding: 14px;"
        @click="toDetail(o.project_name)"
      >
        <span>{{o.project_name}}</span>
      </div>

      <div class="add-card" @click="addCard" style="padding: 14px;">
        <span>添加</span>
      </div>
    </el-row>
  </div>
</template>

<script>
const axios = require('axios')
export default {
  data () {
    return {
      activeIndex: '1',
      currentDate: new Date(),
      arr: [],
      headers: {
        Authorization: 'Bearer ' + window.localStorage.xlmAccessToken
      }
    }
  },
  async created () {
    let configRes = await axios({
      url: '/admin_config/v1/get_all_projects',
      methods: 'get',
      headers: this.headers
    })
    console.log(configRes)
    if (configRes.status === 200) {
      console.log(this.arr)
      this.$set(this, 'arr', configRes.data.data)
      this.arr = configRes.data.data
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
    },
    toDetail (projectName) {
      window.localStorage.projectName = projectName
      // window.location.href = "/" + Math.random() + '#/detail'
      this.$router.push({ path: '/detail' })
    },
    async addCard () {
      let msg = ''
      try {
        let nameDic = await this.$prompt('请输入活动名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^(?!\d+$).{3,10}$/,
          inputErrorMessage: '活动名限制在3~10字，且不能纯数字'
        })
        let projectName = nameDic.value
        this.$message('活动名称：' + projectName)
        this.projectInfo
        let infoDic = await this.$prompt('请输入活动介绍', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^.{0,50}$/,
          inputErrorMessage: '活动名限制在50字以内'
        })
        let projectInfo = infoDic.value
        this.$message('活动介绍：' + projectInfo)
        let res = await axios({
          url: '/admin_config/v1/set_project',
          method: 'POST',
          headers: this.headers,
          data: {
            project_name: projectName,
            project_info: projectInfo
          }
        })
        console.log(res)
        if (res.msg = 'success') {
          this.$message('活动【' + projectName + '】创建成功')
          window.location.reload()
        } else {
          this.$message(res.msg)
        }
      } catch (err) {
        console.log(err)
        if (err === 'cancel') {
          this.$message('取消输入')
        } else {
          this.$message(err)
        }
      }
    }
  }
}
</script>

<style>
@import "../assets/css/Main.css";
</style>

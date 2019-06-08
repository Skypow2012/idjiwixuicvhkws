<template>
  <div>
    <h1>{{projectName}}</h1>
    <div class="files-area">
      <div :class="fileDic.className" v-for="(fileDic, idx) in fileDics" :key="idx">
        <span style="font-family:Helvetica Neue">{{fileDic.for}}</span>
        <el-upload
          ref="upload"
          class="upload-item"
          :action="action"
          :limit="limit"
          :headers="getHeaders(idx)"
          :on-change="(file, fileList)=>{handleChange(file, fileList, idx)}"

          :file-list="fileList"
          :show-file-list="false"
          :auto-upload="true"
        >
          <el-input
            slot="trigger"
            size="small"
            placeholder="请选择文件"
            v-model="fileDic.fileName"
            suffix-icon="el-icon-upload"
          ></el-input>

          <div v-if="idx===2" class="download-demo-btn" @click="downloadDemo">
            <el-button>下载示例文件</el-button>
          </div>
          <!-- <el-button size="small"  type="primary" @click="submitUpload" :disabled="disabled">上传数据</el-button> -->
          <!-- <el-button
            type="primary"
            style
            :disabled="disabled"
            size="small"
            class="uploadBtn"
            @click="submitUpload(idx)"
          >
            <span v-if="!disabled" class="refresh">
              <span>上传数据</span>
            </span>
            <span class="syncLoading" v-else>
              上传中...
              <i class="el-icon-loading el-icon--right"></i>
            </span>
          </el-button> -->
        </el-upload>
      </div>
    </div>
    <div class="set-lottery-draw">
      <span>活动配置</span>
      <table class="lottery-table">
        <tr>
          <th>奖品</th>
          <th>轮次</th>
          <th>人/次</th>
        </tr>
        <tr v-for="(config, idx) in lottery" :key="idx + config.reward">
          <!-- <td v-for="(_config, _idx) in config" :key="_idx">{{_config}}<td> -->
          <td>{{config.reward}}</td>
          <td>{{config.total_time}}</td>
          <td>{{config.per_num}}</td>
          <td class="remove-lottery-btn" @click="removeLottery(idx)">x</td>
        </tr>
        <tr>
          <!-- <td v-for="(_config, _idx) in config" :key="_idx">{{_config}}<td> -->
          <td></td>
          <td></td>
          <td></td>
          <td class="add-lottery-btn" @click="addLottery(idx)">+</td>
        </tr>
      </table>
    </div>
    <div class="win-area">
      <span>中奖名单</span>
      <br/>
      <div class="limit-input">
        <el-input v-model="winLimit" placeholder="输入筛选内容" clearable></el-input>
      </div>
      <div class="refresh-win-btn" @click="refreshWin">
        <el-button>刷新</el-button>
      </div>
      <div class="download-win-btn" @click="downloadWin">
        <el-button>下载</el-button>
      </div>
      <table class="win-list">
        <tr v-for="(winner, index) in winList" :key="index + winner">
          <td v-if="winner.indexOf(winLimit)>-1">{{winner}}</td>
        </tr>
      </table>
    </div>
    <div style="display:none">
      <a href id="a">click here to download your file</a>
      <button onclick="download('file text', 'myfilename.txt', 'text/plain')">Create file</button>
    </div>
  </div>
</template>
<script>
import { format } from 'path'
const axios = require('axios')

export default {
  watch: {
    winLimit () {
      console.log(this.winLimit)
    }
  },
  data () {
    return {
      rIdx: 0,
      winLimit: '',
      winList: [],
      lottery: {},
      // {
      //   'r1': {
      //     'per_num': 5,
      //     'total_time': 2,
      //     'reward': '4000免单金'
      //   },
      //   'r2': {
      //     'per_num': 5,
      //     'total_time': 4,
      //     'reward': '3000免单金'
      //   },
      //   'r3': {
      //     'per_num': 10,
      //     'total_time': 4,
      //     'reward': '2000免单金'
      //   },
      //   'r4': {
      //     'per_num': 20,
      //     'total_time': 5,
      //     'reward': '1000免单金'
      //   }
      // },
      fileDics: [
        {
          for: '背景图',
          className: 'bg-pic-area',
          fileType: 'bg_pic',
          fileName: ''
        }, {
          for: '背景音乐',
          className: 'bg-music-area',
          fileType: 'bg_music',
          fileName: ''
        }, {
          for: '客户信息',
          className: 'customer-file-area',
          fileType: 'customer_file',
          fileName: ''
        }
      ],
      limit: 1,
      disabled: false,
      action: (process.env.NODE_ENV === 'production' ? '' : '/api') + '/admin_config/v1/upload_files',
      headers: {
        Authorization: 'Bearer ' + window.localStorage.xlmAccessToken
      },
      fileName: '',
      projectName: '',
      fileList: []
    }
  },
  async created () {
    console.log('show')
    this.projectName = window.localStorage.projectName
    this.$message('welcome to ' + this.projectName)
    let projectConfig = await axios({
      url: '/admin_config/v1/get_project_config/' + this.projectName,
      method: 'GET',
      headers: {
        ...this.headers
      }
    })
    console.log('projectConfig', projectConfig.data)
    // {
    //   "bg_pic": null,
    //   "customer_file": null,
    //   "music": null,
    //   "projects": [
    //       {
    //           "comments": "撒大楼附近的萨科拉但是",
    //           "id": 1,
    //           "lottery_config": "{'r5': {'total_time': '5', 'reward': 'demo', 'per_num': '5'}, 'r3': {'total_time': 4, 'reward': '2000免单金', 'per_num': 10}, 'r1': {'total_time': 2, 'reward': '4000免单金', 'per_num': 5}, 'r4': {'total_time': 5, 'reward': '1000免单金', 'per_num': 20}, 'r2': {'total_time': 4, 'reward': '3000免单金', 'per_num': 5}}",
    //           "project_name": "test"
    //       }
    //   ]
    // }
    this.fileDics[0].fileName = projectConfig.data.bg_pic || ''
    this.fileDics[1].fileName = projectConfig.data.music || ''
    this.fileDics[2].fileName = projectConfig.data.customer_file || ''
    console.log(projectConfig.data.projects)
    let lotteryConfig = projectConfig.data.projects[0].lottery_config
    if (lotteryConfig) {
      lotteryConfig = lotteryConfig.replace(/'/g, '"')
      lotteryConfig = JSON.parse(lotteryConfig)
    } else {
      lotteryConfig = {}
    }
    this.lottery = lotteryConfig
    // http://sunyibin.pythonanywhere.com/admin_config/v1/get_project_config/test
    console.log('createedddddddd', Object.keys(this.lottery).length)
    this.rIdx = Object.keys(this.lottery).length
    // 下载示例文件
    window.download = function download (text, name, type) {
      var a = document.getElementById('a')
      var file = new Blob([text], {type: type})
      a.href = URL.createObjectURL(file)
      a.download = name
      a.dispatchEvent(new MouseEvent('click', {'bubbles': false, 'cancelable': true}))
    }
    // download(res.data, 'peopleList.csv', 'csv')
  },
  methods: {
    // async downloadDemo () {
    //   let res = await axios({
    //     url: '/admin_config/v1/download_customer_template/xilingmen',
    //     method: 'GET',
    //     headers: {
    //       ...this.headers
    //     }
    //   })
    //   console.log(res)
    //   window.download(res.data, 'persons.csv', 'csv')
    // },
    async refreshWin () {
      this.$set(this, 'winLimit', '')
      let res = await axios.get('/api/v1/download_lucky_customer/' + this.projectName + '?' + Math.random())
      if (res.data instanceof Object) {
        this.$set(this, 'winList', [])
      } else {
        this.$set(this, 'winList', res.data.split('\n'))
      }
      console.log(this.winList)
    },
    downloadWin () {
      window.download(this.winList.join('\r\n'), this.projectName + '中奖名单.csv', 'csv')
    },
    downloadDemo () {
      window.download('city,name,phone\r\n上海市,诺小测,18812345678', 'persons.csv', 'csv')
    },
    async uploadLottery () {
      let formatedLottery = {}
      this.rIdx = 0
      for (let i = 0; i < 100; i++) {
        if (this.lottery['r' + i]) {
          let _lottery = (JSON.parse(JSON.stringify(this.lottery['r' + i])))
          _lottery.total_time = Number(_lottery.total_time)
          _lottery.per_num = Number(_lottery.per_num)
          formatedLottery['r' + ++this.rIdx] = _lottery
        }
      }
      let upRes = await axios({
        url: '/admin_config/v1/set_lottery_draw',
        method: 'POST',
        headers: this.headers,
        data: {
          project_name: this.projectName,
          lottery: formatedLottery
        }
      })
      console.log(upRes.data)
      this.$set(this, 'lottery', formatedLottery)
    },
    async removeLottery (idx) {
      console.log(idx, this.lottery)
      delete this.lottery[idx]
      await this.uploadLottery()
    },
    getHeaders (idx) {
      let project = encodeURIComponent(this.projectName) + ' ||| ' + this.fileDics[idx].fileType
      return {
        ...this.headers,
        project
      }
    },
    async submitUpload (idx) {
      this.$refs.upload[idx].submit()
    },
    handleChange (file, fileList, idx) {
      console.log(file, idx, fileList)
      this.fileDics[idx].fileName = file.name
      this.$set(this.fileDics, idx, JSON.parse(JSON.stringify(this.fileDics[idx])))
    },
    handleSuccess (idx) {
      console.log(idx, 'idx')
      if (this.fileDics[idx].fileName) {
        this.$message(this.fileDics[idx].fileName + '上传成功')
      }
    },
    async addLottery () {
      let msg = ''
      try {
        let rewardDic = await this.$prompt('请输入奖品名', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^.{3,10}$/,
          inputErrorMessage: '活动名限制在3~10字'
        })
        let reward = rewardDic.value
        this.$message({
          type: 'success',
          message: (msg += '【奖品】: ' + reward + ';')
        })
        let totalTimeDic = await this.$prompt('请输入奖品轮数', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^\d{1,2}$/,
          inputErrorMessage: '请输入数字（<100）'
        })
        let totalTime = totalTimeDic.value
        this.$message({
          type: 'success',
          message: (msg += '【轮数】: ' + totalTime + ';')
        })
        let perNumDic = await this.$prompt('请输入单轮奖品数', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^\d{1,2}$/,
          inputErrorMessage: '请输入数字（<100）'
        })
        let perNum = perNumDic.value
        this.$message({
          type: 'success',
          message: (msg += '\n【单轮奖品数】: ' + perNum + ';')
        })
        console.log('addd', this.rIdx)
        this.lottery['r' + ++this.rIdx] = {
          reward,
          total_time: totalTime,
          per_num: perNum
        }
        await this.uploadLottery()
      } catch (err) {
        if (err === 'cancel') {
          this.$message('取消输入')
        } else {
          this.$message(err.message || err)
        }
      }
    }
  }
}
</script>

<style>
@import "../assets/css/Detail.css";
</style>

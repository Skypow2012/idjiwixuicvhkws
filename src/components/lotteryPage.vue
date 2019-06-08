<template>
  <div class="content" :style="bgStyle">
    <audio id="bg-wav" :src="audioSrc" loop autoplay>
      Your browser does not support the audio element.
    </audio>
    <audio id="rocket-wav" :src="rocketSrc">
      Your browser does not support the audio element.
    </audio>
    <!-- <embed src="./wav/-咖哩鱼蛋.mp3" autostart="1" loop=-1 type="application/x-mplayer2" width="400" height="64"></embed> -->
    <div class="out-btn-area">
      <div class="gift-btn-area" @click="giftShow"></div>
      <div :class="isFull?'full-screen-btn-area small-screen':'full-screen-btn-area'" @click="fullScreen"></div>
      <div class="reset-btn-area" @click="reset"></div>
      <div :class="isBgWav?'bg-wav-area':'bg-wav-area wav-stop'" @click="bgGo"></div>
    </div>
    <!--  {{state == 'roll' ? 'roll-mode' : (state == 'win' ? 'win-mode': 'normal-mode')}} -->
    <div v-show="state == 'normal'" class="ctrl-area">
      <div class="btn-area">
        <div class="start-lottert" @click="toLottert">点击抽奖</div>
      </div>
    </div>
    <div v-show="state == 'roll'" class="win-items-area">
      <!-- <p>奖品列表</p> -->
      <div v-for="(winItem, idx) in winItems" :key="idx" v-show="isGiftShow"><!-- || idx == nowWinItemIdx">-->
        <div
          :class="idx == nowWinItemIdx ? 'win-item selected-win-item':'win-item'"
          @click="changeWinItem(idx)"
        >
          <p>{{winItem['reward']}}({{(winItems[idx].total_time - winItems[idx]._total_time)*winItems[idx].per_num ||0}}/{{winItems[idx].total_time*winItems[idx].per_num}})</p>
        </div>
      </div>
    </div>
    <div v-show="state == 'roll'" class="ctrl-area">
      <div id="people-list">
        <table v-show="trueList.length" cellpadding="0" cellspacing="0" style="white-apace:nowarp">
          <tr class="people-li linner">
            <td class="people-idx">序号</td>
            <td class="people-area">城市</td>
            <td class="people-name">名字</td>
            <td class="people-tel">电话</td>
          </tr>
          <tr class="people-li" :style="'font-size:'+ 8/Math.sqrt(trueList.length<4?5:(trueList.length+1)) + 'rem'" v-for="(item, index) in trueList" :key="index">
            <td class="people-idx">{{index + 1}}</td>
            <td class="people-area">{{item.area}}</td>
            <td class="people-name">{{item.name}}</td>
            <td class="people-tel">{{item.tel}}</td>
          </tr>
        </table>
        <!-- <p class="people-li" v-for="(item, index) in trueList" :key="index">
          <span class="people-idx">{{index + 1}}、</span>
          <span class="people-area">{{item.area}}</span>
          <span class="people-name">{{item.name}}</span>
          <span class="people-tel">{{item.tel}}</span>
        </p> -->
      </div>
      <div class="btn-area">
        <div class="start-lottert" @click="startLottert">开始抽奖</div>
        <div class="stop-lottert" @click="stopLottert">暂停抽奖</div>
      </div>
    </div>
    <div v-show="state == 'win'" class="win-shadow-area" @click="back2Roll"></div>
    <div v-show="state == 'win'" class="back-2-roll-btn" @click="back2Roll"></div>
    <div v-show="state == 'win'" class="win-area" @click="back2Roll">
        <table cellpadding="0" cellspacing="0" @click="noBack">
          <tr class="people-li" :style="'font-size:'+ 7/Math.sqrt(trueList.length<5?5:trueList.length) + 'rem'" v-for="(item, index) in trueList" :key="index">
            <td class="people-idx">{{index + 1}}、</td>
            <td class="people-area">{{item.area}}</td>
            <td class="people-name">{{item.name}}</td>
            <td class="people-tel">{{item.tel}}</td>
          </tr>
        </table>
    </div>
  </div>
</template>

<script>
import { clearInterval, setTimeout } from 'timers'
import { request } from 'http'
const peopleList = require('../assets/json/peopleList.json')
const winItems = require('../assets/json/winItems.json')
const localWinPeople = require('../assets/json/localWinPeople.json')
const isOnline = true
let projectName = ''
try {
  projectName = decodeURIComponent(window.location.href.match(/[\?\&]projectName=(.*?)[\&\#$]/)[1])
  console.log(projectName)
} catch (err) {
  console.log(err)
}

// 进入全屏
function enterFullScreen () {
  var de = document.documentElement
  if (de.requestFullscreen) {
    de.requestFullscreen()
  } else if (de.mozRequestFullScreen) {
    de.mozRequestFullScreen()
  } else if (de.webkitRequestFullScreen) {
    de.webkitRequestFullScreen()
  }
}
// 退出全屏
function exitFullScreen () {
  var de = document
  if (de.exitFullscreen) {
    de.exitFullscreen()
  } else if (de.mozCancelFullScreen) {
    de.mozCancelFullScreen()
  } else if (de.webkitCancelFullScreen) {
    de.webkitCancelFullScreen()
  }
}

const axios = require('axios')
const api = require('../assets/json/api.json')
let interV = {}
let isRequest = false
export default {
  name: 'LottertPage',
  data () {
    return {
      bgStyle: "background-image:url('http://sunyibin.pythonanywhere.com/admin_config/v1/download_project_file/" + projectName + "/bg_pic')",
      isBgWav: true,
      audioSrc: 'http://sunyibin.pythonanywhere.com/admin_config/v1/download_project_file/' + projectName + '/bg_music?' + Math.random(), // './wav/波斯进行曲.m4a',
      // audioSrc: './wav/波斯进行曲.m4a',
      rocketSrc: './wav/shake_gameover.wav',
      state: 'normal',
      isGiftShow: true,
      nowWinItemIdx: undefined,
      trueList: [],
      winItems,
      peopleList,
      isFull: false,
      historyWinDic: {}
    }
  },
  async created () {
    let that = this
    if (isOnline) {
      let configResult = (await axios({
        url: api.api_v1.get_config + '/' + encodeURIComponent(projectName),
        method: 'GET',
        headers: {
          project: encodeURIComponent(projectName)
        }
      })).data
      if (configResult.msg == 'success') {
        that.winItems = configResult.data
      } else {
        alert('获取奖品信息失败')
      }
      let customersResult = (await axios.get(api.api_v1.get_all_customers + '/' + encodeURIComponent(projectName))).data
      if (customersResult) {
        let _cutomersResult = customersResult.map((ele) => {
          let tel = ele[2].toString()
          return {
            'area': ele[0].substr(0, 3),
            'name': ele[1].substr(0, 3),
            'tel': tel.substr(0, 3) + '****' + tel.substr(7, 4)
          }
        })
        that.peopleList = _cutomersResult
      } else {
        alert('获取客户名单失败')
      }
    } else {
      that.peopleList = that.peopleList.map((ele) => {
        // console.log(ele)
        return {
          'area': ele['area'].substr(0, 3),
          'name': ele['name'].substr(0, 3),
          'tel': ele['tel'].substr(0, 3) + '****' + ele['tel'].substr(7, 4)
        }
      })
    }
  },
  methods: {
    bgGo () {
      if (this.isBgWav) {
        document.getElementById('bg-wav').pause()
      } else {
        document.getElementById('bg-wav').play()
      }
      this.isBgWav = !this.isBgWav
    },
    rocketGo () {
      if (this.isBgWav) {
        document.getElementById('rocket-wav').play()
      }
    },
    toLottert () {
      let that = this
      that.state = 'roll'
    },
    giftShow () {
      let that = this
      that.isGiftShow = !that.isGiftShow
    },
    changeWinItem (idx) {
      let that = this
      console.log(that.nowWinItemIdx)
      if (that.nowWinItemIdx == idx) {
        that.isGiftShow = true
      } else {
        that.isGiftShow = false
      }
      that.nowWinItemIdx = idx
      console.log(that.nowWinItemIdx)
    },
    // 抽奖函数
    randomTrueDic (config) {
      let that = this
      let peopleList = that.peopleList
      let len = peopleList.length
      let trueDic = {}
      let winPeopleCount = 20
      if (that.nowWinItemIdx) {
        let winItemInfo = that.winItems[that.nowWinItemIdx]
        winPeopleCount = winItemInfo.per_num
      } else {
        window.clearInterval(interV)
        alert('未选择奖品')
        return
      }
      let maxI = len < winPeopleCount ? len : winPeopleCount
      that.trueList = []
      for (let i = 0; i < maxI; i++) {
        let randomNum = (Math.random() * len) | 0
        if (!trueDic[randomNum]) {
          trueDic[randomNum] = true
          peopleList[randomNum].idx = randomNum
          that.trueList.push(peopleList[randomNum])
        } else {
          i--
        }
      }
    },
    // 开始循环运行抽奖函数
    startLottert () {
      let that = this
      window.clearInterval(interV)
      if (that.nowWinItemIdx) {
        let winItemInfo = that.winItems[that.nowWinItemIdx]
        console.log(winItemInfo)
        console.log(winItemInfo.total_time)
        if (winItemInfo._total_time == undefined) {
          winItemInfo._total_time = winItemInfo.total_time - 1
        } else if (winItemInfo._total_time > 0) {
          winItemInfo._total_time -= 1
        } else {
          window.clearInterval(interV)
          alert('该奖品已抽完')
          return
        }
      } else {
        window.clearInterval(interV)
        alert('未选择奖品')
        return
      }
      interV = window.setInterval(() => {
        that.randomTrueDic()
      }, 50)
      // console.log("开始抽奖", "interV:", interV);
    },
    clear () {
      let that = this
      that.trueList = []
      window.clearInterval(interV)
      console.log('抽奖已经停止', 'interV:', interV)
    },
    // 停止抽奖循环
    async stopLottert () {
      if (isRequest) {
        return
      }
      let that = this
      let winResult = {}
      // try {
      isRequest = true
      if (isOnline) {
        winResult = (await axios({
          url: api.api_v1.lottery_draw + '/' + that.nowWinItemIdx.replace('r', ''),
          method: 'GET',
          headers: {
            project: encodeURIComponent(projectName)
          }
        })).data
        isRequest = false
      } else {
        let rNum = that.nowWinItemIdx
        console.log(that.winItems[rNum], rNum)
        let per_num = that.winItems[rNum].per_num
        winResult.data = []

        for (let i = 0; i < per_num; i++) {
          let idx = Math.random() * localWinPeople[rNum].length | 0
          let b = localWinPeople[rNum].splice(idx, 1)
          console.log(idx)
          console.log(JSON.stringify(b[0]))
          console.log(JSON.stringify(localWinPeople[rNum]))
          winResult.data.push(b[0])
        }
        winResult.remain = localWinPeople[rNum].length
        winResult.msg = 'success'
        isRequest = false
      }
      // } catch(err) {
      //   isRequest = false;
      //   console.log(err, '网络请求出错');
      //   that.clear();
      //   alert('网络请求出错')
      //   return;
      // }
      console.log(winResult)
      if (winResult.msg == 'success') {
        window.clearInterval(interV)
        console.log('抽奖已经停止', 'interV:', interV)
        console.log(winResult.data)
        let _trueList = winResult.data.map((ele) => {
          console.log(ele)
          let tel = ele[2].toString()
          return {
            'area': ele[0],
            'name': ele[1],
            'tel': tel.substr(0, 3) + '****' + tel.substr(7, 4)
          }
        })
        that.trueList = _trueList
        console.log('中奖名单:', winResult.data)
        that.historyWinDic[new Date().getTime()] = {
          trueList: JSON.stringify(winResult.data),
          nowWinItemIdx: that.nowWinItemIdx,
          reward: that.winItems[that.nowWinItemIdx].reward
        }
        localStorage.setItem('historyWinDic', JSON.stringify(that.historyWinDic))
        setTimeout(() => {
          that.state = 'win'
          that.rocketGo()
        }, 888)
        let winItemInfo = that.winItems[that.nowWinItemIdx]
        winItemInfo._total_time = winResult.remain / winItemInfo.per_num
      } else {
        window.clearInterval(interV)
        console.log('抽奖已经停止', 'interV:', interV)
        that.trueList = []
        console.log(winResult.msg)
        alert(winResult.msg)
        let winItemInfo = that.winItems[that.nowWinItemIdx]
        winItemInfo._total_time = 0
      }
    },
    // 返回抽奖页面
    back2Roll () {
      let that = this
      that.state = 'roll'
      that.trueList = []
    },
    noBack (e) {
      e.stopLottert()
    },
    fullScreen () {
      if (this.isFull) {
        exitFullScreen()
      } else {
        enterFullScreen()
      }
      this.isFull = !this.isFull
    },
    async reset () {
      if (confirm('重置之前的抽奖么?')) {
        if (isOnline) {
          let resetResult = (await axios({
            url: api.api_v1.reset,
            method: 'POST',
            data: {
              project: projectName
            }
          })).data// (await axios.get(api.api_v1.reset)).data || {};
          if (resetResult.msg.indexOf('reset success') > -1) {
            alert('重置成功')
            window.location.reload()
          } else {
            alert('重置失败' + resetResult.msg || '')
          }
        } else {
          window.location.reload()
        }
      }
    }
  },
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
html,
body {
    font-size: 16px;
}
* {
  font-family: '黑体';
}
.out-btn-area {
  opacity: .5;
  /* position: fixed;
  background-color: rgba(255,255,255,.5);
  width: 230px;
  height: 50px;
  bottom: 5px;
  right: 5px; */
}
.bg-wav-area {
  position: fixed;
  top: 155px;
  left: 5px;
  width: 40px;
  height: 40px;
  background-image: url('../assets/img/icon/bg-wav.png');
  background-size: 100% 100%;
  text-shadow: #fff 1px;
  cursor: pointer;
}
.wav-stop {
  background-image: url('../assets/img/icon/bg-wav-stop.png');
}
.gift-btn-area {
  position: fixed;
  left: 5px;
  top: 5px;
  width: 40px;
  height: 40px;
  background-image: url('../assets/img/icon/gift.png');
  background-size: 100% 100%;
  text-shadow: #fff 1px;
  cursor: pointer;
}
.reset-btn-area {
  position: fixed;
  left: 5px;
  top: 105px;
  width: 40px;
  height: 40px;
  background-image: url('../assets/img/icon/reset.png');
  background-size: 100% 100%;
  cursor: pointer;
}
.full-screen-btn-area {
  position: fixed;
  left: 5px;
  top: 55px;
  width: 40px;
  height: 40px;
  background-image: url('../assets/img/icon/full-screen.png');
  background-size: 100% 100%;
  cursor: pointer;
}
.small-screen {
  background-image: url('../assets/img/icon/small-screen.png');
}
.content {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  overflow: hidden;
  width: 100%;
  height: 100%;
  min-width: 1280px;
  min-height: 720px;
  /* max-width: 1280px;
  max-height: 720px; */
  /* background-image: url("../assets/img/bg/pic-2.png"); */
  /* background-image: url("../assets/img/bg/pic.jpg"); */
  /* background-image: url("http://sunyibin.pythonanywhere.com/admin_config/v1/download_project_file/" + projectName + "/bg_music"); */
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.ctrl-area {
  position: absolute;
  overflow: hidden;
  width: 40%;
  top: 5%;
  margin-left: calc(5% + 60px);
  height: calc(100% - 32px);
  text-align: center;
}
.win-items-area {
  position: fixed;
  overflow: hidden;
  left: 50px;
  top: 5px;
  text-align: left;
  vertical-align: middle;
  color: #fff;
  background-color: rgba(0,0,0,.5);
  z-index: 999;
}
.win-items-area>div {
  /* display: inline-block; */
}
.win-items-area .win-item {
  width: 100%;
  height: 45px;
  line-height: 40px;
  padding-left: 10px;
  color: #fbf2cc;
  font-size: 1.6rem;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  cursor: pointer;
}
.win-item:hover {
  color: #fff;
  text-shadow: 1px 1px 5px #aa1a3b;
}
.win-item p {
  margin:auto;
}
.win-items-area .selected-win-item {
  /* border: red solid 2px;
  border-radius: 18px; */
  color:#aa1a3b;
}
.win-area {
  position: absolute;
  overflow: auto;
  width: 60%;
  height: 100%;
  left: 20%;
  top: -3%;
  background: url("../assets/img/bg/win-bg.png") no-repeat center top;
  background-size: auto 100%;
}
.back-2-roll-btn {
  display: none;
  width: 5.5rem;
  height: 2rem;
  position: absolute;
  overflow: auto;
  left: 0;
  right: 0;
  bottom: calc(7% - 2rem);
  margin: auto;
  background-image: url("../assets/img/bg/win-btn.png");
  background-size: 100% 100%;
  z-index: 1;
  cursor: pointer;
}
.win-area table {
    margin: auto;
    position: absolute;
    width: 70vh;
    height: 60%;
    top: 36%;
    bottom: 0;
    left: 0;
    right: 0;
}
.win-area .win-rocket {
  margin: auto;
  margin-top: 3%;
  width: 80%;
  height: 30%;
  overflow: auto;
  padding: 10px;
  box-sizing: border-box;
  background-image: url("../assets/img/icon/win-rocket.png");
  background-size: 100%;
  background-repeat: no-repeat;
  animation: rocket 1s;
}
.win-shadow-area {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
}
@keyframes rocket {
  from {
    margin-top: 100%;
  }
  to {
    margin-top: 3%;
  }
}
/* @font-face {
  font-family: FZLTCHJW;
  src: url("./font/FZLTCHJW.TTF")
} */
.win-area #people-list {
  margin-top: 0;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
#people-list {
  position: relative;
  /* display: flex;
  flex-direction: column; */
  margin: auto;
  width: 100%;
  height: 83%;
  text-align: center;
  overflow: auto;
  border-radius: 10px;
  padding: 10px;
  padding-top: 2rem;
  background-color: #fff;
  box-sizing: border-box;
}
#people-list table {
  margin: auto;
  width: 100%;
  height: 100%;
}
#people-list tr{
  width: 100%;
}
.people-li {
  margin: 0;
  text-align: center;
  font-size: 17px;
  box-sizing: border-box;
}
.people-li span {
  font-size: 1rem;
  line-height: 1.2rem;
  display: inline-block;
  overflow: hidden;
  height: 1.2rem;
}
.people-li .people-idx {
  /* width: 3rem; */
  width: 9%;
}
.people-li .people-area {
  /* width: 5rem; */
  width: 28%;
}
.people-li .people-name {
  /* width: 5rem; */
  width: 28%;
}
.people-li .people-tel {
  /* width: 7rem; */
  width: 35%;
}
.btn-area {
  width: 100%;
  position: absolute;
  bottom: 0;
  text-align: center;
  user-select: none;
}

.btn-area .start-lottert {
  margin-right: 50px;
}

.btn-area .start-lottert,
.btn-area .stop-lottert {
  display: inline-block;
  font-family: FZLTCHJW;
  height: 100px;
  width: 200px;
  font-size: 35px;
  line-height: 70px;
  /* font-weight: bold; */
  /* border-radius: 30px; */
  /* background-color: #cf9b51; */
  background-image: url("../assets/img/icon/lottery-btn.png");
  background-size: 100% 100%;
  cursor: pointer;
}
.zjl {
  position: absolute;
  width: 100%;
  text-align: center;
  font-size: 4rem;
  color: #aa1a3b;
  /* text-shadow: 0px 0px 1px #fbf2cc; */
  -webkit-text-stroke: 1px #fbf2cc;
  z-index: 1;
  top: 10%;
  margin-top: 0;
}
.zjmd {
  position: relative;
  width: 100%;
  text-align: center;
  font-size: 1.5rem;
  color: #000000;
  font-weight: bold;
  z-index: 1;
  margin: 0;
  margin-bottom: 2rem;
}
.win-item-show {
  position: relative;
  width: 100%;
  float: right;
  height: 1rem;
  text-align: center;
  margin-bottom: .5rem;
}
/* table * {
  font-size: 0;
} */
td{
  /* border:solid #000000;
  border-width:0px 1px 0px 0px; */
  /* padding:10px 0px; */
  overflow: hidden;
}
.linner td {
  border-bottom: 2px solid #000;
  margin-bottom: .5rem;
}

/* table{border:solid #add9c0; border-width:1px 0px 0px 1px;} */
</style>

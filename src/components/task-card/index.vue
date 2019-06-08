<template>
  <div class="taskCards clearfix">
    <el-row :gutter="13" type="flex" justify="space-between" class="row-bg">
      <el-col :class="'col-width-'+col" v-for="(item,i) in handleData" :key="i" >
        <el-card  class="task-card fl-left" v-if="JSON.stringify(item) !== '{}'" :class="item.task_info.status">

          <div slot="header" class="clearfix cardHeader">
            <span class="taskName">{{item.task_name}}</span>
            <i @click="delete_card(item.task_info.dir_name, item.task_name)" class="el-icon el-icon-close closeBtn" style="float:right"></i>
          </div>

          <a style="cursor:pointer" @click.prevent="goTo(item)" >
            <div class="cardBody">
              
                <tr v-for="(v,k) in item.task_info" v-if="cardsDisplayInfo[k][0]" :key="k">
                  <td><div>{{cardsDisplayInfo[k][1] }}:</div></td>
                  <td><div>{{v}}</div></td>
                </tr>
            </div>
            <div class="bottom clearfix">
              <span :class="item.task_info.status=='failure'?'error':''">{{ item.task_info.status=='running'?'运算中...':(item.task_info.status=='failure'?"运行失败 ":item.task_info.start_time) }}</span>
              <span :class="item.task_info.status==='running'?'el-icon-loading':''"></span>
              <div class="fl-right" style="color:#AEB3D3;cursor:pointer"><i class="el-icon-more"></i></div>
            </div>
          </a>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { message } from '@/utils/message.js'
export default {
  props: {
    cardList: {
      type: Array,
      default: []
    },
    router: {
      type: String,
      default: ''
    },
    col: {
      type: Number,
      default: 6
    },
    cardsDisplayInfo:{
      type: Object,
      default: {}
    },
    benchmark:{
      type: String,
      default:''
    }
  },
  data() {
    return {
 
    };
  },
  computed: {
    handleData () {
      let data = this.cardList
      // console.log('data:', data)
      let list = data.length
      let num = list % this.col
      if (num !== 0) {
        for (let i = 0; i < (this.col - num); i++) {
          data.push({})         
        }
      }
      console.log(data)
      return data
    },
  },
  methods:{
    goTo (card) {
      // console
      if (card.task_info.status === 'running') {
        message('warning', '任务正在运行！')
        return
      }
      if (card.task_info.status === 'failure') {
        // message('error', 'failure task')
        this.$alert(card.result_info,'任务失败',{
          confirmButtonText:'确定',
        })
        return
      }
      console.log('card:',card)
      let dir_name=card.task_info.dir_name
      let task_name=card.task_name
      let task_periods=card.task_info.periods
      let routeParams = this.$router.resolve({path: this.router, query: {"dir_name":dir_name, "task_name":task_name,"task_periods":task_periods, "benchmark":card.task_info.benchmark}})
      window.open(routeParams.href, '_blank')
    
    },
    delete_card (id, task_name) {
      var params = {'id':id, 'task_name':task_name}
      this.$emit('delete', params)
    }
  },
  filters:{
    toPercent(point){
      console.log('point:',point)
      var str=Number(point*100).toFixed(4)
      str+='%'
      return str
    },
  }
};
</script>

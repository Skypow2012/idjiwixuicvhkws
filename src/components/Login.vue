<template>
    <div class="content">
        <div class="login-area">
            <p>用户登录</p>
            <div class="input-area">
                <input class="username" v-model="username"/>
                <input class="password" type="password" v-model="password"/>
            </div>
            <button class="login" @click="login">登录</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      username: 'admin',
      password: 'admin123456'
    }
  },
  methods: {
    async login () {
      console.log('press login btn')
      console.log('username:', this.username)
      console.log('password:', this.password)
      try {
        let res = await axios({
          url: '/auth/oauth/token',
          method: 'post',
          data: {
            grant_type: 'password',
            username: this.username,
            password: this.password
          },
          transformRequest: [function (data) {
            let ret = ''
            for (let it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
          }],
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        console.log(res)
        if (res.data.code === 200) {
          window.localStorage.xlmAccessToken = res.data.access_token
          // window.location.href = '/' + Math.random() + '/#'
          this.$router.push({ path: '/' })
        } else {
          this.$message.error(err.message)
        }
      } catch (err) {
        this.$message.error(err.message)
      }
    }
  }
}
</script>

<style scoped>
@import "../assets/css/Login.css";
</style>

<template>
  <div>
    <!-- 导航栏开始 -->
    <div id="nav" class>
      <div id="navmenu">
        <h1 class="logo">
          <a class href="/">
            <img alt="帮Boss|抽奖" src="/rs/images/lottery_nav.png">
          </a>
        </h1>
        <ul class="clearfix" id="menu">
          <li class="home">
            <a href="/app/home" title="抽奖列表" class="selected">
              <i class="iconfont"></i>&nbsp;&nbsp;抽奖
            </a>
          </li>
          <li class="account">
            <a href="/app/account" title="帐号">
              <i class="iconfont"></i>&nbsp;&nbsp;账户
            </a>
          </li>
          <div id="menu-right">
            <li>
              <a class href="#" id="global-login-link">个人信息</a>
            </li>
            <li>
              <a href="http://www.bossbang.top/v/5a1e617b707d0f122f489c44" target="_blank" id>
                <i class="iconfont"></i>帮助
              </a>
            </li>
            <li>
              <a class href="#" id="global-menu-link">菜单按钮</a>
            </li>
          </div>
        </ul>
      </div>
    </div>
    <div id="container">
      <div class="buyInfo hide" id="divInfo">
        <span id="broadcast"></span>
        <a href="#" id="btnIKnow">我知道了</a>
      </div>
      <div id="stage" class="clearfix">
        <ul class="lottery-ul-container clearfix">
          <li class="lottery-li-item none">
            <div class="icon">
              <i class="iconfont"></i>
            </div>
          </li>
          <li
            class="lottery-li-item lotterycontent"
            lotteryid="5ced1b26e4b024b081499ce9"
            codeid="WAZQWVYZKKXSKTXSLYQABSZQ"
            type="scene"
            ldate
          >
            <div class="lottery-info-div scene">
              <i class="iconfont status-i hide green"></i>
              <div class="lottery-name">
                <i class="iconfont scene-i start"></i>
                <i class="iconfont scene-i hide"></i>
                <span class="lotteryname-span">超级活动现场</span>
              </div>
            </div>
            <i class="iconfont btn-share-i hide"></i>
            <div class="setting-ul-dropdown">
              <ul>
                <li class="menu-li-item start" data-title="开始抽奖">
                  <a href="#">
                    <i class="iconfont"></i>
                  </a>
                </li>
                <li class="menu-li-item setting" data-title="编辑">
                  <a href="#">
                    <i class="iconfont"></i>
                  </a>
                </li>
                <li class="menu-li-item awardinfo" data-title="中奖信息">
                  <a href="#">
                    <i class="iconfont"></i>
                  </a>
                </li>
                <li class="menu-li-item delete" data-title="删除">
                  <a href="#">
                    <i class="iconfont"></i>
                  </a>
                </li>
                <li class="menu-li-item publish hide" data-title="发布">
                  <a href="#">
                    <i class="iconfont"></i>
                  </a>
                </li>
                <li class="menu-li-item stop hide hide" data-title="停止">
                  <a href="#">
                    <i class="iconfont"></i>
                  </a>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
      <!-- end stage -->
    </div>
    <!-- end container -->
    <div id="overlay" class="overlay hide"></div>
    <div id="lightBox" class="lightbox hide">
      <div id="lbContent" class="lbcontent clearfix"></div>
    </div>
    <div class="hide" style="position:absolute;z-index:1500;" id="gridLoading">
      <img src="http://lottery.bangboss.com/rs/css/images/loading2.gif">
    </div>
    <span id="helpTip" class="helpTip hide">
      <b></b>
      <em></em>
    </span>
    <div class="hide" id="divtmp"></div>
    <div id="status" class="status" style="bottom: 0px; display: none;">
      <div id="y" class="y" style="top:0xp;left:0px">
        <div id="statusText" class="statusText">正在获取数据...</div>
      </div>
    </div>
  </div>
</template>
<style scoped>
@import '../assets/css/default.css';
@import "../assets/css/loterry.css";

.global-nav-footer-simple-container {
  margin-top: 0px !important;
}
body {
  min-width: 1280px;
}
</style>

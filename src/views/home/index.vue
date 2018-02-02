<style scoped lang="less">
  @import "../../assets/css/common.css";
  @import "../../assets/css/odometer-theme-digital.css";
  @import "home";
</style>
<template>
  <div id="index">
    <!-- loading -->
    <div id="datavLoading">
      <div class="loading">
        <h2>资源加载中</h2>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    <!-- 内容区域 -->
    <div class="datavLayout">
      <div class="wrap_l">
        <!-- 统计总汇 -->
        <div class="totalBox no_borderL" id="js_totalBoxL">
          <div class="item">
            <label>快检数据检测数</label>
            <span>19/562  12%</span>
          </div>
          <div class="item">
            <label>全国预警数</label>
            <span>19/562  12%</span>
          </div>
        </div>
        <!-- 预警历史对比图表 -->
        <div class="chartBox tag_bg" id="js_chartWarning"></div>
        <!-- 危害因子图表 -->
        <div class="chartBox" id="js_chartHarm"></div>
        <!-- 大宗食品不合格率统计图表 -->
        <div class="chartBox" id="js_chartUnqualified"></div>
      </div>
      <div class="wrap_c">
        <h1 class="tit">危害因子风险预警系统数据汇总</h1>
        <!-- 汇总数据 -->
        <div class="totalNum" id="js_odometerNum"></div>
        <div class="cardList" id="js_totalBoxC">
          <div class="item">
            <label>一级预警</label>5265
          </div>
          <div class="item">
            <label>二级预警</label>5265
          </div>
          <div class="item">
            <label>三级预警</label>5265
          </div>
          <div class="item">
            <label>四级预警</label>5265
          </div>
        </div>
        <!-- 地图 -->
        <div class="mapBox" id="js_mapBox"></div>
        <!-- 结果表格 -->
        <div class="resTable">
          <div class="subTit">各区域产品抽检结果</div>
          <div class="list_tit">
            <label>区域</label>
            <label>产品种类</label>
            <label>被抽检单位</label>
            <label>结果</label>
          </div>
          <div class="list_res">
            <div class="con" id="js_resList"></div>
          </div>
        </div>
      </div>
      <div class="wrap_r">
        <!-- 统计总汇 -->
        <div class="totalBox no_borderR" id="js_totalBoxR">
          <div class="item">
            <label>全市被抽检单位数</label>
            <span>19/562  12%</span>
          </div>
          <div class="item">
            <label>被抽检产品数</label>
            <span>19/562  12%</span>
          </div>
        </div>
        <!-- 抽检图表 -->
        <div class="chartBox tag_bg" id="js_chartSampling"></div>
        <!-- 抽检区域 -->
        <div class="areaBox">
          <!-- 滚动信息 -->
          <div class="areaScroll">
            <dl id="js_areaList">
            </dl>
          </div>
          <!-- 区域抽检图表 -->
          <div class="chartBox" id="js_chartArea"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'index'
  }
</script>

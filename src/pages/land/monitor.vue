<template>
  <view class="land-monitor-container">
    <view class="header-section">
      <view class="land-info">
        <text class="land-name">{{ landName }}</text>
        <text class="status-badge normal">运行正常</text>
      </view>
      <view class="update-time">数据更新时间：{{ updateTime }}</view>
    </view>
    
    <!-- 环境数据卡片 -->
    <view class="data-grid">
      <view class="data-card humidity">
        <view class="icon-bg">
          <u-icon name="drop" size="32" color="#fff"></u-icon>
        </view>
        <view class="data-value">
          <text class="num">65</text>
          <text class="unit">%</text>
        </view>
        <text class="data-label">空气湿度</text>
        <view class="trend up">
          <u-icon name="arrow-up" size="10" color="#ff4d4f"></u-icon>
          <text>2%</text>
        </view>
      </view>
      
      <view class="data-card temperature">
        <view class="icon-bg">
          <u-icon name="calendar" size="32" color="#fff"></u-icon>
        </view>
        <view class="data-value">
          <text class="num">24</text>
          <text class="unit">°C</text>
        </view>
        <text class="data-label">空气温度</text>
        <view class="trend down">
          <u-icon name="arrow-down" size="10" color="#52c41a"></u-icon>
          <text>1.5°C</text>
        </view>
      </view>
      
      <view class="data-card soil">
        <view class="icon-bg">
          <u-icon name="grid" size="32" color="#fff"></u-icon>
        </view>
        <view class="data-value">
          <text class="num">58</text>
          <text class="unit">%</text>
        </view>
        <text class="data-label">土壤湿度</text>
        <view class="trend flat">
          <text>-</text>
        </view>
      </view>
      
      <view class="data-card ph">
        <view class="icon-bg">
          <u-icon name="flask" size="32" color="#fff"></u-icon>
        </view>
        <view class="data-value">
          <text class="num">6.5</text>
          <text class="unit">pH</text>
        </view>
        <text class="data-label">土壤酸碱度</text>
        <view class="trend flat">
          <text>正常</text>
        </view>
      </view>
    </view>
    
    <!-- 实时监控画面 (模拟) -->
    <view class="camera-section">
      <view class="section-title">实时监控</view>
      <view class="camera-view">
        <image src="/static/default-land.png" mode="aspectFill" class="camera-img"></image>
        <view class="play-btn">
          <u-icon name="play-circle-fill" size="64" color="rgba(255,255,255,0.8)"></u-icon>
        </view>
        <view class="live-badge">LIVE</view>
      </view>
    </view>
    
    <!-- 历史趋势图表 (这里用静态图片模拟图表，实际开发需引入 ucharts) -->
    <view class="chart-section">
      <view class="section-title">近7天环境趋势</view>
      <view class="chart-placeholder">
        <view class="chart-bars">
          <view class="bar" style="height: 40%"></view>
          <view class="bar" style="height: 60%"></view>
          <view class="bar" style="height: 55%"></view>
          <view class="bar" style="height: 80%"></view>
          <view class="bar" style="height: 70%"></view>
          <view class="bar" style="height: 65%"></view>
          <view class="bar" style="height: 75%"></view>
        </view>
        <view class="chart-labels">
          <text>周一</text>
          <text>周二</text>
          <text>周三</text>
          <text>周四</text>
          <text>周五</text>
          <text>周六</text>
          <text>周日</text>
        </view>
      </view>
    </view>
    
    <!-- 农事建议 -->
    <view class="advice-section">
      <view class="section-title">智能农事建议</view>
      <view class="advice-card">
        <view class="advice-header">
          <u-icon name="bell" size="20" color="#faad14"></u-icon>
          <text class="title">灌溉提醒</text>
        </view>
        <text class="content">检测到土壤湿度略低于适宜值（60%），建议在今日傍晚进行少量灌溉，预计需水量 15吨/亩。</text>
        <view class="action-btn">一键灌溉</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const landId = ref('')
const landName = ref('加载中...')
const updateTime = ref(new Date().toLocaleString())

onLoad((options: any) => {
  if (options.id) {
    landId.value = options.id
    landName.value = options.name || '未知地块'
  }
})
</script>

<style lang="scss" scoped>
.land-monitor-container {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 30rpx 20rpx;
}

.header-section {
  background: #fff;
  padding: 30rpx;
  border-radius: 20rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.03);
  
  .land-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16rpx;
    
    .land-name {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
    }
    
    .status-badge {
      font-size: 24rpx;
      padding: 6rpx 16rpx;
      border-radius: 30rpx;
      
      &.normal {
        background: #f6ffed;
        color: #52c41a;
        border: 1rpx solid #b7eb8f;
      }
    }
  }
  
  .update-time {
    font-size: 24rpx;
    color: #999;
  }
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  margin-bottom: 30rpx;
  
  .data-card {
    background: #fff;
    padding: 30rpx;
    border-radius: 20rpx;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.02);
    
    .icon-bg {
      position: absolute;
      top: -10rpx;
      right: -10rpx;
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.2;
    }
    
    &.humidity .icon-bg { background: #1890ff; }
    &.temperature .icon-bg { background: #faad14; }
    &.soil .icon-bg { background: #52c41a; }
    &.ph .icon-bg { background: #722ed1; }
    
    .data-value {
      margin-bottom: 10rpx;
      
      .num {
        font-size: 48rpx;
        font-weight: bold;
        color: #333;
      }
      
      .unit {
        font-size: 24rpx;
        color: #999;
        margin-left: 8rpx;
      }
    }
    
    .data-label {
      font-size: 26rpx;
      color: #666;
      display: block;
      margin-bottom: 12rpx;
    }
    
    .trend {
      display: flex;
      align-items: center;
      font-size: 22rpx;
      
      &.up { color: #ff4d4f; }
      &.down { color: #52c41a; }
      &.flat { color: #999; }
      
      text { margin-left: 4rpx; }
    }
  }
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  border-left: 8rpx solid #4caf50;
  padding-left: 20rpx;
}

.camera-section {
  background: #fff;
  padding: 30rpx;
  border-radius: 20rpx;
  margin-bottom: 30rpx;
  
  .camera-view {
    width: 100%;
    height: 360rpx;
    background: #000;
    border-radius: 12rpx;
    position: relative;
    overflow: hidden;
    
    .camera-img {
      width: 100%;
      height: 100%;
      opacity: 0.6;
    }
    
    .play-btn {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    
    .live-badge {
      position: absolute;
      top: 20rpx;
      right: 20rpx;
      background: #ff4d4f;
      color: #fff;
      font-size: 20rpx;
      padding: 4rpx 12rpx;
      border-radius: 8rpx;
      animation: blink 2s infinite;
    }
  }
}

@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.chart-section {
  background: #fff;
  padding: 30rpx;
  border-radius: 20rpx;
  margin-bottom: 30rpx;
  
  .chart-placeholder {
    height: 300rpx;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding-top: 40rpx;
    
    .chart-bars {
      flex: 1;
      display: flex;
      justify-content: space-around;
      align-items: flex-end;
      border-bottom: 1rpx solid #eee;
      padding-bottom: 10rpx;
      
      .bar {
        width: 30rpx;
        background: #1890ff;
        border-radius: 6rpx 6rpx 0 0;
        opacity: 0.8;
      }
    }
    
    .chart-labels {
      display: flex;
      justify-content: space-around;
      margin-top: 10rpx;
      
      text {
        font-size: 22rpx;
        color: #999;
      }
    }
  }
}

.advice-section {
  background: #fff;
  padding: 30rpx;
  border-radius: 20rpx;
  
  .advice-card {
    background: #fffbe6;
    border: 1rpx solid #ffe58f;
    border-radius: 12rpx;
    padding: 24rpx;
    
    .advice-header {
      display: flex;
      align-items: center;
      margin-bottom: 12rpx;
      
      .title {
        font-size: 28rpx;
        font-weight: bold;
        color: #faad14;
        margin-left: 8rpx;
      }
    }
    
    .content {
      font-size: 26rpx;
      color: #666;
      line-height: 1.5;
      margin-bottom: 20rpx;
      display: block;
    }
    
    .action-btn {
      background: #4caf50;
      color: #fff;
      text-align: center;
      padding: 12rpx 0;
      border-radius: 30rpx;
      font-size: 26rpx;
    }
  }
}
</style>
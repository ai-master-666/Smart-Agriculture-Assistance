<template>
  <view class="sales-container">
    <view class="stat-header">
      <view class="total-sales">
        <text class="label">本月销售额 (元)</text>
        <text class="value">12,856.00</text>
        <view class="trend up">
          <text>环比增长 15%</text>
          <u-icon name="arrow-up-fill" size="12" color="#ff4d4f"></u-icon>
        </view>
      </view>
    </view>
    
    <view class="chart-card">
      <view class="card-title">销售趋势 (近7天)</view>
      <view class="chart-box">
        <!-- 模拟图表 -->
        <view class="bar-chart">
          <view class="bar-item" v-for="(item, index) in salesData" :key="index">
            <view class="bar-bg">
              <view class="bar-fill" :style="{ height: item.percent + '%' }"></view>
            </view>
            <text class="bar-label">{{ item.date }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <view class="rank-card">
      <view class="card-title">热销商品排行</view>
      <view class="rank-list">
        <view class="rank-item" v-for="(item, index) in rankList" :key="index">
          <view :class="['rank-index', index < 3 ? 'top' : '']">{{ index + 1 }}</view>
          <view class="rank-info">
            <text class="name">{{ item.name }}</text>
            <text class="sales">销量: {{ item.count }}</text>
          </view>
          <text class="price">¥{{ item.amount }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const salesData = ref([
  { date: '03-01', percent: 40 },
  { date: '03-02', percent: 60 },
  { date: '03-03', percent: 30 },
  { date: '03-04', percent: 80 },
  { date: '03-05', percent: 50 },
  { date: '03-06', percent: 90 },
  { date: '03-07', percent: 70 }
])

const rankList = ref([
  { name: '有机大米 5kg', count: 128, amount: '6,400' },
  { name: '高山绿茶', count: 86, amount: '4,300' },
  { name: '农家土鸡蛋', count: 65, amount: '2,600' },
  { name: '新鲜草莓', count: 42, amount: '1,260' },
  { name: '手工腊肉', count: 28, amount: '1,680' }
])
</script>

<style lang="scss" scoped>
.sales-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
}

.stat-header {
  background: linear-gradient(135deg, #4caf50 0%, #81c784 100%);
  border-radius: 20rpx;
  padding: 40rpx;
  color: #fff;
  margin-bottom: 20rpx;
  
  .total-sales {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .label { font-size: 28rpx; opacity: 0.9; margin-bottom: 10rpx; }
    .value { font-size: 60rpx; font-weight: bold; margin-bottom: 20rpx; }
    
    .trend {
      display: flex;
      align-items: center;
      background: rgba(255,255,255,0.2);
      padding: 4rpx 16rpx;
      border-radius: 20rpx;
      font-size: 24rpx;
      
      &.up { color: #fff; } // Usually red for up in stock, but here keeping white/green theme
    }
  }
}

.chart-card, .rank-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  
  .card-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 30rpx;
    border-left: 6rpx solid #4caf50;
    padding-left: 16rpx;
  }
}

.bar-chart {
  display: flex;
  justify-content: space-around;
  height: 300rpx;
  align-items: flex-end;
  
  .bar-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 60rpx;
    
    .bar-bg {
      width: 20rpx;
      height: 240rpx;
      background: #f0f0f0;
      border-radius: 10rpx;
      position: relative;
      overflow: hidden;
      
      .bar-fill {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        background: #4caf50;
        border-radius: 10rpx;
        transition: height 0.5s ease;
      }
    }
    
    .bar-label {
      font-size: 20rpx;
      color: #999;
      margin-top: 10rpx;
    }
  }
}

.rank-list {
  .rank-item {
    display: flex;
    align-items: center;
    margin-bottom: 24rpx;
    
    .rank-index {
      width: 40rpx;
      height: 40rpx;
      background: #f0f0f0;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24rpx;
      color: #666;
      margin-right: 20rpx;
      
      &.top {
        background: #fff7e6;
        color: #faad14;
        font-weight: bold;
      }
    }
    
    .rank-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      
      .name { font-size: 28rpx; color: #333; }
      .sales { font-size: 22rpx; color: #999; }
    }
    
    .price {
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
    }
  }
}
</style>

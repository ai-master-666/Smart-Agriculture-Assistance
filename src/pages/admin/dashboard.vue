<template>
  <view class="dashboard-container">
    <!-- 数据概览卡片 -->
    <view class="stats-grid">
      <view class="stat-card">
        <view class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
          <u-icon name="shop" size="48" color="#fff"></u-icon>
        </view>
        <view class="stat-info">
          <text class="stat-value">{{ stats.productCount }}</text>
          <text class="stat-label">商品总数</text>
        </view>
      </view>
      
      <view class="stat-card">
        <view class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
          <u-icon name="order" size="48" color="#fff"></u-icon>
        </view>
        <view class="stat-info">
          <text class="stat-value">{{ stats.orderCount }}</text>
          <text class="stat-label">订单总数</text>
        </view>
      </view>
      
      <view class="stat-card">
        <view class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
          <u-icon name="account" size="48" color="#fff"></u-icon>
        </view>
        <view class="stat-info">
          <text class="stat-value">{{ stats.userCount }}</text>
          <text class="stat-label">用户总数</text>
        </view>
      </view>
      
      <view class="stat-card">
        <view class="stat-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
          <u-icon name="live" size="48" color="#fff"></u-icon>
        </view>
        <view class="stat-info">
          <text class="stat-value">{{ stats.liveCount }}</text>
          <text class="stat-label">直播场次</text>
        </view>
      </view>
    </view>

    <!-- 快捷操作 -->
    <view class="quick-actions">
      <view class="action-title">快捷操作</view>
      <view class="action-grid">
        <view class="action-item" @click="goToProducts">
          <u-icon name="gift" size="40" color="#667eea"></u-icon>
          <text class="action-text">商品管理</text>
        </view>
        
        <view class="action-item" @click="goToOrders">
          <u-icon name="order" size="40" color="#f5576c"></u-icon>
          <text class="action-text">订单管理</text>
        </view>
        
        <view class="action-item" @click="goToUsers">
          <u-icon name="account" size="40" color="#4facfe"></u-icon>
          <text class="action-text">用户管理</text>
        </view>
        
        <view class="action-item" @click="goToLives">
          <u-icon name="live" size="40" color="#43e97b"></u-icon>
          <text class="action-text">直播管理</text>
        </view>
      </view>
    </view>

    <!-- 最新动态 -->
    <view class="recent-section">
      <view class="section-title">最新动态</view>
      <view class="recent-list">
        <view class="recent-item" v-for="item in recentLogs" :key="item.id">
          <text class="recent-time">{{ item.time }}</text>
          <text class="recent-content">{{ item.content }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const stats = ref({
  productCount: 0,
  orderCount: 0,
  userCount: 0,
  liveCount: 0
})

const recentLogs = ref([
  { id: 1, time: '10:30', content: '新用户注册：张三' },
  { id: 2, time: '10:25', content: '新订单产生：Order #12345' },
  { id: 3, time: '10:20', content: '商品上架：农家土鸡蛋' },
  { id: 4, time: '10:15', content: '直播间开启：农产品带货' }
])

onMounted(() => {
  loadStats()
})

const loadStats = async () => {
  // TODO: 调用后端 API 获取统计数据
  stats.value = {
    productCount: 128,
    orderCount: 356,
    userCount: 892,
    liveCount: 45
  }
}

const goToProducts = () => {
  uni.navigateTo({ url: '/pages/admin/products' })
}

const goToOrders = () => {
  uni.navigateTo({ url: '/pages/admin/orders' })
}

const goToUsers = () => {
  uni.navigateTo({ url: '/pages/admin/users' })
}

const goToLives = () => {
  uni.navigateTo({ url: '/pages/admin/live' })
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20rpx;
  min-height: 100vh;
  background: #f5f5f5;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  margin-bottom: 20rpx;
  
  .stat-card {
    background: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    display: flex;
    align-items: center;
    
    .stat-icon {
      width: 100rpx;
      height: 100rpx;
      border-radius: 20rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20rpx;
    }
    
    .stat-info {
      flex: 1;
      
      .stat-value {
        display: block;
        font-size: 40rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 5rpx;
      }
      
      .stat-label {
        display: block;
        font-size: 24rpx;
        color: #999;
      }
    }
  }
}

.quick-actions {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  
  .action-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 30rpx;
  }
  
  .action-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20rpx;
    
    .action-item {
      text-align: center;
      
      .action-text {
        display: block;
        font-size: 24rpx;
        color: #666;
        margin-top: 10rpx;
      }
    }
  }
}

.recent-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }
  
  .recent-list {
    .recent-item {
      display: flex;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f5f5f5;
      
      &:last-child {
        border-bottom: none;
      }
      
      .recent-time {
        font-size: 24rpx;
        color: #999;
        margin-right: 20rpx;
        min-width: 100rpx;
      }
      
      .recent-content {
        flex: 1;
        font-size: 28rpx;
        color: #333;
      }
    }
  }
}
</style>

<template>
  <view class="farmer-container">
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="user-content">
        <view class="avatar-wrapper">
          <image :src="userInfo.avatar || '/static/default-avatar.png'" mode="aspectFill" class="avatar"></image>
          <view class="vip-tag">农户</view>
        </view>
        <view class="user-info">
          <text class="nickname">{{ userInfo.nickname || '未设置昵称' }}</text>
          <text class="role-tag">已认证农户</text>
        </view>
        <view class="action-buttons">
          <view class="switch-role-btn" @click="switchBack">
            <u-icon name="arrow-left" size="24" color="#fff"></u-icon>
            <text>返回游客</text>
          </view>
          <view class="settings-btn" @click="goToSettings">
            <u-icon name="setting" size="24" color="#fff"></u-icon>
          </view>
        </view>
      </view>
      
      <!-- 天气信息 (替代游客端的统计数据) -->
      <view class="stats-row">
        <view class="stat-item">
          <text class="stat-value">26°C</text>
          <text class="stat-label">今日气温</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">65%</text>
          <text class="stat-label">空气湿度</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">良</text>
          <text class="stat-label">土壤墒情</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">优</text>
          <text class="stat-label">空气质量</text>
        </view>
      </view>
    </view>

    <!-- 快捷入口 (模仿订单状态栏) -->
    <view class="quick-section">
      <view class="section-header">
        <text class="section-title">常用功能</text>
        <view class="more-link" @click="showAllFunctions">
          <text>全部功能</text>
          <u-icon name="arrow-right" size="12" color="#999"></u-icon>
        </view>
      </view>
      
      <view class="quick-grid">
        <view class="quick-item" @click="navigateTo('product/add')">
          <view class="icon-wrapper">
            <u-icon name="plus-circle" size="32" color="#4caf50"></u-icon>
          </view>
          <text class="quick-text">商品发布</text>
        </view>
        <view class="quick-item" @click="navigateTo('order/list')">
          <view class="icon-wrapper">
            <u-icon name="order" size="32" color="#4caf50"></u-icon>
            <view class="badge" v-if="pendingOrders > 0">{{ pendingOrders }}</view>
          </view>
          <text class="quick-text">订单处理</text>
        </view>
        <view class="quick-item" @click="navigateTo('land/monitor')">
          <view class="icon-wrapper">
            <u-icon name="dashboard" size="32" color="#4caf50"></u-icon>
          </view>
          <text class="quick-text">环境监测</text>
        </view>
        <view class="quick-item" @click="navigateTo('ai/disease')">
          <view class="icon-wrapper">
            <u-icon name="scan" size="32" color="#4caf50"></u-icon>
          </view>
          <text class="quick-text">病虫害识别</text>
        </view>
        <view class="quick-item" @click="navigateTo('data/sales')">
          <view class="icon-wrapper">
            <u-icon name="trending-up" size="32" color="#4caf50"></u-icon>
          </view>
          <text class="quick-text">销售统计</text>
        </view>
      </view>
    </view>

    <!-- 功能菜单 (模仿常用功能菜单) -->
    <view class="menu-section">
      <!-- 我的土地 -->
      <view class="menu-group">
        <view class="group-title">我的土地</view>
        <u-cell-group :border="false">
          <u-cell icon="map" title="土地档案" :isLink="true" @click="navigateTo('land/list')" :border="false"></u-cell>
          <u-cell icon="edit-pen" title="农事记录" :isLink="true" @click="navigateTo('land/record')" :border="false"></u-cell>
          <u-cell icon="wifi" title="IoT设备管理" :isLink="true" @click="navigateTo('land/iot')" :border="false"></u-cell>
        </u-cell-group>
      </view>

      <!-- 农产品管理 -->
      <view class="menu-group">
        <view class="group-title">农产品管理</view>
        <u-cell-group :border="false">
          <u-cell icon="list" title="商品管理" :isLink="true" @click="navigateTo('product/list')" :border="false"></u-cell>
          <u-cell icon="car" title="物流管理" :isLink="true" @click="navigateTo('order/logistics')" :border="false"></u-cell>
          <u-cell icon="rmb-circle" title="售后管理" :isLink="true" @click="navigateTo('order/aftersale')" :border="false"></u-cell>
        </u-cell-group>
      </view>
      
      <!-- AI农技助手 -->
      <view class="menu-group">
        <view class="group-title">AI农技助手</view>
        <u-cell-group :border="false">
          <u-cell icon="kefu-ermai" title="智能问答" :isLink="true" @click="navigateTo('ai/qa')" :border="false"></u-cell>
          <u-cell icon="hourglass" title="市场行情" :isLink="true" @click="navigateTo('ai/market')" :border="false"></u-cell>
          <u-cell icon="calendar" title="种植方案" :isLink="true" @click="navigateTo('ai/plan')" :border="false"></u-cell>
        </u-cell-group>
      </view>
      
      <!-- 生活服务 (游客功能) -->
      <view class="menu-group">
        <view class="group-title">生活服务</view>
        <u-cell-group :border="false">
          <u-cell icon="shopping-cart" title="商城购物" :isLink="true" @click="navigateToVisitor('shop')" :border="false"></u-cell>
          <u-cell icon="play-circle" title="观看直播" :isLink="true" @click="navigateToVisitor('live')" :border="false"></u-cell>
          <u-cell icon="book" title="在线培训" :isLink="true" @click="navigateToVisitor('course')" :border="false"></u-cell>
          <u-cell icon="account" title="个人中心" :isLink="true" @click="navigateToVisitor('profile')" :border="false"></u-cell>
        </u-cell-group>
      </view>
    </view>
    
    <!-- 底部占位 -->
    <view class="bottom-spacer"></view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { storage } from '@/utils/storage'

const userInfo = ref<any>({})
const pendingOrders = ref(3) // 模拟待处理订单数

onLoad(() => {
  userInfo.value = storage.get('user_info') || { nickname: '农户' }
})

const switchBack = () => {
  uni.switchTab({ url: '/pages/shop/index' })
}

const goToSettings = () => {
  uni.showToast({ title: '设置功能开发中', icon: 'none' })
}

const showAllFunctions = () => {
  uni.showToast({ title: '展开所有功能', icon: 'none' })
}

const navigateTo = (path: string) => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

const navigateToVisitor = (type: string) => {
  switch (type) {
    case 'shop':
      uni.switchTab({ url: '/pages/shop/index' })
      break
    case 'live':
      uni.switchTab({ url: '/pages/live/index' })
      break
    case 'course':
      uni.switchTab({ url: '/pages/course/index' })
      break
    case 'profile':
      uni.switchTab({ url: '/pages/user/profile' })
      break
  }
}
</script>

<style lang="scss" scoped>
.farmer-container {
  min-height: 100vh;
  background: #f8f9fa;
  padding-bottom: 40rpx;
}

.user-card {
  background: linear-gradient(135deg, #4caf50 0%, #81c784 100%);
  padding: 40rpx 30rpx 60rpx;
  position: relative;
  border-radius: 0 0 40rpx 40rpx;
  
  .user-content {
    display: flex;
    align-items: center;
    margin-bottom: 50rpx;
    padding-top: 20rpx;
    
    .avatar-wrapper {
      position: relative;
      margin-right: 30rpx;
      
      .avatar {
        width: 120rpx;
        height: 120rpx;
        border-radius: 60rpx;
        border: 4rpx solid rgba(255,255,255,0.3);
      }
      
      .vip-tag {
        position: absolute;
        bottom: 0;
        right: -10rpx;
        background: #FFD700;
        color: #333;
        font-size: 20rpx;
        padding: 2rpx 10rpx;
        border-radius: 20rpx;
        font-weight: bold;
        border: 2rpx solid #fff;
      }
    }
    
    .user-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      
      .nickname {
        font-size: 36rpx;
        color: #fff;
        font-weight: bold;
        margin-bottom: 8rpx;
      }
      
      .role-tag {
        font-size: 24rpx;
        color: rgba(255,255,255,0.9);
        background: rgba(0,0,0,0.1);
        padding: 4rpx 12rpx;
        border-radius: 8rpx;
        align-self: flex-start;
      }
    }
    
    .action-buttons {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 20rpx;
      
      .switch-role-btn {
        display: flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.2);
        padding: 8rpx 16rpx;
        border-radius: 30rpx;
        
        text {
          color: #fff;
          font-size: 24rpx;
          margin-left: 6rpx;
        }
      }
      
      .settings-btn {
        padding: 10rpx;
      }
    }
  }
  
  .stats-row {
    display: flex;
    justify-content: space-around;
    
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .stat-value {
        font-size: 36rpx;
        color: #fff;
        font-weight: bold;
        margin-bottom: 6rpx;
      }
      
      .stat-label {
        font-size: 24rpx;
        color: rgba(255,255,255,0.8);
      }
    }
  }
}

.quick-section {
  background: #fff;
  border-radius: 20rpx;
  margin: -40rpx 20rpx 20rpx;
  padding: 30rpx;
  position: relative;
  z-index: 1;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.02);
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
    
    .section-title {
      font-size: 30rpx;
      font-weight: bold;
      color: #333;
    }
    
    .more-link {
      display: flex;
      align-items: center;
      font-size: 24rpx;
      color: #999;
      gap: 4rpx;
    }
  }
  
  .quick-grid {
    display: flex;
    justify-content: space-between;
    padding: 10rpx 0;
    
    .quick-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12rpx;
      position: relative;
      
      .icon-wrapper {
        position: relative;
        
        .badge {
          position: absolute;
          top: -10rpx;
          right: -10rpx;
          background-color: #ff4d4f;
          color: #fff;
          font-size: 20rpx;
          padding: 2rpx 8rpx;
          border-radius: 20rpx;
          border: 2rpx solid #fff;
        }
      }
      
      .quick-text {
        font-size: 24rpx;
        color: #666;
      }
    }
  }
}

.menu-section {
  padding: 0 20rpx;
  
  .menu-group {
    background: #fff;
    border-radius: 20rpx;
    margin-bottom: 20rpx;
    overflow: hidden;
    box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.01);
    
    .group-title {
      padding: 20rpx 30rpx 10rpx;
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
      border-left: 8rpx solid #4caf50;
      margin: 20rpx 0 10rpx 20rpx;
    }
  }
}

.bottom-spacer {
  height: 40rpx;
}
</style>
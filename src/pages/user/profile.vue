<template>
  <view class="profile-container">
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="user-content">
        <view class="avatar-wrapper">
          <image :src="userInfo.avatar || '/static/default-avatar.png'" mode="aspectFill" class="avatar"></image>
          <view class="vip-tag">Lv.1</view>
        </view>
        <view class="user-info">
          <text class="nickname">{{ userInfo.nickname || userInfo.username || '未设置昵称' }}</text>
          <text class="phone">{{ userInfo.phone || '未绑定手机' }}</text>
        </view>
        <view class="settings-btn" @click="goToSettings">
          <u-icon name="setting" size="24" color="#fff"></u-icon>
        </view>
      </view>
      
      <view class="stats-row">
        <view class="stat-item">
          <text class="stat-value">0</text>
          <text class="stat-label">收藏</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">0</text>
          <text class="stat-label">关注</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">0</text>
          <text class="stat-label">足迹</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">0</text>
          <text class="stat-label">积分</text>
        </view>
      </view>
    </view>

    <!-- 订单状态栏 -->
    <view class="order-section">
      <view class="section-header" @click="goToOrders(0)">
        <text class="section-title">我的订单</text>
        <view class="more-link">
          <text>全部订单</text>
          <u-icon name="arrow-right" size="12" color="#999"></u-icon>
        </view>
      </view>
      
      <view class="order-grid">
        <view class="order-item" @click="goToOrders(1)">
          <u-icon name="rmb-circle" size="32" color="#667eea"></u-icon>
          <text class="order-text">待付款</text>
        </view>
        <view class="order-item" @click="goToOrders(2)">
          <u-icon name="car" size="32" color="#667eea"></u-icon>
          <text class="order-text">待发货</text>
        </view>
        <view class="order-item" @click="goToOrders(3)">
          <u-icon name="gift" size="32" color="#667eea"></u-icon>
          <text class="order-text">待收货</text>
        </view>
        <view class="order-item" @click="goToOrders(4)">
          <u-icon name="thumb-up" size="32" color="#667eea"></u-icon>
          <text class="order-text">已完成</text>
        </view>
      </view>
    </view>

    <!-- 常用功能菜单 -->
    <view class="menu-section">
      <view class="menu-group">
        <u-cell-group :border="false">
          <u-cell 
            icon="map" 
            title="收货地址" 
            :isLink="true" 
            @click="goToAddress"
            :border="false"
            customStyle="padding: 30rpx 20rpx;"
          ></u-cell>
          <u-cell 
            icon="server-fill" 
            title="联系客服" 
            :isLink="true" 
            @click="contactSupport"
            :border="false"
            customStyle="padding: 30rpx 20rpx;"
          ></u-cell>
          <u-cell 
            icon="question-circle" 
            title="帮助中心" 
            :isLink="true" 
            @click="goToHelp"
            :border="false"
            customStyle="padding: 30rpx 20rpx;"
          ></u-cell>
        </u-cell-group>
      </view>

      <view class="menu-group">
        <u-cell-group :border="false">
          <u-cell 
            icon="grid" 
            title="管理后台" 
            :isLink="true" 
            @click="goToAdmin"
            v-if="isAdmin"
            :border="false"
            customStyle="padding: 30rpx 20rpx;"
          ></u-cell>
          <u-cell 
            icon="setting" 
            title="设置" 
            :isLink="true" 
            @click="goToSettings"
            :border="false"
            customStyle="padding: 30rpx 20rpx;"
          ></u-cell>
        </u-cell-group>
      </view>
    </view>
    
    <!-- 退出登录按钮 -->
    <view class="logout-btn">
      <u-button type="error" text="退出登录" shape="circle" @click="handleLogout"></u-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { storage } from '@/utils/storage'

const userInfo = ref<any>({})
const isAdmin = ref(false)

onLoad(() => {
  // 获取用户信息
  const user = storage.get('user_info')
  if (user) {
    userInfo.value = user
    // 判断是否管理员
    isAdmin.value = user.role === 'admin'
  } else {
    // 未登录时显示默认信息或跳转登录
    userInfo.value = {
      nickname: '请登录',
      phone: '点击头像登录'
    }
  }
})

const goToOrders = (type: number) => {
  // type: 0=全部, 1=待付款, 2=待发货, 3=待收货, 4=已完成
  uni.navigateTo({ url: `/pages/shop/order?status=${type}` })
}

const goToAddress = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

const contactSupport = () => {
  uni.showToast({ title: '客服热线: 400-123-4567', icon: 'none' })
}

const goToHelp = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

const goToAdmin = () => {
  uni.navigateTo({ url: '/pages/admin/dashboard' })
}

const goToSettings = () => {
  uni.showToast({ title: '设置功能开发中', icon: 'none' })
}

const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        storage.clear()
        uni.reLaunch({ url: '/pages/user/login' })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.profile-container {
  min-height: 100vh;
  background: #f8f9fa;
  padding-bottom: 40rpx;
}

.user-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
      
      .phone {
        font-size: 24rpx;
        color: rgba(255,255,255,0.8);
      }
    }
    
    .settings-btn {
      padding: 10rpx;
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

.order-section {
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
  
  .order-grid {
    display: flex;
    justify-content: space-between;
    
    .order-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12rpx;
      
      .order-text {
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
  }
}

.logout-btn {
  margin: 60rpx 40rpx;
}
</style>

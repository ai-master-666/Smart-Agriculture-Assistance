<template>
  <view class="user-info-container">
    
    <view class="info-list">
      <view class="info-item" @click="changeAvatar">
        <text class="label">头像</text>
        <view class="value-wrapper">
          <image :src="userInfo.avatar || '/static/default-avatar.png'" mode="aspectFill" class="avatar"></image>
          <u-icon name="arrow-right" size="16" color="#999"></u-icon>
        </view>
      </view>
      
      <view class="info-item" @click="editNickname">
        <text class="label">昵称</text>
        <view class="value-wrapper">
          <text class="value">{{ userInfo.nickname || userInfo.username || '未设置' }}</text>
          <u-icon name="arrow-right" size="16" color="#999"></u-icon>
        </view>
      </view>
      
      <view class="info-item" @click="editPhone">
        <text class="label">手机号</text>
        <view class="value-wrapper">
          <text class="value">{{ userInfo.phone || '未绑定' }}</text>
          <u-icon name="arrow-right" size="16" color="#999"></u-icon>
        </view>
      </view>
    </view>
    
    <!-- 退出登录按钮 -->
    <view class="logout-btn-container">
      <u-button type="error" text="退出当前账号" shape="circle" @click="handleLogout"></u-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { storage } from '@/utils/storage'

const userInfo = ref<any>({})

onLoad(() => {
  const user = storage.get('user_info')
  if (user) {
    userInfo.value = user
  } else {
    userInfo.value = {
      nickname: '未登录',
      phone: '未绑定'
    }
  }
})

const changeAvatar = () => {
  uni.showToast({ title: '修改头像功能开发中', icon: 'none' })
}

const editNickname = () => {
  uni.showToast({ title: '修改昵称功能开发中', icon: 'none' })
}

const editPhone = () => {
  uni.showToast({ title: '修改手机号功能开发中', icon: 'none' })
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
.user-info-container {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding-top: 20rpx;
  padding-bottom: 160rpx; // Prevent content from being hidden by fixed button
  display: flex;
  flex-direction: column;
}

.info-list {
  background-color: #fff;
  margin-top: 20rpx;
  // flex: 1;  <-- Removed to let it size naturally
  
  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx 40rpx;
    border-bottom: 1rpx solid #f5f5f5;
    background-color: #fff; // Ensure background is white
    
    &:active {
      background-color: #f9f9f9;
    }
    
    .label {
      font-size: 30rpx;
      color: #333;
    }
    
    .value-wrapper {
      display: flex;
      align-items: center;
      gap: 10rpx;
      
      .avatar {
        width: 80rpx;
        height: 80rpx;
        border-radius: 40rpx;
        background-color: #eee;
      }
      
      .value {
        font-size: 28rpx;
        color: #666;
      }
    }
  }
}

.logout-btn-container {
  padding: 40rpx;
  margin-top: 60rpx;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #f8f9fa;
  z-index: 100;
}
</style>
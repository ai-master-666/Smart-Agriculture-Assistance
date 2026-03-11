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
    <view class="footer-btn-view">
      <button class="custom-logout-btn" @click="handleLogout">退出当前账号</button>
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
        // 清除所有本地存储
        storage.clear()
        
        // 跳转到登录页，并关闭所有页面
        uni.reLaunch({
          url: '/pages/user/login',
          success: () => {
            uni.showToast({
              title: '已退出登录',
              icon: 'success'
            })
          }
        })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.user-info-container {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding-bottom: 200rpx; // Add enough padding for footer
}

.info-list {
  background-color: #fff;
  margin-top: 20rpx;
  
  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx 40rpx;
    border-bottom: 1rpx solid #f5f5f5;
    background-color: #fff;
    
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

.footer-btn-view {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 30rpx 40rpx;
  padding-bottom: calc(30rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
  background-color: #f8f9fa;
  z-index: 999;
  box-sizing: border-box;
}

.custom-logout-btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background-color: #ff4d4f;
  color: #fff;
  border-radius: 44rpx;
  font-size: 32rpx;
  text-align: center;
  border: none;
  
  &::after {
    border: none;
  }
}
</style>
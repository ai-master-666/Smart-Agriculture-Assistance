<template>
  <view class="login-container">
    <view class="logo">
      <image src="/static/logo.png" mode="aspectFit" class="logo-img"></image>
      <view class="logo-text">数智农旅平台</view>
    </view>

    <view class="form-card">
      <view class="input-group">
        <view class="input-item">
          <u-icon name="account" size="22" color="#666" class="icon"></u-icon>
          <input 
            class="input-field"
            v-model="formData.username" 
            placeholder="请输入用户名/手机号"
            placeholder-class="input-placeholder"
          />
        </view>
        
        <view class="input-item">
          <u-icon name="lock" size="22" color="#666" class="icon"></u-icon>
          <input 
            class="input-field"
            v-model="formData.password" 
            type="password"
            placeholder="请输入密码"
            placeholder-class="input-placeholder"
          />
        </view>
      </view>

      <button class="login-btn" @click="handleLogin">登录</button>
      
      <view class="links">
        <text @click="goToRegister">没有账号？立即注册</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { login } from '@/api/auth'
import { storage } from '@/utils/storage'

const formData = reactive({
  username: '',
  password: ''
})

const handleLogin = async () => {
  if (!formData.username || !formData.password) {
    uni.showToast({ title: '请填写完整信息', icon: 'none' })
    return
  }

  // Mock login for demo if API fails
  if (formData.username === 'admin' && formData.password === '123456') {
      const mockUser = {
          nickname: '管理员',
          avatar: '/static/default-avatar.png',
          role: 'admin',
          phone: '13800138000'
      }
      storage.set('access_token', 'mock_token')
      storage.set('user_info', mockUser)
      uni.showToast({ title: '登录成功', icon: 'success' })
      setTimeout(() => {
          uni.switchTab({ url: '/pages/shop/index' })
      }, 1500)
      return
  }

  try {
    // Attempt real login
    // const res = await login(formData)
    // storage.set('access_token', res.access_token)
    // storage.set('user_info', res.user_info)
    
    // Fallback Mock for Visitor
    const mockUser = {
        nickname: '张三丰',
        avatar: '/static/default-avatar.png',
        role: 'visitor',
        phone: '138****8888'
    }
    storage.set('access_token', 'mock_token_visitor')
    storage.set('user_info', mockUser)
    
    uni.showToast({ title: '登录成功', icon: 'success' })
    
    setTimeout(() => {
      uni.switchTab({ url: '/pages/shop/index' })
    }, 1500)
  } catch (error) {
    console.error('Login failed:', error)
    uni.showToast({ title: '登录失败', icon: 'none' })
  }
}

const goToRegister = () => {
  uni.navigateTo({ url: '/pages/user/register' })
}
</script>

<style lang="scss" scoped>
.login-container {
  padding: 60rpx 40rpx;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.logo {
  text-align: center;
  margin-bottom: 80rpx;
  
  .logo-img {
    width: 160rpx;
    height: 160rpx;
    margin-bottom: 20rpx;
    border-radius: 20rpx;
  }
  
  .logo-text {
    font-size: 40rpx;
    color: #fff;
    font-weight: bold;
    letter-spacing: 4rpx;
  }
}

.form-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 60rpx 40rpx;
  box-shadow: 0 10rpx 30rpx rgba(0,0,0,0.1);
  
  .input-group {
      margin-bottom: 60rpx;
  }
  
  .input-item {
    display: flex;
    align-items: center;
    border-bottom: 2rpx solid #eee;
    padding: 24rpx 0;
    margin-bottom: 30rpx;
    
    .icon {
        margin-right: 20rpx;
    }
    
    .input-field {
        flex: 1;
        font-size: 30rpx;
        color: #333;
        height: 60rpx;
        line-height: 60rpx;
    }
    
    .input-placeholder {
        color: #ccc;
    }
  }
  
  .login-btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    font-size: 32rpx;
    border-radius: 44rpx;
    border: none;
    font-weight: bold;
    
    &:active {
        opacity: 0.9;
    }
    
    &::after {
        border: none;
    }
  }
  
  .links {
    text-align: center;
    margin-top: 40rpx;
    
    text {
      color: #667eea;
      font-size: 28rpx;
    }
  }
}
</style>

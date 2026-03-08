<template>
  <view class="login-container">
    <view class="logo">
      <image src="/static/logo.png" mode="aspectFit" class="logo-img"></image>
      <text class="logo-text">数智农旅平台</text>
    </view>

    <view class="form">
      <u-form :model="formData" ref="formRef" label-width="0">
        <u-form-item prop="username" border-bottom>
          <u-input 
            v-model="formData.username" 
            placeholder="请输入用户名/手机号"
            prefix-icon="account"
          ></u-input>
        </u-form-item>
        
        <u-form-item prop="password" border-bottom>
          <u-input 
            v-model="formData.password" 
            type="password"
            placeholder="请输入密码"
            prefix-icon="lock"
          ></u-input>
        </u-form-item>
      </u-form>

      <view class="actions">
        <button class="login-btn" @click="handleLogin">登录</button>
        <view class="links">
          <text @click="goToRegister">没有账号？立即注册</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { login } from '@/api/auth'
import { storage } from '@/utils/storage'

const formRef = ref<any>(null)
const formData = reactive({
  username: '',
  password: ''
})

const handleLogin = async () => {
  if (!formData.username || !formData.password) {
    uni.showToast({ title: '请填写完整信息', icon: 'none' })
    return
  }

  try {
    const res = await login(formData)
    
    // 保存 token 和用户信息
    storage.set('access_token', res.access_token)
    storage.set('user_info', res.user_info)
    
    uni.showToast({ title: '登录成功', icon: 'success' })
    
    setTimeout(() => {
      uni.switchTab({ url: '/pages/shop/index' })
    }, 1500)
  } catch (error) {
    console.error('Login failed:', error)
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
}

.logo {
  text-align: center;
  margin-bottom: 80rpx;
  
  .logo-img {
    width: 160rpx;
    height: 160rpx;
    margin-bottom: 20rpx;
  }
  
  .logo-text {
    font-size: 36rpx;
    color: #fff;
    font-weight: bold;
  }
}

.form {
  background: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
  
  .login-btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    font-size: 32rpx;
    border-radius: 44rpx;
    margin-top: 60rpx;
    border: none;
  }
  
  .links {
    text-align: center;
    margin-top: 30rpx;
    
    text {
      color: #667eea;
      font-size: 28rpx;
    }
  }
}
</style>

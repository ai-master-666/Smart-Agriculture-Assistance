<template>
  <view class="register-container">
    <view class="logo">
      <text class="logo-text">用户注册</text>
    </view>

    <view class="form">
      <u-form :model="formData" ref="formRef" label-width="0">
        <u-form-item prop="username" border-bottom>
          <u-input 
            v-model="formData.username" 
            placeholder="请输入用户名"
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
        
        <u-form-item prop="confirmPassword" border-bottom>
          <u-input 
            v-model="formData.confirmPassword" 
            type="password"
            placeholder="请确认密码"
            prefix-icon="lock"
          ></u-input>
        </u-form-item>
        
        <u-form-item prop="phone" border-bottom>
          <u-input 
            v-model="formData.phone" 
            type="number"
            placeholder="请输入手机号（选填）"
            prefix-icon="mobile"
          ></u-input>
        </u-form-item>
      </u-form>

      <view class="actions">
        <button class="register-btn" @click="handleRegister">立即注册</button>
        <view class="links">
          <text @click="goToLogin">已有账号？返回登录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { register } from '@/api/auth'

const formRef = ref<any>(null)
const formData = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  phone: ''
})

const handleRegister = async () => {
  if (!formData.username || !formData.password) {
    uni.showToast({ title: '请填写必填项', icon: 'none' })
    return
  }
  
  if (formData.password !== formData.confirmPassword) {
    uni.showToast({ title: '两次密码不一致', icon: 'none' })
    return
  }
  
  if (formData.phone && !/^1[3-9]\d{9}$/.test(formData.phone)) {
    uni.showToast({ title: '手机号格式不正确', icon: 'none' })
    return
  }

  try {
    await register({
      username: formData.username,
      password: formData.password,
      phone: formData.phone || undefined
    })
    
    uni.showToast({ title: '注册成功', icon: 'success' })
    
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (error) {
    console.error('Register failed:', error)
  }
}

const goToLogin = () => {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.register-container {
  padding: 60rpx 40rpx;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.logo {
  text-align: center;
  margin-bottom: 60rpx;
  
  .logo-text {
    font-size: 48rpx;
    color: #fff;
    font-weight: bold;
  }
}

.form {
  background: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
  
  .register-btn {
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

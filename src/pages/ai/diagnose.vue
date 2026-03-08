<template>
  <view class="diagnose-container">
    <view class="upload-area" @click="chooseImage" v-if="!imagePath">
      <u-icon name="camera-fill" size="60" color="#ccc"></u-icon>
      <text class="upload-tip">点击拍摄/上传作物照片</text>
    </view>
    
    <view class="preview-area" v-else>
      <image :src="imagePath" mode="aspectFit" class="preview-img"></image>
      <view class="re-upload" @click="chooseImage">重拍</view>
    </view>
    
    <view class="action-area">
      <button class="diagnose-btn" @click="startDiagnose" :disabled="!imagePath || isAnalyzing">
        {{ isAnalyzing ? '正在分析...' : '开始诊断' }}
      </button>
    </view>
    
    <!-- 诊断结果 -->
    <view class="result-card" v-if="result">
      <view class="result-header">
        <text class="disease-name">{{ result.disease_name }}</text>
        <text class="confidence">置信度: {{ (result.confidence * 100).toFixed(1) }}%</text>
      </view>
      
      <view class="result-section">
        <text class="section-label">症状描述</text>
        <text class="section-content">{{ result.description }}</text>
      </view>
      
      <view class="result-section">
        <text class="section-label">防治建议</text>
        <text class="section-content">{{ result.treatment }}</text>
      </view>
      
      <view class="expert-help">
        <button class="expert-btn" open-type="contact">咨询专家</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { diagnoseCrop } from '@/api/ai'
import type { DiagnoseResult } from '@/api/ai'

const imagePath = ref('')
const isAnalyzing = ref(false)
const result = ref<DiagnoseResult | null>(null)

const chooseImage = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      imagePath.value = res.tempFilePaths[0]
      result.value = null // 清空旧结果
    }
  })
}

const startDiagnose = async () => {
  if (!imagePath.value) return
  
  isAnalyzing.value = true
  try {
    // 真实调用后端识别接口
    const res = await diagnoseCrop(imagePath.value)
    if (res) {
      result.value = res
    }
  } catch (e) {
    console.error('AI Diagnose Error:', e)
    
    // 模拟识别结果兜底
    result.value = {
      disease_name: '番茄早疫病 (模拟)',
      confidence: 0.95,
      description: '未能连接 AI 服务，这是本地模拟的诊断结果。叶片上出现圆形或近圆形褐色病斑，有同心轮纹。',
      treatment: '建议喷洒代森锰锌或百菌清可湿性粉剂，每7-10天一次，连续2-3次。',
      preventive_measures: '加强通风透光，控制田间湿度。'
    }
  } finally {
    isAnalyzing.value = false
  }
}
</script>

<style lang="scss" scoped>
.diagnose-container {
  min-height: 100vh;
  padding: 30rpx;
  background: #f5f5f5;
}

.upload-area {
  height: 400rpx;
  background: #fff;
  border-radius: 20rpx;
  border: 2rpx dashed #ccc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 40rpx;
  
  .upload-tip {
    font-size: 28rpx;
    color: #999;
    margin-top: 20rpx;
  }
}

.preview-area {
  height: 400rpx;
  position: relative;
  margin-bottom: 40rpx;
  
  .preview-img {
    width: 100%;
    height: 100%;
    border-radius: 20rpx;
  }
  
  .re-upload {
    position: absolute;
    bottom: 20rpx;
    right: 20rpx;
    background: rgba(0,0,0,0.6);
    color: #fff;
    padding: 10rpx 30rpx;
    border-radius: 30rpx;
    font-size: 24rpx;
  }
}

.diagnose-btn {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: #fff;
  border-radius: 50rpx;
  font-size: 32rpx;
  height: 90rpx;
  line-height: 90rpx;
  
  &[disabled] {
    opacity: 0.6;
  }
}

.result-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-top: 40rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
  
  .result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
    padding-bottom: 20rpx;
    border-bottom: 1rpx solid #eee;
    
    .disease-name {
      font-size: 36rpx;
      font-weight: bold;
      color: #ff4444;
    }
    
    .confidence {
      font-size: 24rpx;
      color: #999;
    }
  }
  
  .result-section {
    margin-bottom: 24rpx;
    
    .section-label {
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
      display: block;
      margin-bottom: 8rpx;
    }
    
    .section-content {
      font-size: 26rpx;
      color: #666;
      line-height: 1.5;
    }
  }
  
  .expert-help {
    margin-top: 30rpx;
    .expert-btn {
      background: #fff;
      color: #667eea;
      border: 2rpx solid #667eea;
      font-size: 28rpx;
      border-radius: 40rpx;
    }
  }
}
</style>

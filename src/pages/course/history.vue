<template>
  <view class="history-container">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="back-btn" @click="goBack">
        <u-icon name="arrow-left" size="28" color="#333"></u-icon>
      </view>
      <text class="title">学习记录</text>
      <view class="placeholder"></view>
    </view>

    <!-- 学习统计 -->
    <view class="stats-section">
      <view class="stat-card">
        <text class="stat-number">{{ totalCourses }}</text>
        <text class="stat-label">已学课程</text>
      </view>
      <view class="stat-card">
        <text class="stat-number">{{ totalHours }}</text>
        <text class="stat-label">学习时长</text>
      </view>
      <view class="stat-card">
        <text class="stat-number">{{ totalCertificates }}</text>
        <text class="stat-label">获得证书</text>
      </view>
    </view>

    <!-- 学习记录列表 -->
    <view class="history-section">
      <view class="section-header">
        <text class="section-title">最近学习</text>
      </view>
      <view class="history-list">
        <view 
          v-for="course in learningHistory" 
          :key="course.id"
          class="history-item"
          @click="continueLearning(course)"
        >
          <image :src="course.cover_image" mode="aspectFill" class="course-img"></image>
          <view class="course-info">
            <text class="course-title">{{ course.title }}</text>
            <view class="course-meta">
              <text class="meta-item">{{ course.last_learned }}</text>
              <text class="meta-item">{{ course.progress }}%</text>
            </view>
            <view class="progress-bar">
              <view class="progress-fill" :style="{ width: course.progress + '%' }"></view>
            </view>
            <view class="continue-btn">
              <text>继续学习</text>
              <u-icon name="arrow-right" size="16" color="#667eea"></u-icon>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 已完成课程 -->
    <view class="completed-section">
      <view class="section-header">
        <text class="section-title">已完成课程</text>
      </view>
      <view class="completed-list">
        <view 
          v-for="course in completedCourses" 
          :key="course.id"
          class="completed-item"
          @click="viewCourse(course)"
        >
          <image :src="course.cover_image" mode="aspectFill" class="course-img"></image>
          <view class="course-info">
            <text class="course-title">{{ course.title }}</text>
            <view class="course-meta">
              <text class="meta-item">{{ course.completed_date }}</text>
              <view class="certificate-badge" v-if="course.has_certificate">
                <u-icon name="medal" size="14" color="#ffd700"></u-icon>
                <text>已获得证书</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 学习统计数据
const totalCourses = ref(5)
const totalHours = ref('12.5')
const totalCertificates = ref(2)

// 最近学习记录
const learningHistory = ref([
  {
    id: 1,
    title: '现代农业种植技术基础',
    cover_image: 'https://cdn.uviewui.com/uview/album/1.jpg',
    last_learned: '2024-03-10',
    progress: 65
  },
  {
    id: 2,
    title: '农产品电商运营实战',
    cover_image: 'https://cdn.uviewui.com/uview/album/2.jpg',
    last_learned: '2024-03-08',
    progress: 30
  },
  {
    id: 3,
    title: '乡村直播带货技巧',
    cover_image: 'https://cdn.uviewui.com/uview/album/3.jpg',
    last_learned: '2024-03-05',
    progress: 80
  }
])

// 已完成课程
const completedCourses = ref([
  {
    id: 4,
    title: '农作物病虫害防治',
    cover_image: 'https://cdn.uviewui.com/uview/album/4.jpg',
    completed_date: '2024-02-28',
    has_certificate: true
  },
  {
    id: 5,
    title: '农业政策解读',
    cover_image: 'https://cdn.uviewui.com/uview/album/5.jpg',
    completed_date: '2024-02-20',
    has_certificate: true
  }
])

const continueLearning = (course: any) => {
  uni.showToast({ title: `继续学习：${course.title}`, icon: 'none' })
}

const viewCourse = (course: any) => {
  uni.showToast({ title: `查看课程：${course.title}`, icon: 'none' })
}

const goBack = () => {
  uni.navigateBack()
}

onLoad()
</script>

<style lang="scss" scoped>
.history-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 20rpx;
  background: #fff;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
  
  .back-btn {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
  }
  
  .placeholder {
    width: 60rpx;
  }
}

.stats-section {
  display: flex;
  justify-content: space-around;
  background: #fff;
  padding: 30rpx 0;
  margin: 20rpx 0;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
  
  .stat-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .stat-number {
      font-size: 36rpx;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 8rpx;
    }
    
    .stat-label {
      font-size: 24rpx;
      color: #666;
    }
  }
}

.history-section,
.completed-section {
  background: #fff;
  margin-bottom: 20rpx;
  padding: 24rpx;
  
  .section-header {
    margin-bottom: 24rpx;
    
    .section-title {
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
    }
  }
}

.history-list {
  .history-item {
    display: flex;
    margin-bottom: 24rpx;
    padding-bottom: 24rpx;
    border-bottom: 1rpx solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    
    .course-img {
      width: 140rpx;
      height: 100rpx;
      border-radius: 8rpx;
      background-color: #eee;
      margin-right: 20rpx;
    }
    
    .course-info {
      flex: 1;
      
      .course-title {
        display: block;
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 12rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .course-meta {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12rpx;
        
        .meta-item {
          font-size: 22rpx;
          color: #999;
        }
      }
      
      .progress-bar {
        width: 100%;
        height: 8rpx;
        background: #f0f0f0;
        border-radius: 4rpx;
        margin-bottom: 16rpx;
        overflow: hidden;
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          border-radius: 4rpx;
        }
      }
      
      .continue-btn {
        display: flex;
        align-items: center;
        font-size: 24rpx;
        color: #667eea;
        
        text {
          margin-right: 8rpx;
        }
      }
    }
  }
}

.completed-list {
  .completed-item {
    display: flex;
    margin-bottom: 24rpx;
    padding-bottom: 24rpx;
    border-bottom: 1rpx solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    
    .course-img {
      width: 140rpx;
      height: 100rpx;
      border-radius: 8rpx;
      background-color: #eee;
      margin-right: 20rpx;
    }
    
    .course-info {
      flex: 1;
      
      .course-title {
        display: block;
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 12rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .course-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .meta-item {
          font-size: 22rpx;
          color: #999;
        }
        
        .certificate-badge {
          display: flex;
          align-items: center;
          font-size: 20rpx;
          color: #ffd700;
          
          text {
            margin-left: 8rpx;
          }
        }
      }
    }
  }
}
</style>
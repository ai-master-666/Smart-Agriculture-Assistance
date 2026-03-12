<template>
  <view class="detail-container" v-if="course">
    <!-- 视频播放区 -->
    <view class="video-section">
      <video 
        v-if="currentVideoUrl"
        :src="currentVideoUrl" 
        class="video-player"
        controls
        autoplay
        show-center-play-btn
        @ended="onVideoEnded"
      ></video>
      <view class="cover-box" v-else>
        <image :src="course.cover_image || '/static/default-course.png'" mode="aspectFill" class="cover-img"></image>
        <view class="play-btn" @click="startLearning">
          <u-icon name="play-right-fill" color="#fff" size="32"></u-icon>
        </view>
      </view>
    </view>

    <!-- 课程信息 -->
    <view class="info-section">
      <text class="title">{{ course.title }}</text>
      <view class="meta-row">
        <text class="count">{{ course.student_count || 0 }}人已学</text>
        <text class="divider">|</text>
        <text class="level">{{ course.level || '初级' }}</text>
      </view>
      <view class="price-row">
        <text class="price" v-if="course.price > 0">¥{{ course.price }}</text>
        <text class="free" v-else>免费课程</text>
      </view>
    </view>

    <view class="gap"></view>

    <!-- 详情与目录 Tabs -->
    <u-sticky bgColor="#fff">
      <view class="tabs-section">
        <u-tabs :list="tabList" :current="currentTab" @click="changeTab" lineColor="#667eea" activeColor="#667eea" :scrollable="false"></u-tabs>
      </view>
    </u-sticky>

    <!-- 简介内容 -->
    <view class="content-box" v-if="currentTab === 0">
      <view class="intro-block">
        <text class="block-title">讲师介绍</text>
        <view class="instructor-info">
          <image src="https://cdn.uviewui.com/uview/album/1.jpg" class="avatar"></image>
          <view class="info">
            <text class="name">{{ course.instructor_name || '特邀农技专家' }}</text>
            <text class="desc">拥有丰富的一线种植经验，擅长果蔬病虫害防治。</text>
          </view>
        </view>
      </view>
      
      <view class="intro-block">
        <text class="block-title">课程详情</text>
        <text class="desc-text">{{ course.description || '暂无课程描述' }}</text>
      </view>
    </view>

    <!-- 目录内容 -->
    <view class="catalog-box" v-if="currentTab === 1">
      <view class="chapter-list" v-if="course.chapters && course.chapters.length > 0">
        <view class="chapter-item" v-for="(chapter, cIndex) in course.chapters" :key="chapter.id">
          <text class="chapter-title">第{{ cIndex + 1 }}章 {{ chapter.title }}</text>
          <view class="lesson-list">
            <view 
              class="lesson-item" 
              v-for="(lesson, lIndex) in chapter.lessons" 
              :key="lesson.id"
              @click="playLesson(lesson)"
              :class="{ active: currentLessonId === lesson.id }"
            >
              <view class="left">
                <u-icon :name="currentLessonId === lesson.id ? 'pause' : 'play-circle'" size="18" :color="currentLessonId === lesson.id ? '#667eea' : '#999'"></u-icon>
                <text class="lesson-title">{{ lIndex + 1 }}. {{ lesson.title }}</text>
              </view>
              <view class="right">
                <text class="duration">{{ formatDuration(lesson.duration) }}</text>
                <text class="tag-free" v-if="lesson.is_free">试看</text>
                <u-icon name="lock" size="14" color="#ccc" v-else-if="!isPurchased"></u-icon>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="empty-catalog" v-else>
        <u-empty mode="list" text="暂无章节信息"></u-empty>
      </view>
    </view>

    <!-- 底部购买栏 -->
    <view class="footer-bar">
      <view class="fav-btn" @click="toggleFavorite">
        <u-icon :name="isFavorite ? 'star-fill' : 'star'" :color="isFavorite ? '#ff9900' : '#666'" size="20"></u-icon>
        <text>收藏</text>
      </view>
      <button class="buy-btn" @click="handleEnroll" :disabled="isPurchased">
        {{ isPurchased ? '已报名，继续学习' : (course.price > 0 ? '立即购买 ¥' + course.price : '免费报名') }}
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getCourseDetail, enrollCourse } from '@/api/course'
import type { Course, Lesson } from '@/api/course'

const course = ref<Course | null>(null)
const currentTab = ref(0)
const tabList = [{ name: '简介' }, { name: '目录' }]
const currentVideoUrl = ref('')
const currentLessonId = ref<number | null>(null)
const isPurchased = ref(false) // Mock status
const isFavorite = ref(false)

onLoad(async (options: any) => {
  if (options.id) {
    try {
      const res = await getCourseDetail(Number(options.id))
      if (res) {
        course.value = res
        // Mock data
        if (!course.value.chapters) {
            course.value.chapters = [
                {
                    id: 1, title: '基础知识', sort_order: 1, lessons: [
                        { id: 101, title: '课程导学', duration: 300, is_free: true, video_url: 'https://cdn.uviewui.com/uview/resources/video.mp4' },
                        { id: 102, title: '技术原理', duration: 1200, is_free: false, video_url: 'https://cdn.uviewui.com/uview/resources/video.mp4' }
                    ]
                },
                {
                    id: 2, title: '实战演练', sort_order: 2, lessons: [
                        { id: 201, title: '操作示范', duration: 1800, is_free: false, video_url: 'https://cdn.uviewui.com/uview/resources/video.mp4' }
                    ]
                }
            ]
        }
        // Mock purchased status for free courses
        if (course.value.price === 0) {
            isPurchased.value = true
        }
      }
    } catch (e) {
      console.error(e)
    }
  }
})

const changeTab = (item: any) => {
  currentTab.value = item.index
}

const startLearning = () => {
  if (course.value?.chapters?.[0]?.lessons?.[0]) {
    playLesson(course.value.chapters[0].lessons[0])
    currentTab.value = 1 // Switch to catalog
  }
}

const playLesson = (lesson: Lesson) => {
  if (!lesson.is_free && !isPurchased.value) {
    uni.showToast({ title: '请先购买课程', icon: 'none' })
    return
  }
  
  if (lesson.video_url) {
      currentVideoUrl.value = lesson.video_url
      currentLessonId.value = lesson.id
  } else {
      uni.showToast({ title: '视频资源缺失', icon: 'none' })
  }
}

const onVideoEnded = () => {
  // Auto play next logic could be here
}

const handleEnroll = async () => {
  if (isPurchased.value) {
      // Continue learning
      startLearning()
      return
  }
  
  try {
      if (course.value) {
        // Mock API call
        // await enrollCourse(course.value.id)
        isPurchased.value = true
        uni.showToast({ title: '报名成功', icon: 'success' })
      }
  } catch (e) {
      uni.showToast({ title: '报名失败', icon: 'none' })
  }
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  uni.showToast({ title: isFavorite.value ? '已收藏' : '已取消', icon: 'none' })
}

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s < 10 ? '0' + s : s}`
}
</script>

<style lang="scss" scoped>
.detail-container {
  min-height: 100vh;
  background: #fff;
  padding-bottom: 120rpx;
}

.video-section {
  width: 100%;
  height: 420rpx;
  background: #000;
  
  .video-player {
    width: 100%;
    height: 100%;
  }
  
  .cover-box {
    width: 100%;
    height: 100%;
    position: relative;
    
    .cover-img {
      width: 100%;
      height: 100%;
      opacity: 0.8;
    }
    
    .play-btn {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 100rpx;
      height: 100rpx;
      background: rgba(0,0,0,0.5);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2rpx solid rgba(255,255,255,0.6);
    }
  }
}

.info-section {
  padding: 30rpx;
  
  .title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 16rpx;
    display: block;
  }
  
  .meta-row {
    display: flex;
    align-items: center;
    font-size: 24rpx;
    color: #999;
    margin-bottom: 20rpx;
    
    .divider {
      margin: 0 16rpx;
      color: #eee;
    }
  }
  
  .price-row {
    .price {
      font-size: 40rpx;
      color: #ff4444;
      font-weight: bold;
    }
    .free {
      font-size: 36rpx;
      color: #43e97b;
      font-weight: bold;
    }
  }
}

.gap {
  height: 20rpx;
  background: #f8f8f8;
}

.tabs-section {
  border-bottom: 1rpx solid #eee;
}

.content-box {
  padding: 30rpx;
  
  .intro-block {
    margin-bottom: 40rpx;
    
    .block-title {
      font-size: 30rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
      display: block;
    }
    
    .instructor-info {
      display: flex;
      align-items: center;
      background: #f9f9f9;
      padding: 20rpx;
      border-radius: 12rpx;
      
      .avatar {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        margin-right: 20rpx;
      }
      
      .info {
        flex: 1;
        
        .name {
          font-size: 28rpx;
          font-weight: bold;
          color: #333;
          display: block;
        }
        
        .desc {
          font-size: 24rpx;
          color: #666;
          margin-top: 4rpx;
        }
      }
    }
    
    .desc-text {
      font-size: 28rpx;
      color: #666;
      line-height: 1.6;
    }
  }
}

.catalog-box {
  .chapter-list {
    padding-bottom: 20rpx;
  }
  
  .chapter-item {
    .chapter-title {
      display: block;
      background: #f8f8f8;
      padding: 20rpx 30rpx;
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
    }
    
    .lesson-list {
      .lesson-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 30rpx;
        border-bottom: 1rpx solid #f5f5f5;
        
        &:active {
          background-color: #f9f9f9;
        }
        
        &.active {
          .left .lesson-title {
            color: #667eea;
          }
        }
        
        .left {
          display: flex;
          align-items: center;
          flex: 1;
          margin-right: 20rpx;
          
          .lesson-title {
            font-size: 28rpx;
            color: #333;
            margin-left: 16rpx;
            line-height: 1.4;
          }
        }
        
        .right {
          display: flex;
          align-items: center;
          
          .duration {
            font-size: 24rpx;
            color: #999;
            margin-right: 16rpx;
          }
          
          .tag-free {
            font-size: 20rpx;
            color: #43e97b;
            border: 1rpx solid #43e97b;
            padding: 2rpx 8rpx;
            border-radius: 4rpx;
          }
        }
      }
    }
  }
  
  .empty-catalog {
    margin-top: 100rpx;
  }
}

.footer-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 110rpx;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  box-sizing: border-box;
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
  z-index: 100;
  
  .fav-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 40rpx;
    
    text {
      font-size: 20rpx;
      color: #666;
      margin-top: 4rpx;
    }
  }
  
  .buy-btn {
    flex: 1;
    height: 80rpx;
    line-height: 80rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    border-radius: 40rpx;
    font-size: 28rpx;
    font-weight: bold;
    border: none;
    
    &[disabled] {
      background: #e0e0e0;
      color: #999;
    }
    
    &::after {
      border: none;
    }
  }
}
</style>

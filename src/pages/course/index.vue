<template>
  <view class="course-container">
    <!-- 分类筛选 -->
    <scroll-view scroll-x class="category-scroll">
      <view class="category-list">
        <view 
          v-for="(cat, index) in categories" 
          :key="index"
          class="category-item"
          :class="{ active: currentCategory === index }"
          @click="selectCategory(index)"
        >
          {{ cat }}
        </view>
      </view>
    </scroll-view>

    <!-- 课程列表 -->
    <view class="course-list">
      <view 
        v-for="course in courseList" 
        :key="course.id"
        class="course-card"
        @click="goToDetail(course.id)"
      >
        <image :src="course.cover_image || '/static/default-course.png'" mode="aspectFill" class="course-img"></image>
        
        <view class="course-info">
          <text class="course-title">{{ course.title }}</text>
          <view class="course-meta">
            <text class="meta-item">{{ course.instructor_name || '未知讲师' }}</text>
            <text class="meta-item">学习人数：{{ course.student_count || 0 }}</text>
          </view>
          <view class="course-footer">
            <text class="course-price" v-if="course.price > 0">¥{{ course.price }}</text>
            <text class="course-free" v-else>免费</text>
            <view class="play-icon">
              <u-icon name="play-circle-fill" size="40" color="#667eea"></u-icon>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 空状态 -->
    <view v-if="courseList.length === 0 && loadStatus === 'nomore'" class="empty-state">
        <u-empty mode="data" text="暂无课程"></u-empty>
    </view>
    
    <!-- 加载更多 -->
    <view class="load-more" v-if="courseList.length > 0">
      <u-loadmore :status="loadStatus"></u-loadmore>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import { getCourseList } from '@/api/course'
import type { Course } from '@/api/course'

const categories = ['全部', '种植技术', '电商运营', '直播带货', '政策解读']
const currentCategory = ref(0)
const courseList = ref<Course[]>([])
const page = ref(1)
const pageSize = ref(10)
const loadStatus = ref<'loadmore' | 'loading' | 'nomore'>('loadmore')

const loadCourses = async (reset = false) => {
  if (reset) {
      page.value = 1
      loadStatus.value = 'loading'
  }
  if (loadStatus.value === 'nomore' && !reset) return

  try {
    const category = currentCategory.value === 0 ? undefined : categories[currentCategory.value]
    const res = await getCourseList({ 
        page: page.value, 
        page_size: pageSize.value,
        category 
    })
    
    if (res && res.items) {
      if (reset) {
          courseList.value = res.items
      } else {
          courseList.value = [...courseList.value, ...res.items]
      }
      
      if (res.items.length < pageSize.value) {
          loadStatus.value = 'nomore'
      } else {
          loadStatus.value = 'loadmore'
          page.value++
      }
    } else {
      if (reset) courseList.value = []
      loadStatus.value = 'nomore'
    }
  } catch (e) {
    console.error('Failed to load courses:', e)
    loadStatus.value = 'nomore'
  } finally {
      uni.stopPullDownRefresh()
  }
}

const selectCategory = (index: number) => {
  currentCategory.value = index
  loadCourses(true)
}

const goToDetail = (id: number) => {
  uni.navigateTo({ url: `/pages/course/detail?id=${id}` })
}

onLoad(() => {
  loadCourses(true)
})

onPullDownRefresh(() => {
    loadCourses(true)
})

onReachBottom(() => {
    loadCourses()
})
</script>

<style lang="scss" scoped>
.course-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20rpx;
}

.category-scroll {
  background: #fff;
  padding: 20rpx 0;
  margin-bottom: 20rpx;
  position: sticky;
  top: 0;
  z-index: 10;
  
  .category-list {
    display: inline-flex;
    padding: 0 20rpx;
    
    .category-item {
      padding: 12rpx 30rpx;
      margin-right: 20rpx;
      border-radius: 30rpx;
      background: #f5f5f5;
      font-size: 28rpx;
      white-space: nowrap;
      
      &.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;
      }
    }
  }
}

.course-list {
  padding: 0 20rpx;
  
  .course-card {
    background: #fff;
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    overflow: hidden;
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
    
    .course-img {
      width: 100%;
      height: 340rpx;
      background-color: #eee;
    }
    
    .course-info {
      padding: 24rpx;
      
      .course-title {
        display: block;
        font-size: 30rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 16rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .course-meta {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16rpx;
        
        .meta-item {
          font-size: 24rpx;
          color: #999;
        }
      }
      
      .course-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .course-price {
          font-size: 32rpx;
          color: #ff4444;
          font-weight: bold;
        }
        
        .course-free {
          font-size: 28rpx;
          color: #43e97b;
          font-weight: bold;
        }
        
        .play-icon {
          display: flex;
          align-items: center;
        }
      }
    }
  }
}

.load-more {
    padding: 20rpx 0;
}

.empty-state {
    margin-top: 100rpx;
}
</style>

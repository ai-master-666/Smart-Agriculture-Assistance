<template>
  <view class="qa-container">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="back-btn" @click="goBack">
        <u-icon name="arrow-left" size="28" color="#333"></u-icon>
      </view>
      <text class="title">农技问答</text>
      <view class="ask-btn" @click="askQuestion">
        <u-icon name="chat-line-round" size="24" color="#667eea"></u-icon>
        <text>提问</text>
      </view>
    </view>

    <!-- 搜索框 -->
    <view class="search-section">
      <u-search v-model="searchKeyword" placeholder="搜索问题" @search="searchQuestions"></u-search>
    </view>

    <!-- 分类筛选 -->
    <view class="category-section">
      <scroll-view scroll-x>
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
    </view>

    <!-- 问题列表 -->
    <scroll-view scroll-y class="question-list">
      <view 
        v-for="question in questions" 
        :key="question.id"
        class="question-item"
        @click="viewQuestion(question)"
      >
        <view class="question-header">
          <view class="user-info">
            <image :src="question.avatar" mode="aspectFill" class="avatar"></image>
            <view class="user-detail">
              <text class="username">{{ question.username }}</text>
              <text class="time">{{ question.time }}</text>
            </view>
          </view>
          <view class="question-tags">
            <view class="tag" v-for="(tag, index) in question.tags" :key="index">
              {{ tag }}
            </view>
          </view>
        </view>
        <text class="question-title">{{ question.title }}</text>
        <text class="question-content">{{ question.content }}</text>
        <view class="question-footer">
          <view class="action-item">
            <u-icon name="heart" size="20" color="#999"></u-icon>
            <text>{{ question.likes }}</text>
          </view>
          <view class="action-item">
            <u-icon name="chat-line-square" size="20" color="#999"></u-icon>
            <text>{{ question.answers }}</text>
          </view>
          <view class="action-item">
            <u-icon name="eye" size="20" color="#999"></u-icon>
            <text>{{ question.views }}</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 提问弹窗 -->
    <u-popup :show="showAskPopup" mode="bottom" @close="showAskPopup = false" :round="16" :height="500">
      <view class="ask-popup">
        <view class="popup-header">
          <text class="title">提出问题</text>
          <u-icon name="close" size="20" color="#999" @click="showAskPopup = false"></u-icon>
        </view>
        <view class="popup-content">
          <input 
            v-model="newQuestion.title" 
            placeholder="请输入问题标题" 
            class="question-input"
          />
          <textarea 
            v-model="newQuestion.content" 
            placeholder="请详细描述你的问题..." 
            class="content-input"
            rows="4"
          ></textarea>
          <view class="tag-input">
            <text class="tag-label">标签：</text>
            <view class="tag-list">
              <view 
                v-for="tag in availableTags" 
                :key="tag"
                class="tag-item"
                :class="{ active: newQuestion.tags.includes(tag) }"
                @click="toggleTag(tag)"
              >
                {{ tag }}
              </view>
            </view>
          </view>
        </view>
        <view class="popup-footer">
          <button class="cancel-btn" @click="showAskPopup = false">取消</button>
          <button class="submit-btn" @click="submitQuestion">提交</button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 搜索和分类
const searchKeyword = ref('')
const categories = ['全部', '种植技术', '养殖技术', '农机使用', '经营管理', '政策咨询']
const currentCategory = ref(0)

// 问题列表
const questions = ref([
  {
    id: 1,
    title: '如何防治水稻稻瘟病？',
    content: '我家水稻最近出现了稻瘟病，请问有什么有效的防治方法？',
    username: '农民张三',
    avatar: '/static/default-avatar.png',
    time: '2024-03-10',
    tags: ['种植技术', '病虫害'],
    likes: 15,
    answers: 5,
    views: 120
  },
  {
    id: 2,
    title: '农产品电商如何提高销量？',
    content: '我是一名新农民，刚接触电商，请问如何提高农产品的线上销量？',
    username: '新农人李四',
    avatar: '/static/default-avatar.png',
    time: '2024-03-08',
    tags: ['经营管理', '电商'],
    likes: 23,
    answers: 8,
    views: 200
  },
  {
    id: 3,
    title: '拖拉机维护保养技巧',
    content: '我的拖拉机使用了一年，请问日常维护保养需要注意哪些方面？',
    username: '农机手王五',
    avatar: '/static/default-avatar.png',
    time: '2024-03-05',
    tags: ['农机使用', '维护'],
    likes: 10,
    answers: 3,
    views: 80
  }
])

// 提问相关
const showAskPopup = ref(false)
const newQuestion = ref({
  title: '',
  content: '',
  tags: []
})
const availableTags = ['种植技术', '养殖技术', '农机使用', '经营管理', '政策咨询', '病虫害', '电商', '施肥', '灌溉']

// 方法
const selectCategory = (index: number) => {
  currentCategory.value = index
  // 实际项目中这里应该重新加载对应分类的问题
}

const searchQuestions = () => {
  // 实际项目中这里应该根据关键词搜索问题
  uni.showToast({ title: `搜索：${searchKeyword.value}`, icon: 'none' })
}

const viewQuestion = (question: any) => {
  uni.showToast({ title: `查看问题：${question.title}`, icon: 'none' })
}

const askQuestion = () => {
  showAskPopup.value = true
}

const toggleTag = (tag: string) => {
  const index = newQuestion.value.tags.indexOf(tag)
  if (index === -1) {
    newQuestion.value.tags.push(tag)
  } else {
    newQuestion.value.tags.splice(index, 1)
  }
}

const submitQuestion = () => {
  if (!newQuestion.value.title || !newQuestion.value.content) {
    uni.showToast({ title: '请填写完整问题', icon: 'none' })
    return
  }
  
  // 模拟提交问题
  uni.showLoading({ title: '提交中...' })
  setTimeout(() => {
    // 添加新问题到列表
    questions.value.unshift({
      id: Date.now(),
      title: newQuestion.value.title,
      content: newQuestion.value.content,
      username: '我',
      avatar: '/static/default-avatar.png',
      time: new Date().toISOString().split('T')[0],
      tags: [...newQuestion.value.tags],
      likes: 0,
      answers: 0,
      views: 0
    })
    
    // 重置表单
    newQuestion.value = {
      title: '',
      content: '',
      tags: []
    }
    
    showAskPopup.value = false
    uni.hideLoading()
    uni.showToast({ title: '提问成功', icon: 'success' })
  }, 1000)
}

const goBack = () => {
  uni.navigateBack()
}

onLoad()
</script>

<style lang="scss" scoped>
.qa-container {
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
  
  .ask-btn {
    display: flex;
    align-items: center;
    font-size: 24rpx;
    color: #667eea;
    
    text {
      margin-left: 8rpx;
    }
  }
}

.search-section {
  padding: 20rpx;
  background: #fff;
  margin-bottom: 20rpx;
}

.category-section {
  background: #fff;
  padding: 20rpx 0;
  margin-bottom: 20rpx;
  
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

.question-list {
  padding: 0 20rpx 40rpx;
  min-height: calc(100vh - 300rpx);
  
  .question-item {
    background: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
    
    .question-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16rpx;
      
      .user-info {
        display: flex;
        align-items: center;
        
        .avatar {
          width: 60rpx;
          height: 60rpx;
          border-radius: 30rpx;
          margin-right: 16rpx;
          background: #f0f0f0;
        }
        
        .user-detail {
          .username {
            display: block;
            font-size: 24rpx;
            font-weight: bold;
            color: #333;
            margin-bottom: 4rpx;
          }
          
          .time {
            font-size: 20rpx;
            color: #999;
          }
        }
      }
      
      .question-tags {
        display: flex;
        flex-direction: column;
        gap: 8rpx;
        
        .tag {
          padding: 4rpx 12rpx;
          background: #f0f0f0;
          border-radius: 12rpx;
          font-size: 18rpx;
          color: #666;
        }
      }
    }
    
    .question-title {
      display: block;
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 12rpx;
    }
    
    .question-content {
      font-size: 24rpx;
      color: #666;
      line-height: 1.4;
      margin-bottom: 20rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    
    .question-footer {
      display: flex;
      gap: 40rpx;
      
      .action-item {
        display: flex;
        align-items: center;
        font-size: 20rpx;
        color: #999;
        
        text {
          margin-left: 8rpx;
        }
      }
    }
  }
}

// 提问弹窗样式
.ask-popup {
  padding: 30rpx;
  
  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
    
    .title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
  }
  
  .popup-content {
    margin-bottom: 30rpx;
    
    .question-input {
      width: 100%;
      height: 80rpx;
      border: 2rpx solid #f0f0f0;
      border-radius: 12rpx;
      padding: 0 20rpx;
      font-size: 24rpx;
      margin-bottom: 20rpx;
    }
    
    .content-input {
      width: 100%;
      height: 200rpx;
      border: 2rpx solid #f0f0f0;
      border-radius: 12rpx;
      padding: 20rpx;
      font-size: 24rpx;
      resize: none;
      margin-bottom: 20rpx;
    }
    
    .tag-input {
      .tag-label {
        display: block;
        font-size: 24rpx;
        color: #333;
        margin-bottom: 16rpx;
      }
      
      .tag-list {
        display: flex;
        flex-wrap: wrap;
        gap: 12rpx;
        
        .tag-item {
          padding: 8rpx 16rpx;
          background: #f0f0f0;
          border-radius: 20rpx;
          font-size: 22rpx;
          color: #666;
          
          &.active {
            background: #667eea;
            color: #fff;
          }
        }
      }
    }
  }
  
  .popup-footer {
    display: flex;
    gap: 20rpx;
    
    button {
      flex: 1;
      height: 80rpx;
      border-radius: 40rpx;
      font-size: 28rpx;
      font-weight: bold;
      border: none;
      
      &.cancel-btn {
        background: #f0f0f0;
        color: #333;
      }
      
      &.submit-btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;
      }
    }
  }
}
</style>
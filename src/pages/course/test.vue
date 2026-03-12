<template>
  <view class="test-container">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="back-btn" @click="goBack">
        <u-icon name="arrow-left" size="28" color="#333"></u-icon>
      </view>
      <text class="title">课后测试</text>
      <view class="placeholder"></view>
    </view>

    <!-- 测试信息 -->
    <view class="test-info">
      <text class="course-name">{{ courseName }}</text>
      <view class="test-meta">
        <view class="meta-item">
          <u-icon name="timer" size="16" color="#666"></u-icon>
          <text>{{ duration }}分钟</text>
        </view>
        <view class="meta-item">
          <u-icon name="document" size="16" color="#666"></u-icon>
          <text>{{ totalQuestions }}题</text>
        </view>
        <view class="meta-item">
          <u-icon name="star" size="16" color="#ff9900"></u-icon>
          <text>及格分：{{ passScore }}分</text>
        </view>
      </view>
    </view>

    <!-- 测试进度 -->
    <view class="progress-section">
      <view class="progress-info">
        <text>第 {{ currentQuestionIndex + 1 }} / {{ totalQuestions }} 题</text>
        <text>{{ remainingTime }}:{{ remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds }}</text>
      </view>
      <view class="progress-bar">
        <view class="progress-fill" :style="{ width: progressPercent + '%' }"></view>
      </view>
    </view>

    <!-- 问题内容 -->
    <view class="question-section">
      <view class="question-header">
        <text class="question-number">{{ currentQuestionIndex + 1 }}. </text>
        <text class="question-text">{{ currentQuestion.question }}</text>
      </view>
      <view class="options-list">
        <view 
          v-for="(option, index) in currentQuestion.options" 
          :key="index"
          class="option-item"
          :class="{ 
            selected: selectedOptions[currentQuestionIndex] === index, 
            correct: showResult && correctOptions[currentQuestionIndex] === index,
            wrong: showResult && selectedOptions[currentQuestionIndex] === index && selectedOptions[currentQuestionIndex] !== correctOptions[currentQuestionIndex]
          }"
          @click="selectOption(index)"
        >
          <view class="option-letter">{{ String.fromCharCode(65 + index) }}</view>
          <text class="option-text">{{ option }}</text>
          <u-icon 
            v-if="showResult && correctOptions[currentQuestionIndex] === index" 
            name="checkmark-circle" 
            size="24" 
            color="#52c41a"
          ></u-icon>
          <u-icon 
            v-else-if="showResult && selectedOptions[currentQuestionIndex] === index && selectedOptions[currentQuestionIndex] !== correctOptions[currentQuestionIndex]" 
            name="close-circle" 
            size="24" 
            color="#ff4d4f"
          ></u-icon>
        </view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-buttons" v-if="!showResult">
      <button class="prev-btn" @click="prevQuestion" :disabled="currentQuestionIndex === 0">
        上一题
      </button>
      <button class="next-btn" @click="nextQuestion">
        {{ currentQuestionIndex === totalQuestions - 1 ? '提交' : '下一题' }}
      </button>
    </view>

    <!-- 测试结果 -->
    <view class="result-section" v-else>
      <view class="result-card">
        <view class="result-header">
          <u-icon :name="isPass ? 'checkmark-circle' : 'close-circle'" size="80" :color="isPass ? '#52c41a' : '#ff4d4f'"></u-icon>
          <text class="result-title">{{ isPass ? '测试通过' : '测试未通过' }}</text>
          <text class="result-score">得分：{{ score }} / {{ totalScore }}</text>
        </view>
        <view class="result-stats">
          <view class="stat-item">
            <text class="stat-number">{{ correctCount }}</text>
            <text class="stat-label">正确</text>
          </view>
          <view class="stat-item">
            <text class="stat-number">{{ wrongCount }}</text>
            <text class="stat-label">错误</text>
          </view>
          <view class="stat-item">
            <text class="stat-number">{{ unanswerCount }}</text>
            <text class="stat-label">未答</text>
          </view>
        </view>
        <view class="result-actions">
          <button class="review-btn" @click="reviewAnswers">
            查看答案
          </button>
          <button class="certificate-btn" v-if="isPass" @click="getCertificate">
            领取证书
          </button>
          <button class="retake-btn" v-else @click="retakeTest">
            重新测试
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 课程信息
const courseName = ref('现代农业种植技术基础')
const duration = ref(10) // 测试时长（分钟）
const totalQuestions = ref(5) // 总题目数
const passScore = ref(60) // 及格分数

// 测试数据
const questions = ref([
  {
    question: '以下哪种肥料属于有机肥？',
    options: ['尿素', '复合肥', '农家肥', '磷酸二铵'],
    correct: 2
  },
  {
    question: '农作物生长的三大要素是？',
    options: ['阳光、水分、土壤', '阳光、水分、空气', '水分、土壤、空气', '阳光、土壤、空气'],
    correct: 1
  },
  {
    question: '下列哪种是常见的水稻病虫害？',
    options: ['蚜虫', '稻瘟病', '白粉病', '红蜘蛛'],
    correct: 1
  },
  {
    question: '地膜覆盖的主要作用是？',
    options: ['增加光照', '减少水分蒸发', '防止病虫害', '提高土壤肥力'],
    correct: 1
  },
  {
    question: '农作物光合作用的主要场所是？',
    options: ['根', '茎', '叶', '花'],
    correct: 2
  }
])

// 测试状态
const currentQuestionIndex = ref(0)
const selectedOptions = ref<number[]>(new Array(totalQuestions.value).fill(-1))
const correctOptions = ref<number[]>(questions.value.map(q => q.correct))
const showResult = ref(false)
const score = ref(0)
const totalScore = ref(100)
const isPass = ref(false)
const remainingTime = ref(duration.value)
const remainingSeconds = ref(0)
const timer = ref<any>(null)

// 计算属性
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])
const progressPercent = computed(() => ((currentQuestionIndex.value + 1) / totalQuestions.value) * 100)
const correctCount = computed(() => {
  let count = 0
  for (let i = 0; i < totalQuestions.value; i++) {
    if (selectedOptions.value[i] === correctOptions.value[i]) count++
  }
  return count
})
const wrongCount = computed(() => {
  let count = 0
  for (let i = 0; i < totalQuestions.value; i++) {
    if (selectedOptions.value[i] !== -1 && selectedOptions.value[i] !== correctOptions.value[i]) count++
  }
  return count
})
const unanswerCount = computed(() => {
  return selectedOptions.value.filter(v => v === -1).length
})

// 方法
const selectOption = (index: number) => {
  if (!showResult) {
    selectedOptions.value[currentQuestionIndex.value] = index
  }
}

const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

const nextQuestion = () => {
  if (currentQuestionIndex.value < totalQuestions.value - 1) {
    currentQuestionIndex.value++
  } else {
    submitTest()
  }
}

const submitTest = () => {
  // 计算得分
  let total = 0
  for (let i = 0; i < totalQuestions.value; i++) {
    if (selectedOptions.value[i] === correctOptions.value[i]) {
      total += totalScore.value / totalQuestions.value
    }
  }
  score.value = Math.round(total)
  isPass.value = score.value >= passScore.value
  showResult.value = true
  stopTimer()
}

const reviewAnswers = () => {
  uni.showToast({ title: '查看答案', icon: 'none' })
}

const getCertificate = () => {
  uni.showToast({ title: '领取证书', icon: 'success' })
}

const retakeTest = () => {
  selectedOptions.value = new Array(totalQuestions.value).fill(-1)
  currentQuestionIndex.value = 0
  showResult.value = false
  remainingTime.value = duration.value
  remainingSeconds.value = 0
  startTimer()
}

const startTimer = () => {
  stopTimer()
  timer.value = setInterval(() => {
    if (remainingSeconds.value > 0) {
      remainingSeconds.value--
    } else {
      if (remainingTime.value > 0) {
        remainingTime.value--
        remainingSeconds.value = 59
      } else {
        // 时间到，自动提交
        submitTest()
      }
    }
  }, 1000)
}

const stopTimer = () => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
}

const goBack = () => {
  uni.navigateBack()
}

onLoad((options: any) => {
  if (options.courseId) {
    console.log('Loading test for course:', options.courseId)
  }
})

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  stopTimer()
})
</script>

<style lang="scss" scoped>
.test-container {
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

.test-info {
  background: #fff;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
  
  .course-name {
    display: block;
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 16rpx;
  }
  
  .test-meta {
    display: flex;
    gap: 30rpx;
    
    .meta-item {
      display: flex;
      align-items: center;
      font-size: 22rpx;
      color: #666;
      
      text {
        margin-left: 8rpx;
      }
    }
  }
}

.progress-section {
  background: #fff;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
  
  .progress-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16rpx;
    font-size: 24rpx;
    color: #333;
  }
  
  .progress-bar {
    width: 100%;
    height: 12rpx;
    background: #f0f0f0;
    border-radius: 6rpx;
    overflow: hidden;
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      border-radius: 6rpx;
    }
  }
}

.question-section {
  background: #fff;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
  
  .question-header {
    display: flex;
    margin-bottom: 32rpx;
    line-height: 1.5;
    
    .question-number {
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
      margin-right: 12rpx;
    }
    
    .question-text {
      flex: 1;
      font-size: 28rpx;
      color: #333;
    }
  }
  
  .options-list {
    .option-item {
      display: flex;
      align-items: center;
      padding: 24rpx;
      margin-bottom: 16rpx;
      border: 2rpx solid #f0f0f0;
      border-radius: 12rpx;
      transition: all 0.3s;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      &.selected {
        border-color: #667eea;
        background: rgba(102, 126, 234, 0.1);
      }
      
      &.correct {
        border-color: #52c41a;
        background: rgba(82, 196, 26, 0.1);
      }
      
      &.wrong {
        border-color: #ff4d4f;
        background: rgba(255, 77, 79, 0.1);
      }
      
      .option-letter {
        width: 40rpx;
        height: 40rpx;
        border-radius: 20rpx;
        background: #f0f0f0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24rpx;
        font-weight: bold;
        color: #666;
        margin-right: 20rpx;
      }
      
      .option-text {
        flex: 1;
        font-size: 24rpx;
        color: #333;
      }
    }
  }
}

.action-buttons {
  display: flex;
  gap: 20rpx;
  padding: 0 20rpx 40rpx;
  
  button {
    flex: 1;
    height: 80rpx;
    border-radius: 40rpx;
    font-size: 28rpx;
    font-weight: bold;
    
    &.prev-btn {
      background: #f0f0f0;
      color: #333;
      border: none;
    }
    
    &.next-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      border: none;
    }
  }
}

.result-section {
  padding: 40rpx 20rpx;
  
  .result-card {
    background: #fff;
    border-radius: 16rpx;
    padding: 40rpx;
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .result-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 40rpx;
      
      .result-title {
        font-size: 36rpx;
        font-weight: bold;
        color: #333;
        margin: 20rpx 0;
      }
      
      .result-score {
        font-size: 28rpx;
        color: #666;
      }
    }
    
    .result-stats {
      display: flex;
      justify-content: space-around;
      width: 100%;
      margin-bottom: 40rpx;
      padding: 20rpx 0;
      border-top: 1rpx solid #f0f0f0;
      border-bottom: 1rpx solid #f0f0f0;
      
      .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        
        .stat-number {
          font-size: 32rpx;
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
    
    .result-actions {
      display: flex;
      flex-direction: column;
      gap: 16rpx;
      width: 100%;
      
      button {
        height: 80rpx;
        border-radius: 40rpx;
        font-size: 28rpx;
        font-weight: bold;
        border: none;
        
        &.review-btn {
          background: #f0f0f0;
          color: #333;
        }
        
        &.certificate-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
        }
        
        &.retake-btn {
          background: #ff9900;
          color: #fff;
        }
      }
    }
  }
}
</style>
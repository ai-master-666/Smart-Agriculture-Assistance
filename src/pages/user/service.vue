<template>
  <view class="container">
    <view class="header">
      <text class="title">客服中心</text>
    </view>
    
    <view class="service-section">
      <text class="section-title">联系我们</text>
      <view class="service-list">
        <view class="service-item">
          <view class="service-icon">
            <text class="icon-text">📞</text>
          </view>
          <view class="service-info">
            <text class="service-label">客服热线</text>
            <text class="service-value">400-123-4567</text>
          </view>
          <u-button type="primary" size="small" @click="makePhoneCall">拨打</u-button>
        </view>
        
        <view class="service-item">
          <view class="service-icon">
            <text class="icon-text">💬</text>
          </view>
          <view class="service-info">
            <text class="service-label">在线客服</text>
            <text class="service-value">工作日 9:00-18:00</text>
          </view>
          <u-button type="info" size="small" @click="goToAI">咨询</u-button>
        </view>
        
        <view class="service-item">
          <view class="service-icon">
            <text class="icon-text">📧</text>
          </view>
          <view class="service-info">
            <text class="service-label">电子邮箱</text>
            <text class="service-value">service@example.com</text>
          </view>
          <u-button type="info" size="small" @click="sendEmail">发送</u-button>
        </view>
        
        <view class="service-item">
          <view class="service-icon">
            <text class="icon-text">📍</text>
          </view>
          <view class="service-info">
            <text class="service-label">线下地址</text>
            <text class="service-value">某某村庄游客中心</text>
          </view>
          <u-button type="info" size="small" @click="openLocation">导航</u-button>
        </view>
      </view>
    </view>
    
    <view class="faq-section">
      <text class="section-title">常见问题</text>
      <view class="faq-list">
        <view 
          v-for="(faq, index) in faqs" 
          :key="index"
          class="faq-item"
          @click="toggleFaq(index)"
        >
          <view class="faq-header">
            <text class="faq-question">{{ faq.question }}</text>
            <text class="faq-arrow" :class="{ 'rotated': faq.expanded }">▼</text>
          </view>
          <view class="faq-answer" v-if="faq.expanded">
            <text>{{ faq.answer }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <view class="feedback-section">
      <text class="section-title">意见反馈</text>
      <view class="feedback-form">
        <u-input 
          v-model="feedbackTitle" 
          placeholder="请输入反馈标题"
          class="feedback-input"
        />
        <u-input 
          v-model="feedbackContent" 
          placeholder="请详细描述您的问题或建议"
          type="textarea"
          rows="4"
          class="feedback-textarea"
        />
        <u-button type="primary" @click="submitFeedback">提交反馈</u-button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const feedbackTitle = ref('');
const feedbackContent = ref('');

const faqs = reactive([
  {
    question: '如何修改个人信息？',
    answer: '您可以在个人中心页面点击"编辑资料"按钮，修改您的个人信息，包括头像、昵称、性别等。',
    expanded: false
  },
  {
    question: '如何查看订单状态？',
    answer: '在个人中心页面的"我的订单"中，您可以查看所有订单的状态和详情。',
    expanded: false
  },
  {
    question: '如何申请退款？',
    answer: '对于符合退款条件的订单，您可以在订单详情页面点击"申请退款"按钮，按照提示操作即可。',
    expanded: false
  },
  {
    question: '如何参加村庄活动？',
    answer: '在首页的"活动公告"模块，您可以查看最新的村庄活动信息，并按照提示进行报名。',
    expanded: false
  },
  {
    question: '如何成为会员？',
    answer: '您可以在个人中心页面点击"会员中心"，按照提示完成会员注册和升级。',
    expanded: false
  }
]);

const toggleFaq = (index: number) => {
  faqs[index].expanded = !faqs[index].expanded;
};

const makePhoneCall = () => {
  uni.makePhoneCall({
    phoneNumber: '4001234567'
  });
};

const goToAI = () => {
  uni.navigateTo({
    url: '/pages/ai/service'
  });
};

const sendEmail = () => {
  uni.setClipboardData({
    data: 'service@example.com',
    success: () => {
      uni.showToast({ title: '邮箱已复制', icon: 'success' });
    }
  });
};

const openLocation = () => {
  uni.openLocation({
    latitude: 39.9042,
    longitude: 116.4074,
    name: '某某村庄游客中心',
    address: '某某省某某市某某县某某村庄'
  });
};

const submitFeedback = () => {
  if (!feedbackTitle.value.trim() || !feedbackContent.value.trim()) {
    uni.showToast({ title: '请填写完整的反馈信息', icon: 'none' });
    return;
  }
  
  // 模拟提交反馈
  uni.showLoading({ title: '提交中...' });
  setTimeout(() => {
    uni.hideLoading();
    uni.showToast({ title: '反馈提交成功', icon: 'success' });
    feedbackTitle.value = '';
    feedbackContent.value = '';
  }, 1000);
};
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  margin-bottom: 30rpx;
  
  .title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    display: block;
  }
}

.service-section {
  background-color: #fff;
  border-radius: 8rpx;
  padding: 20rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  
  .section-title {
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }
  
  .service-list {
    
    .service-item {
      display: flex;
      align-items: center;
      padding: 15rpx 0;
      border-bottom: 1rpx solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .service-icon {
        width: 60rpx;
        height: 60rpx;
        border-radius: 50%;
        background-color: #f0f0f0;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 20rpx;
        
        .icon-text {
          font-size: 32rpx;
        }
      }
      
      .service-info {
        flex: 1;
        
        .service-label {
          font-size: 24rpx;
          color: #333;
          display: block;
          margin-bottom: 5rpx;
        }
        
        .service-value {
          font-size: 22rpx;
          color: #666;
        }
      }
      
      u-button {
        margin-left: 15rpx;
      }
    }
  }
}

.faq-section {
  background-color: #fff;
  border-radius: 8rpx;
  padding: 20rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  
  .section-title {
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }
  
  .faq-list {
    
    .faq-item {
      border-bottom: 1rpx solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .faq-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15rpx 0;
        
        .faq-question {
          font-size: 24rpx;
          color: #333;
          flex: 1;
        }
        
        .faq-arrow {
          font-size: 20rpx;
          color: #999;
          transition: transform 0.3s ease;
          
          &.rotated {
            transform: rotate(180deg);
          }
        }
      }
      
      .faq-answer {
        padding: 0 0 15rpx 0;
        
        text {
          font-size: 22rpx;
          color: #666;
          line-height: 1.5;
        }
      }
    }
  }
}

.feedback-section {
  background-color: #fff;
  border-radius: 8rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  
  .section-title {
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }
  
  .feedback-form {
    display: flex;
    flex-direction: column;
    gap: 15rpx;
    
    .feedback-input {
      border-radius: 8rpx;
      background-color: #f5f5f5;
    }
    
    .feedback-textarea {
      border-radius: 8rpx;
      background-color: #f5f5f5;
      min-height: 200rpx;
    }
  }
}
</style>
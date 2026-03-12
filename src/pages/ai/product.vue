<template>
  <view class="container">
    <view class="header">
      <text class="title">农产品咨询</text>
      <text class="subtitle">获取专业的农产品种植、销售建议</text>
    </view>
    
    <view class="search-section">
      <view class="search-bar">
        <u-input 
          v-model="searchKeyword" 
          placeholder="输入农产品名称，如：苹果、水稻"
          prefix-icon="search"
          @confirm="searchProducts"
        />
        <u-button type="primary" @click="searchProducts">查询</u-button>
      </view>
    </view>
    
    <view class="category-section">
      <text class="section-title">热门品类</text>
      <view class="category-list">
        <view 
          v-for="category in categories" 
          :key="category.id"
          class="category-item"
          @click="selectCategory(category.name)"
        >
          <view class="category-icon">{{ category.icon }}</view>
          <text class="category-name">{{ category.name }}</text>
        </view>
      </view>
    </view>
    
    <view class="consultation-section" v-if="selectedProduct">
      <view class="product-info">
        <image :src="selectedProduct.image" mode="aspectFill" class="product-image"></image>
        <view class="product-details">
          <text class="product-name">{{ selectedProduct.name }}</text>
          <text class="product-desc">{{ selectedProduct.description }}</text>
        </view>
      </view>
      
      <view class="consultation-content">
        <text class="content-title">种植建议</text>
        <view class="content-item" v-for="(item, index) in selectedProduct.plantingAdvice" :key="index">
          <text class="content-bullet">•</text>
          <text class="content-text">{{ item }}</text>
        </view>
        
        <text class="content-title">市场分析</text>
        <view class="content-item" v-for="(item, index) in selectedProduct.marketAnalysis" :key="index">
          <text class="content-bullet">•</text>
          <text class="content-text">{{ item }}</text>
        </view>
        
        <text class="content-title">销售建议</text>
        <view class="content-item" v-for="(item, index) in selectedProduct.salesAdvice" :key="index">
          <text class="content-bullet">•</text>
          <text class="content-text">{{ item }}</text>
        </view>
      </view>
      
      <view class="action-buttons">
        <u-button type="primary" @click="askExpert">咨询专家</u-button>
        <u-button type="info" @click="saveConsultation">保存咨询</u-button>
      </view>
    </view>
    
    <view class="history-section" v-if="consultationHistory.length > 0">
      <text class="section-title">咨询历史</text>
      <view class="history-list">
        <view 
          v-for="history in consultationHistory" 
          :key="history.id"
          class="history-item"
          @click="loadHistory(history)"
        >
          <text class="history-product">{{ history.productName }}</text>
          <text class="history-time">{{ history.timestamp }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const searchKeyword = ref('');
const selectedProduct = ref<any>(null);

const categories = [
  { id: 1, name: '水果', icon: '🍎' },
  { id: 2, name: '蔬菜', icon: '🥬' },
  { id: 3, name: '谷物', icon: '🌾' },
  { id: 4, name: '经济作物', icon: '🌿' },
  { id: 5, name: '畜牧产品', icon: '🐄' },
  { id: 6, name: '水产品', icon: '🐟' }
];

const consultationHistory = [
  { id: 1, productName: '苹果', timestamp: '2024-01-15 10:30' },
  { id: 2, productName: '水稻', timestamp: '2024-01-14 16:45' }
];

const mockProducts = [
  {
    id: 1,
    name: '红富士苹果',
    image: 'https://img.yzcdn.cn/vant/apple-1.jpg',
    description: '优质红富士苹果，个大皮薄，汁多味甜',
    plantingAdvice: [
      '适宜在海拔800-1200米的山区种植',
      '喜欢充足的阳光和排水良好的土壤',
      '春季萌芽前施肥，秋季果实采摘后施基肥',
      '定期修剪枝条，保持树冠通风透光'
    ],
    marketAnalysis: [
      '市场需求量大，价格稳定',
      '高端市场对品质要求高，利润空间大',
      '季节性明显，秋季集中上市',
      '可发展观光采摘，增加附加价值'
    ],
    salesAdvice: [
      '建立品牌，提高产品知名度',
      '发展电商渠道，扩大销售范围',
      '分级包装，满足不同消费需求',
      '与超市、水果店建立长期合作关系'
    ]
  },
  {
    id: 2,
    name: '有机水稻',
    image: 'https://img.yzcdn.cn/vant/rice-1.jpg',
    description: '绿色有机水稻，无污染，口感香糯',
    plantingAdvice: [
      '选择肥沃的稻田，保证水源充足',
      '使用有机肥料，避免化学农药',
      '合理密植，加强田间管理',
      '注意病虫害的生物防治'
    ],
    marketAnalysis: [
      '有机食品市场增长迅速',
      '价格是普通大米的2-3倍',
      '消费者对食品安全关注度高',
      '可申请有机认证，提高产品价值'
    ],
    salesAdvice: [
      '建立溯源体系，增强消费者信任',
      '发展会员制，稳定客户群体',
      '与高端餐饮企业合作',
      '开发大米衍生品，如米糕、米酒等'
    ]
  }
];

const searchProducts = () => {
  // 模拟搜索功能
  const product = mockProducts.find(p => p.name.includes(searchKeyword.value));
  if (product) {
    selectedProduct.value = product;
  } else {
    uni.showToast({ title: '未找到相关农产品', icon: 'none' });
  }
};

const selectCategory = (categoryName: string) => {
  // 模拟按品类查询
  searchKeyword.value = categoryName;
  searchProducts();
};

const askExpert = () => {
  uni.showModal({
    title: '咨询专家',
    content: '我们将为您联系相关领域的专家，预计24小时内回复',
    confirmText: '确定',
    cancelText: '取消'
  });
};

const saveConsultation = () => {
  if (selectedProduct.value) {
    consultationHistory.unshift({
      id: Date.now(),
      productName: selectedProduct.value.name,
      timestamp: new Date().toLocaleString()
    });
    uni.showToast({ title: '咨询已保存', icon: 'success' });
  }
};

const loadHistory = (history: any) => {
  // 模拟加载历史咨询
  const product = mockProducts.find(p => p.name.includes(history.productName));
  if (product) {
    selectedProduct.value = product;
  }
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
  text-align: center;
  
  .title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    display: block;
    margin-bottom: 10rpx;
  }
  
  .subtitle {
    font-size: 24rpx;
    color: #666;
  }
}

.search-section {
  margin-bottom: 30rpx;
  
  .search-bar {
    display: flex;
    gap: 10rpx;
    
    u-input {
      flex: 1;
      border-radius: 8rpx;
      background-color: #fff;
    }
    
    u-button {
      width: 120rpx;
    }
  }
}

.category-section {
  margin-bottom: 30rpx;
  
  .section-title {
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 15rpx;
  }
  
  .category-list {
    display: flex;
    flex-wrap: wrap;
    gap: 15rpx;
    
    .category-item {
      width: calc(33.333% - 10rpx);
      background-color: #fff;
      border-radius: 8rpx;
      padding: 20rpx;
      text-align: center;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
      
      .category-icon {
        font-size: 48rpx;
        margin-bottom: 10rpx;
      }
      
      .category-name {
        font-size: 24rpx;
        color: #333;
      }
    }
  }
}

.consultation-section {
  background-color: #fff;
  border-radius: 8rpx;
  padding: 20rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  
  .product-info {
    display: flex;
    gap: 20rpx;
    margin-bottom: 20rpx;
    
    .product-image {
      width: 120rpx;
      height: 120rpx;
      border-radius: 8rpx;
    }
    
    .product-details {
      flex: 1;
      
      .product-name {
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 10rpx;
        display: block;
      }
      
      .product-desc {
        font-size: 22rpx;
        color: #666;
      }
    }
  }
  
  .consultation-content {
    margin-bottom: 20rpx;
    
    .content-title {
      font-size: 26rpx;
      font-weight: bold;
      color: #333;
      margin: 15rpx 0 10rpx;
      display: block;
    }
    
    .content-item {
      display: flex;
      margin-bottom: 8rpx;
      
      .content-bullet {
        color: #4caf50;
        margin-right: 10rpx;
        font-size: 24rpx;
      }
      
      .content-text {
        flex: 1;
        font-size: 22rpx;
        color: #666;
        line-height: 1.5;
      }
    }
  }
  
  .action-buttons {
    display: flex;
    gap: 15rpx;
    
    u-button {
      flex: 1;
    }
  }
}

.history-section {
  background-color: #fff;
  border-radius: 8rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  
  .section-title {
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 15rpx;
  }
  
  .history-list {
    
    .history-item {
      padding: 15rpx 0;
      border-bottom: 1rpx solid #f0f0f0;
      display: flex;
      justify-content: space-between;
      
      &:last-child {
        border-bottom: none;
      }
      
      .history-product {
        font-size: 24rpx;
        color: #333;
      }
      
      .history-time {
        font-size: 20rpx;
        color: #999;
      }
    }
  }
}
</style>
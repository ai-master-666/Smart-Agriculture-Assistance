# 快速启动指南

## 🚀 5 分钟开始开发

### 前置要求
- Node.js 16+ 
- npm 或 yarn
- 微信开发者工具（已安装）

### 步骤 1: 安装依赖

**Windows (PowerShell)**:
```powershell
cd d:\智慧助农\miniprogram
.\install.ps1
```

**macOS / Linux**:
```bash
cd /path/to/智慧助农/miniprogram
chmod +x install.sh
./install.sh
```

**或手动安装**:
```bash
cd miniprogram
npm install
```

### 步骤 2: 启动开发服务器

```bash
npm run dev:mp-weixin
```

等待编译完成后，会输出：
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5174/
```

### 步骤 3: 在微信开发者工具中导入

1. **打开微信开发者工具**
2. **点击"导入项目"**
3. **项目路径选择**:
   ```
   d:\智慧助农\miniprogram\dist\dev\mp-weixin
   ```
4. **AppID 选择**:
   - 有 AppID：填写你的小程序 AppID
   - 无 AppID：选择"测试号"

### 步骤 4: 配置后端地址

编辑 `src/utils/request.ts`:

```typescript
// 开发环境
const BASE_URL = 'http://localhost:8000/api/v1'

// 生产环境（上线前修改）
// const BASE_URL = 'https://your-domain.com/api/v1'
```

### 步骤 5: 测试功能

1. **登录功能**:
   - 打开登录页
   - 输入用户名和密码
   - 点击登录

2. **查看商品**:
   - 切换到"商城"Tab
   - 浏览商品列表

3. **个人中心**:
   - 切换到"我的"Tab
   - 查看用户信息

## 📝 常用命令

```bash
# 开发模式（实时编译）
npm run dev:mp-weixin

# 生产构建
npm run build:mp-weixin

# 清理缓存
npm run clean
```

## 🔧 常见问题

### Q1: 编译失败
**解决**: 删除 `node_modules` 和 `dist`，重新安装
```bash
rm -rf node_modules dist
npm install
```

### Q2: 请求报错 "不在合法域名列表中"
**解决**: 
- 开发阶段：在微信开发者工具勾选"不校验合法域名"
- 生产环境：在小程管理后台配置域名

### Q3: uView Plus 组件不显示
**解决**: 确保 `main.ts` 已引入并注册
```typescript
import uviewPlus from 'uview-plus'
app.use(uviewPlus)
```

### Q4: 样式不生效
**解决**: 检查是否使用 `<style lang="scss" scoped>`

## 📚 目录说明

```
miniprogram/
├── src/
│   ├── pages/          # 所有页面文件
│   ├── api/           # API 接口定义
│   ├── utils/         # 工具函数
│   ├── components/    # 公共组件
│   ├── static/        # 静态资源
│   ├── App.vue       # 应用入口
│   ├── main.ts       # 入口文件
│   └── pages.json    # 路由配置
├── dist/             # 编译输出目录（重要！）
├── package.json      # 依赖配置
└── README.md         # 项目文档
```

## 🎯 下一步

1. **熟悉代码结构**
   - 查看 `src/pages/user/login.vue` 了解页面开发规范
   - 查看 `src/utils/request.ts` 了解 API 调用方式

2. **开始开发新功能**
   - 参考已有页面模板
   - 在 `pages.json` 添加路由
   - 创建对应的 `.vue` 文件

3. **调试技巧**
   - 使用微信开发者工具的调试器
   - 使用 `console.log()` 输出日志
   - 使用 Network 面板查看请求

## 📞 技术支持

遇到问题可以：
- 查看 uni-app 官方文档：https://uniapp.dcloud.net.cn/
- 查看 uView Plus 文档：https://uiadmin.net/uview-plus/
- 检查微信小程序官方文档：https://developers.weixin.qq.com/miniprogram/dev/framework/

---

**提示**: 建议先运行起来，看到效果后再开始修改代码！

# 生物竞赛答案对比平台

一个基于Vue 3的生物竞赛题目答案生成对比平台，允许用户输入题目后，同时调用四个不同的AI API生成答案并并排显示，方便对比选择。

## 功能特性

### 🎯 核心功能
- **多AI对比**：同时调用豆包、DeepSeek、通义千问和ChatGPT四个AI API
- **实时生成**：所有API同时请求，生成结果实时更新
- **历史记录**：自动保存查询历史，支持搜索和快速回查
- **本地存储**：API密钥和历史记录安全存储在浏览器本地
- **响应式设计**：适配不同屏幕尺寸的设备

### 📦 技术栈
- **前端框架**：Vue 3 + Composition API
- **构建工具**：Vite
- **状态管理**：Pinia
- **HTTP客户端**：Axios
- **样式框架**：Tailwind CSS
- **部署平台**：GitHub Pages
- **CI/CD**：GitHub Actions

## 快速开始

### 环境要求
- Node.js 18.x 或更高版本
- npm 或 yarn

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/your-username/guessanimals.git
cd guessanimals/answer
```

2. **安装依赖**
```bash
npm install
```

3. **启动开发服务器**
```bash
npm run dev
```

4. **构建生产版本**
```bash
npm run build
```

5. **预览生产版本**
```bash
npm run preview
```

## 使用说明

### 基本操作

1. **输入题目**：在左侧输入框中输入生物竞赛题目
2. **生成答案**：点击"生成答案"按钮，或使用快捷键 `Ctrl+Enter`
3. **对比答案**：右侧将并排显示四个AI的答案结果
4. **复制答案**：点击每个答案卡片底部的"复制"按钮
5. **重新生成**：如果某个AI的答案不满意，可以单独点击"重试"

### API配置

1. 点击页面右上角的"API配置"按钮
2. 输入各个AI服务的API密钥
3. 点击"保存配置"按钮
4. API密钥将安全存储在浏览器的本地存储中

### 历史记录

1. 点击页面右上角的"历史记录"按钮
2. 查看所有历史查询记录
3. 使用搜索框快速查找特定记录
4. 点击"查看"按钮重新加载历史查询
5. 点击"删除"按钮移除不需要的记录

## API集成指南

### 支持的AI服务

1. **豆包API**
   - 文档：https://open.volcengine.com/docs/api-home/AI-Model-Apilot/API-Reference/api/chat-3.0/v1/chat-3.0/v1/chat
   - 申请地址：https://www.doubao.com/

2. **DeepSeek API**
   - 文档：https://platform.deepseek.com/api-docs/zh-cn/chat
   - 申请地址：https://platform.deepseek.com/

3. **通义千问API**
   - 文档：https://help.aliyun.com/document_detail/2710737.html
   - 申请地址：https://www.aliyun.com/product/dashscope

4. **ChatGPT API**
   - 文档：https://platform.openai.com/docs/api-reference/chat
   - 申请地址：https://platform.openai.com/

### 配置说明

每个API需要单独配置API密钥，格式如下：

| AI服务 | 配置名称 | 说明 |
|--------|----------|------|
| 豆包 | doubaoApiKey | 豆包API的密钥 |
| DeepSeek | deepseekApiKey | DeepSeek API的密钥 |
| 通义千问 | tongyiApiKey | 通义千问API的密钥 |
| ChatGPT | chatgptApiKey | ChatGPT API的密钥 |

### 替换真实API调用

当前项目中使用的是模拟API调用，要替换为真实API调用，请修改 `src/stores/answerStore.js` 文件中的以下方法：

- `callDoubaoApi()`
- `callDeepSeekApi()`
- `callTongyiApi()`
- `callChatgptApi()`

每个方法需要根据对应API的文档进行实现，确保正确的请求格式和响应处理。

## 项目结构

```
├── src/
│   ├── components/         # Vue组件
│   │   ├── AnswerCard.vue      # 单个答案卡片组件
│   │   ├── AnswerDisplay.vue   # 答案展示组件
│   │   ├── ApiConfig.vue       # API配置组件
│   │   ├── HistoryPanel.vue    # 历史记录组件
│   │   └── QuestionInput.vue   # 题目输入组件
│   ├── stores/            # Pinia状态管理
│   │   ├── answerStore.js      # 答案状态管理
│   │   ├── apiConfigStore.js   # API配置管理
│   │   └── historyStore.js     # 历史记录管理
│   ├── App.vue            # 主应用组件
│   ├── main.js            # 应用入口
│   └── style.css          # 全局样式
├── .github/              # GitHub配置
│   └── workflows/          # GitHub Actions工作流
│       └── deploy.yml       # 自动部署配置
├── .gitignore            # Git忽略文件
├── index.html            # HTML入口
├── package.json          # 项目依赖
├── postcss.config.js     # PostCSS配置
├── tailwind.config.js    # Tailwind CSS配置
├── vite.config.js        # Vite配置
└── README.md             # 项目说明文档
```

## 部署说明

### GitHub Pages部署

1. **配置项目**
   - 确保 `vite.config.js` 中的 `base` 配置正确：
     ```javascript
     base: '/guessanimals/answer/'
     ```

2. **启用GitHub Pages**
   - 进入GitHub仓库 -> Settings -> Pages
   - 在"Branch"下拉菜单中选择：`gh-pages`，然后点击"Save"

3. **自动部署**
   - 项目已配置GitHub Actions工作流，位于 `.github/workflows/deploy.yml`
   - 当推送到 `master` 分支时，将自动触发构建和部署流程
   - 部署成功后，可在 `https://your-username.github.io/guessanimals/answer/` 访问

### 手动部署

```bash
# 构建生产版本
npm run build

# 部署到GitHub Pages
npm run deploy
```

## 安全注意事项

1. **API密钥安全**
   - API密钥仅存储在浏览器本地存储中，不会上传到任何服务器
   - 建议定期更新API密钥，特别是在更换设备或浏览器时

2. **数据隐私**
   - 所有数据处理都在客户端完成，不涉及服务器存储
   - 历史记录仅保存在本地，可随时删除

3. **网络安全**
   - 使用HTTPS协议保护API请求
   - 实现了API调用超时和错误处理机制

## 浏览器兼容性

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 更新日志

### v1.0.0 (2024-01-15)
- 初始版本发布
- 实现基本功能：题目输入、多AI对比、历史记录
- 支持四个AI服务集成
- 响应式设计和用户友好的界面

## 贡献指南

欢迎贡献代码或提出建议！

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

如有问题或建议，请通过以下方式联系：

- GitHub Issues: https://github.com/your-username/guessanimals/issues
- Email: your-email@example.com

---

**免责声明**：本项目仅供学习和参考使用，请勿用于商业用途。API调用可能会产生费用，请根据各AI服务的定价策略自行承担相关费用。
# 简化版API代理服务部署指南

这个简化版API代理服务专为GitHub Pages部署设计，可以在Vercel或Netlify等平台上轻松部署。

## 快速部署到Vercel（推荐）

1. **创建新仓库**
   - 将`api-proxy-simple`文件夹内容推送到一个新的GitHub仓库

2. **部署到Vercel**
   - 访问 [Vercel](https://vercel.com)
   - 点击"New Project"并连接你的GitHub仓库
   - Vercel会自动检测到Node.js项目

3. **配置环境变量**
   - 在Vercel项目设置中，添加环境变量：
     - `DEEPSEEK_API_KEY`: 你的DeepSeek API密钥

4. **部署完成**
   - Vercel会自动部署你的API代理服务
   - 部署完成后，你会得到一个URL，例如：`https://your-proxy.vercel.app`

## 配置前端应用

1. **设置GitHub Secrets**
   - 在你的主项目GitHub仓库中，进入`Settings` > `Secrets and variables` > `Actions`
   - 添加以下Repository secrets：
     - `API_PROXY_URL`: 你的API代理服务URL（例如：`https://your-proxy.vercel.app`）

2. **更新环境变量**
   - 确保`.env.production`文件中的配置正确：
     ```
     VITE_API_PROXY_URL=https://your-proxy.vercel.app
     ```

## 测试API代理服务

部署完成后，可以通过以下方式测试API代理服务：

```bash
curl -X POST https://your-proxy.vercel.app/api/deepseek \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-chat",
    "messages": [
      {"role": "user", "content": "Hello, world!"}
    ]
  }'
```

## 部署到Netlify

如果你更喜欢使用Netlify：

1. **创建新仓库**
   - 将`api-proxy-simple`文件夹内容推送到一个新的GitHub仓库

2. **创建Netlify函数**
   - 在仓库根目录创建`netlify/functions`目录
   - 将`server.js`重命名为`netlify/functions/api.js`

3. **修改API文件**
   - 在`netlify/functions/api.js`顶部添加：
     ```javascript
     const serverless = require('serverless-http');
     const app = require('./server');
     module.exports.handler = serverless(app);
     ```

4. **部署到Netlify**
   - 连接GitHub仓库到Netlify
   - 在Netlify设置中添加环境变量：`DEEPSEEK_API_KEY`

## 注意事项

1. **API密钥安全**
   - 不要在前端代码中暴露DeepSeek API密钥
   - 始终通过环境变量在服务器端设置API密钥

2. **速率限制**
   - DeepSeek API有速率限制，请合理使用
   - 考虑在代理服务中添加缓存机制

3. **错误处理**
   - 代理服务已包含基本错误处理
   - 可以根据需要扩展错误处理逻辑

## 更新部署

每次更新代码后，只需推送到GitHub，Vercel/Netlify会自动重新部署。
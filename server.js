// 简化版API代理服务 - 专为GitHub Pages部署设计
// 可以在Vercel或Netlify等平台上部署

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// DeepSeek API代理端点
app.post('/api/deepseek', async (req, res) => {
  try {
    const { model, messages, temperature, max_tokens, stream } = req.body;
    
    // 获取环境变量中的DeepSeek API密钥
    const deepseekApiKey = process.env.DEEPSEEK_API_KEY;
    if (!deepseekApiKey) {
      return res.status(500).json({ error: '服务器配置错误：DeepSeek API密钥未设置' });
    }
    
    // 构建DeepSeek API请求
    const deepseekRequest = {
      model: model || 'deepseek-chat',
      messages: messages || [],
      temperature: temperature || 0.7,
      max_tokens: max_tokens || 1500,
      stream: stream || false
    };
    
    // 调用DeepSeek API
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${deepseekApiKey}`
      },
      body: JSON.stringify(deepseekRequest)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }
    
    // 如果是流式响应，直接转发
    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      response.body.on('data', (chunk) => {
        res.write(chunk);
      });
      
      response.body.on('end', () => {
        res.end();
      });
    } else {
      // 非流式响应，直接返回JSON
      const data = await response.json();
      res.json(data);
    }
  } catch (error) {
    console.error('API代理错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 导出Express应用（用于Vercel等平台）
module.exports = app;

// 本地运行时启动服务器
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`API代理服务器运行在端口 ${PORT}`);
  });
}
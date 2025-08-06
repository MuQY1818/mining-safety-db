// API配置文件
export const API_CONFIG = {
  // Apifox服务地址
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://mock.apifox.cn/m1/your-project-id',
  
  // 是否使用Mock数据
  USE_MOCK: process.env.REACT_APP_USE_MOCK === 'true',
  
  // 请求超时时间
  TIMEOUT: 10000,
  
  // API版本
  VERSION: 'v1'
};

// 硅基流动AI配置
export const SILICONFLOW_CONFIG = {
  // API基础配置
  baseURL: 'https://api.siliconflow.cn/v1',
  apiKey: process.env.REACT_APP_SILICONFLOW_API_KEY,
  
  // 推荐模型配置
  models: {
    chat: 'deepseek-chat',           // 主要对话模型
    reasoning: 'deepseek-reasoner',  // 推理模型
    coding: 'deepseek-coder',        // 代码相关
    fallback: 'Qwen/Qwen2.5-7B-Instruct' // 备用模型
  },
  
  // 请求配置
  defaultParams: {
    max_tokens: 2000,
    temperature: 0.7,
    top_p: 0.9,
    stream: true,
    presence_penalty: 0,
    frequency_penalty: 0
  },
  
  // 系统提示词
  systemPrompt: `你是矿区语言安全数据库的专业AI助手，专门回答矿区安全相关问题。

你的专业领域包括：
1. 煤矿安全：瓦斯检测、通风系统、防爆措施等
2. 金属矿安全：有毒气体防护、地压管理、设备安全等  
3. 非金属矿安全：粉尘控制、机械安全、作业规范等
4. 露天矿安全：边坡稳定、爆破安全、运输安全等
5. 矿区应急：事故预防、应急预案、救援措施等

回答要求：
- 基于权威的矿区安全标准和规范
- 提供具体、可操作的安全建议
- 必要时引用相关的安全标准编号
- 如果涉及紧急情况，优先提供应急处理方法
- 对于超出矿区安全范围的问题，礼貌引导到相关话题

请用专业、准确、易懂的语言回答用户问题。`
};

// 应用配置
export const APP_CONFIG = {
  name: process.env.REACT_APP_APP_NAME || '矿区语言安全数据库',
  version: process.env.REACT_APP_VERSION || '1.0.0',
  theme: process.env.REACT_APP_SAFETY_THEME || 'mining',
  
  // 功能开关
  features: {
    aiChat: process.env.REACT_APP_ENABLE_AI_CHAT === 'true',
    feedback: process.env.REACT_APP_ENABLE_FEEDBACK === 'true',
    aiStream: process.env.REACT_APP_AI_STREAM_ENABLED === 'true'
  }
};

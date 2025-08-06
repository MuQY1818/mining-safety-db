// 硅基流动AI服务
import { SILICONFLOW_CONFIG } from '../config/api';
import { ChatMessage } from '../types/ai';

export class SiliconFlowService {
  private apiKey: string;
  private baseURL: string;

  constructor() {
    this.apiKey = SILICONFLOW_CONFIG.apiKey!;
    this.baseURL = SILICONFLOW_CONFIG.baseURL;
    
    if (!this.apiKey) {
      console.warn('硅基流动API Key未配置，AI功能将不可用');
    }
  }

  /**
   * 流式聊天
   */
  async *chatStream(
    messages: ChatMessage[],
    model: string = SILICONFLOW_CONFIG.models.chat
  ): AsyncGenerator<string, void, unknown> {
    if (!this.apiKey) {
      throw new Error('硅基流动API Key未配置');
    }

    const response = await this.makeRequest(messages, model, true);
    
    if (!response.body) {
      throw new Error('响应体为空');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            
            if (data === '[DONE]') {
              return;
            }
            
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              
              if (content) {
                yield content;
              }
            } catch (e) {
              // 忽略解析错误，继续处理下一行
              console.warn('解析流式数据失败:', e);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * 非流式聊天
   */
  async chat(
    messages: ChatMessage[],
    model: string = SILICONFLOW_CONFIG.models.chat
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('硅基流动API Key未配置');
    }

    const response = await this.makeRequest(messages, model, false);
    const data = await response.json();
    
    if (data.error) {
      throw new Error(`硅基流动API错误: ${data.error.message}`);
    }
    
    return data.choices[0].message.content;
  }

  /**
   * 发起API请求
   */
  private async makeRequest(
    messages: ChatMessage[],
    model: string,
    stream: boolean
  ): Promise<Response> {
    const requestBody = {
      model,
      messages: [
        {
          role: 'system' as const,
          content: SILICONFLOW_CONFIG.systemPrompt
        },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ],
      ...SILICONFLOW_CONFIG.defaultParams,
      stream
    };

    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `硅基流动API请求失败: ${response.status} ${response.statusText}
        ${errorData.error?.message || ''}`
      );
    }

    return response;
  }

  /**
   * 检查API连接状态
   */
  async checkConnection(): Promise<boolean> {
    if (!this.apiKey) {
      return false;
    }

    try {
      const testMessages: ChatMessage[] = [
        { 
          id: 'test',
          sessionId: 'test',
          role: 'user', 
          content: '你好',
          timestamp: new Date()
        }
      ];
      
      await this.chat(testMessages);
      return true;
    } catch (error) {
      console.error('硅基流动API连接检查失败:', error);
      return false;
    }
  }

  /**
   * 获取可用模型列表
   */
  async getModels(): Promise<string[]> {
    if (!this.apiKey) {
      return Object.values(SILICONFLOW_CONFIG.models);
    }

    try {
      const response = await fetch(`${this.baseURL}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      
      const data = await response.json();
      return data.data.map((model: any) => model.id);
    } catch (error) {
      console.error('获取模型列表失败:', error);
      return Object.values(SILICONFLOW_CONFIG.models);
    }
  }
}

// 导出单例实例
export const siliconFlowService = new SiliconFlowService();

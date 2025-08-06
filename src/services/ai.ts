// AI和反馈API服务
import { apiClient, handleApiResponse, handleApiError } from './apiClient';
import { siliconFlowService } from './siliconflow';
import { 
  ChatMessage, 
  ChatSession, 
  UserFeedback, 
  FeedbackForm, 
  FeedbackQuery, 
  FeedbackStats 
} from '../types/ai';

// AI问答API
export const aiApi = {
  // 流式聊天
  chatStream: async function* (messages: ChatMessage[], sessionId: string): AsyncGenerator<string, void, unknown> {
    try {
      // 使用硅基流动服务进行流式对话
      const stream = siliconFlowService.chatStream(messages);
      
      for await (const chunk of stream) {
        yield chunk;
      }
    } catch (error) {
      console.error('AI流式对话失败:', error);
      throw error;
    }
  },

  // 非流式聊天
  chat: async (messages: ChatMessage[], sessionId: string): Promise<string> => {
    try {
      return await siliconFlowService.chat(messages);
    } catch (error) {
      console.error('AI对话失败:', error);
      return handleApiError(error);
    }
  },

  // 保存会话到后端
  saveSession: async (sessionId: string, messages: ChatMessage[]): Promise<void> => {
    try {
      await apiClient.post('/ai/sessions', { sessionId, messages });
    } catch (error) {
      return handleApiError(error);
    }
  },

  // 获取用户会话列表
  getSessions: async (userId: number): Promise<ChatSession[]> => {
    try {
      const response = await apiClient.get(`/ai/sessions?userId=${userId}`);
      return handleApiResponse<ChatSession[]>(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // 获取会话详情
  getSession: async (sessionId: string): Promise<ChatSession> => {
    try {
      const response = await apiClient.get(`/ai/sessions/${sessionId}`);
      return handleApiResponse<ChatSession>(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // 删除会话
  deleteSession: async (sessionId: string): Promise<void> => {
    try {
      await apiClient.delete(`/ai/sessions/${sessionId}`);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // 检查AI服务状态
  checkStatus: async (): Promise<boolean> => {
    return await siliconFlowService.checkConnection();
  }
};

// 用户建议反馈API
export const feedbackApi = {
  // 提交建议
  submit: async (feedback: FeedbackForm): Promise<UserFeedback> => {
    try {
      const formData = new FormData();
      formData.append('type', feedback.type);
      formData.append('title', feedback.title);
      formData.append('content', feedback.content);
      formData.append('priority', feedback.priority);
      
      // 添加附件
      if (feedback.attachments) {
        feedback.attachments.forEach((file, index) => {
          formData.append(`attachment_${index}`, file);
        });
      }
      
      const response = await apiClient.post('/feedback', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      return handleApiResponse<UserFeedback>(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // 获取建议列表
  getList: async (params: FeedbackQuery): Promise<{
    items: UserFeedback[];
    total: number;
    page: number;
    pageSize: number;
  }> => {
    try {
      const response = await apiClient.get('/feedback', { params });
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // 获取单个建议详情
  getItem: async (id: number): Promise<UserFeedback> => {
    try {
      const response = await apiClient.get(`/feedback/${id}`);
      return handleApiResponse<UserFeedback>(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // 更新建议状态（管理员）
  updateStatus: async (id: number, status: string, reply?: string): Promise<UserFeedback> => {
    try {
      const response = await apiClient.put(`/feedback/${id}`, { 
        status, 
        adminReply: reply 
      });
      return handleApiResponse<UserFeedback>(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // 删除建议
  delete: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/feedback/${id}`);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // 获取建议统计
  getStats: async (): Promise<FeedbackStats> => {
    try {
      const response = await apiClient.get('/feedback/stats');
      return handleApiResponse<FeedbackStats>(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // 批量处理建议
  batchUpdate: async (ids: number[], status: string): Promise<void> => {
    try {
      await apiClient.post('/feedback/batch-update', { ids, status });
    } catch (error) {
      return handleApiError(error);
    }
  }
};

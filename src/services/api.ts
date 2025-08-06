// API服务层 - 统一管理所有API调用
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { SafetyData, SafetyLevel, MineType, SafetyCategory } from '../types/safety';

// API响应基础接口
interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

// 分页响应接口
interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// 错误响应接口
interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

// 查询参数接口
interface SafetyDataQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  safetyLevel?: SafetyLevel;
  mineType?: MineType;
  category?: SafetyCategory;
  sortBy?: 'publishDate' | 'viewCount' | 'title';
  sortOrder?: 'asc' | 'desc';
}

// 统计数据接口
interface DashboardStats {
  totalItems: number;
  safetyLevelCounts: Record<SafetyLevel, number>;
  mineTypeCounts: Record<MineType, number>;
  categoryCounts: Record<SafetyCategory, number>;
  recentActivity: {
    newItemsThisWeek: number;
    totalDownloadsThisMonth: number;
    mostViewedItems: string[];
  };
}

// 文件上传响应接口
interface UploadResponse {
  fileId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  url: string;
  thumbnailUrl?: string;
}

class ApiService {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api/v1';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Client-Version': '1.0.0'
      }
    });

    this.setupInterceptors();
  }

  // 设置请求和响应拦截器
  private setupInterceptors() {
    // 请求拦截器 - 添加认证token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器 - 统一处理错误
    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Token过期，清除本地存储并跳转到登录页
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // 安全资料相关API
  async getSafetyData(query?: SafetyDataQuery): Promise<PaginatedResponse<SafetyData>> {
    const response = await this.client.get<ApiResponse<PaginatedResponse<SafetyData>>>(
      '/safety-data',
      { params: query }
    );
    return response.data.data;
  }

  async getSafetyDataById(id: string): Promise<SafetyData> {
    const response = await this.client.get<ApiResponse<SafetyData>>(`/safety-data/${id}`);
    return response.data.data;
  }

  async createSafetyData(data: Omit<SafetyData, 'id'>): Promise<SafetyData> {
    const response = await this.client.post<ApiResponse<SafetyData>>('/safety-data', data);
    return response.data.data;
  }

  async updateSafetyData(id: string, data: Partial<SafetyData>): Promise<SafetyData> {
    const response = await this.client.put<ApiResponse<SafetyData>>(`/safety-data/${id}`, data);
    return response.data.data;
  }

  async deleteSafetyData(id: string): Promise<void> {
    await this.client.delete(`/safety-data/${id}`);
  }

  async batchOperateSafetyData(action: 'delete' | 'update', ids: string[], data?: any): Promise<void> {
    await this.client.post('/safety-data/batch', { action, ids, data });
  }

  // 文件上传API
  async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.client.post<ApiResponse<UploadResponse>>(
      '/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data.data;
  }

  // 统计数据API
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await this.client.get<ApiResponse<DashboardStats>>('/statistics/dashboard');
    return response.data.data;
  }

  // AI问答API
  async sendChatMessage(message: string, sessionId?: string, context?: any): Promise<any> {
    const response = await this.client.post<ApiResponse<any>>('/ai/chat', {
      message,
      sessionId,
      context
    });
    return response.data.data;
  }

  async getChatHistory(sessionId: string): Promise<any[]> {
    const response = await this.client.get<ApiResponse<any[]>>(`/ai/sessions/${sessionId}/messages`);
    return response.data.data;
  }

  // 用户认证API
  async login(username: string, password: string): Promise<any> {
    const response = await this.client.post<ApiResponse<any>>('/auth/login', {
      username,
      password
    });
    return response.data.data;
  }

  async refreshToken(refreshToken: string): Promise<any> {
    const response = await this.client.post<ApiResponse<any>>('/auth/refresh', {
      refreshToken
    });
    return response.data.data;
  }

  async logout(): Promise<void> {
    await this.client.post('/auth/logout');
  }

  // 健康检查
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.get('/health');
      return true;
    } catch {
      return false;
    }
  }
}

// 创建API服务实例
export const apiService = new ApiService();

// 导出类型
export type {
  ApiResponse,
  PaginatedResponse,
  ApiError,
  SafetyDataQuery,
  DashboardStats,
  UploadResponse
};

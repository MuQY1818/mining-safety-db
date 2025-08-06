// 用户建议状态管理
import { create } from 'zustand';
import { UserFeedback, FeedbackFormData, FeedbackFilters, FeedbackStats } from '../types/feedback';

interface FeedbackState {
  feedbacks: UserFeedback[];
  filteredFeedbacks: UserFeedback[];
  loading: boolean;
  error: string | null;
  stats: FeedbackStats | null;
  filters: FeedbackFilters;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  
  // Actions
  setFeedbacks: (feedbacks: UserFeedback[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<FeedbackFilters>) => void;
  setPagination: (pagination: Partial<FeedbackState['pagination']>) => void;
  
  // Data operations
  fetchFeedbacks: (params?: any) => Promise<void>;
  submitFeedback: (data: FeedbackFormData) => Promise<void>;
  voteFeedback: (id: string, type: 'up' | 'down') => Promise<void>;
  fetchStats: () => Promise<void>;
  applyFilters: () => void;
  clearFilters: () => void;
}

// 生成唯一ID
const generateId = (): string => {
  return 'fb_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 模拟API延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟建议数据
const mockFeedbacks: UserFeedback[] = [
  {
    id: 'fb_001',
    title: '建议增加数据导出功能',
    description: '希望能够将搜索结果导出为Excel或PDF格式，方便离线查看和分析。目前只能在线浏览，不太方便。',
    type: 'feature_request',
    priority: 'medium',
    status: 'approved',
    userName: '张工程师',
    userEmail: 'zhang@example.com',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
    upvotes: 15,
    downvotes: 2,
    adminReply: '感谢您的建议！数据导出功能已列入开发计划，预计下个版本发布。',
    adminRepliedAt: '2024-01-16T14:20:00Z',
    adminRepliedBy: '系统管理员'
  },
  {
    id: 'fb_002',
    title: '搜索功能响应速度较慢',
    description: '在进行关键词搜索时，系统响应时间较长，特别是在数据量大的情况下，希望能够优化搜索性能。',
    type: 'performance',
    priority: 'high',
    status: 'reviewing',
    userName: '李安全员',
    userEmail: 'li@example.com',
    createdAt: '2024-01-14T16:45:00Z',
    updatedAt: '2024-01-14T16:45:00Z',
    upvotes: 8,
    downvotes: 0
  },
  {
    id: 'fb_003',
    title: '界面颜色对比度建议调整',
    description: '部分文字颜色对比度不够，在强光环境下不太容易看清，建议调整颜色方案。',
    type: 'ui_improvement',
    priority: 'low',
    status: 'implemented',
    userName: '王用户',
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-12T11:30:00Z',
    upvotes: 5,
    downvotes: 1,
    adminReply: '已在最新版本中调整了颜色对比度，感谢您的建议！',
    adminRepliedAt: '2024-01-12T11:30:00Z'
  },
  {
    id: 'fb_004',
    title: '希望增加移动端适配',
    description: '目前系统在手机上使用体验不太好，希望能够优化移动端界面。',
    type: 'ui_improvement',
    priority: 'medium',
    status: 'pending',
    userName: '移动用户',
    createdAt: '2024-01-12T14:20:00Z',
    updatedAt: '2024-01-12T14:20:00Z',
    upvotes: 12,
    downvotes: 1
  },
  {
    id: 'fb_005',
    title: '系统登录页面加载异常',
    description: '登录页面偶尔会出现加载失败的情况，需要刷新多次才能正常显示。',
    type: 'bug_report',
    priority: 'urgent',
    status: 'reviewing',
    userName: '测试用户',
    userEmail: 'test@example.com',
    createdAt: '2024-01-13T11:30:00Z',
    updatedAt: '2024-01-13T11:30:00Z',
    upvotes: 3,
    downvotes: 0
  }
];

export const useFeedbackStore = create<FeedbackState>((set, get) => ({
  feedbacks: [],
  filteredFeedbacks: [],
  loading: false,
  error: null,
  stats: null,
  filters: {},
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0
  },

  setFeedbacks: (feedbacks) => {
    set({ feedbacks, filteredFeedbacks: feedbacks });
  },

  setLoading: (loading) => {
    set({ loading });
  },

  setError: (error) => {
    set({ error });
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }));
    get().applyFilters();
  },

  setPagination: (newPagination) => {
    set((state) => ({
      pagination: { ...state.pagination, ...newPagination }
    }));
  },

  // 获取建议列表
  fetchFeedbacks: async (params = {}) => {
    try {
      set({ loading: true, error: null });
      
      // 模拟API调用延迟
      await delay(500);
      
      // TODO: 替换为真实API调用
      // const response = await apiService.getFeedbacks(params);
      
      const feedbacks = mockFeedbacks;
      
      set({ 
        feedbacks, 
        filteredFeedbacks: feedbacks,
        pagination: {
          ...get().pagination,
          total: feedbacks.length
        },
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '获取建议列表失败',
        loading: false 
      });
    }
  },

  // 提交建议
  submitFeedback: async (data: FeedbackFormData) => {
    try {
      set({ loading: true, error: null });
      
      // 模拟API调用延迟
      await delay(800);
      
      // TODO: 替换为真实API调用
      // const response = await apiService.submitFeedback(data);
      
      const newFeedback: UserFeedback = {
        id: generateId(),
        title: data.title,
        description: data.description,
        type: data.type,
        priority: data.priority,
        userName: data.userName,
        userEmail: data.userEmail,
        userContact: data.userContact,
        tags: data.tags,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        upvotes: 0,
        downvotes: 0
      };
      
      const { feedbacks } = get();
      const updatedFeedbacks = [newFeedback, ...feedbacks];
      
      set({ 
        feedbacks: updatedFeedbacks,
        filteredFeedbacks: updatedFeedbacks,
        pagination: {
          ...get().pagination,
          total: updatedFeedbacks.length
        },
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '提交建议失败',
        loading: false 
      });
      throw error;
    }
  },

  // 投票
  voteFeedback: async (id: string, type: 'up' | 'down') => {
    try {
      // 模拟API调用延迟
      await delay(200);
      
      // TODO: 替换为真实API调用
      // await apiService.voteFeedback(id, type);
      
      const { feedbacks } = get();
      const updatedFeedbacks = feedbacks.map(feedback => {
        if (feedback.id === id) {
          return {
            ...feedback,
            upvotes: type === 'up' ? (feedback.upvotes || 0) + 1 : feedback.upvotes,
            downvotes: type === 'down' ? (feedback.downvotes || 0) + 1 : feedback.downvotes
          };
        }
        return feedback;
      });
      
      set({ 
        feedbacks: updatedFeedbacks,
        filteredFeedbacks: updatedFeedbacks
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '投票失败'
      });
    }
  },

  // 获取统计数据
  fetchStats: async () => {
    try {
      // 模拟API调用延迟
      await delay(300);
      
      // TODO: 替换为真实API调用
      // const stats = await apiService.getFeedbackStats();
      
      const { feedbacks } = get();
      const stats: FeedbackStats = {
        total: feedbacks.length,
        byType: {
          bug_report: feedbacks.filter(f => f.type === 'bug_report').length,
          feature_request: feedbacks.filter(f => f.type === 'feature_request').length,
          content_suggestion: feedbacks.filter(f => f.type === 'content_suggestion').length,
          ui_improvement: feedbacks.filter(f => f.type === 'ui_improvement').length,
          performance: feedbacks.filter(f => f.type === 'performance').length,
          other: feedbacks.filter(f => f.type === 'other').length
        },
        byStatus: {
          pending: feedbacks.filter(f => f.status === 'pending').length,
          reviewing: feedbacks.filter(f => f.status === 'reviewing').length,
          approved: feedbacks.filter(f => f.status === 'approved').length,
          rejected: feedbacks.filter(f => f.status === 'rejected').length,
          implemented: feedbacks.filter(f => f.status === 'implemented').length,
          closed: feedbacks.filter(f => f.status === 'closed').length
        },
        byPriority: {
          low: feedbacks.filter(f => f.priority === 'low').length,
          medium: feedbacks.filter(f => f.priority === 'medium').length,
          high: feedbacks.filter(f => f.priority === 'high').length,
          urgent: feedbacks.filter(f => f.priority === 'urgent').length
        },
        recentCount: feedbacks.filter(f => {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return new Date(f.createdAt) > weekAgo;
        }).length,
        responseRate: 75.5,
        averageResponseTime: 18.5
      };
      
      set({ stats });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '获取统计数据失败'
      });
    }
  },

  // 应用筛选
  applyFilters: () => {
    const { feedbacks, filters } = get();
    
    let filtered = [...feedbacks];

    // 应用类型筛选
    if (filters.type) {
      filtered = filtered.filter(item => item.type === filters.type);
    }

    // 应用状态筛选
    if (filters.status) {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    // 应用优先级筛选
    if (filters.priority) {
      filtered = filtered.filter(item => item.priority === filters.priority);
    }

    // 应用搜索
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term)
      );
    }

    set({ filteredFeedbacks: filtered });
  },

  // 清除筛选
  clearFilters: () => {
    set({ 
      filters: {},
      filteredFeedbacks: get().feedbacks 
    });
  }
}));

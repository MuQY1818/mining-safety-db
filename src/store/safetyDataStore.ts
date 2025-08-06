// 安全数据状态管理
import { create } from 'zustand';
import { SafetyData, SafetyLevel, MineType, SafetyCategory } from '../types/safety';
import { mockSafetyData } from '../data/mockData';

interface SafetyDataState {
  data: SafetyData[];
  filteredData: SafetyData[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  filters: {
    safetyLevel?: SafetyLevel;
    mineType?: MineType;
    category?: SafetyCategory;
  };
  
  // Actions
  setData: (data: SafetyData[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchTerm: (term: string) => void;
  setFilters: (filters: Partial<SafetyDataState['filters']>) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  
  // Data management actions
  addData: (newData: Omit<SafetyData, 'id'>) => Promise<void>;
  updateData: (id: string, updatedData: Partial<SafetyData>) => Promise<void>;
  deleteData: (id: string) => Promise<void>;
  fetchData: () => Promise<void>;
}

// 生成唯一ID的辅助函数
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 模拟API延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useSafetyDataStore = create<SafetyDataState>((set, get) => ({
  data: mockSafetyData,
  filteredData: mockSafetyData,
  loading: false,
  error: null,
  searchTerm: '',
  filters: {},

  setData: (data) => {
    set({ data, filteredData: data });
  },

  setLoading: (loading) => {
    set({ loading });
  },

  setError: (error) => {
    set({ error });
  },

  setSearchTerm: (searchTerm) => {
    set({ searchTerm });
    get().applyFilters();
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }));
    get().applyFilters();
  },

  applyFilters: () => {
    const { data, searchTerm, filters } = get();
    
    let filtered = [...data];

    // 应用搜索
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term)
      );
    }

    // 应用筛选器
    if (filters.safetyLevel) {
      filtered = filtered.filter(item => item.safetyLevel === filters.safetyLevel);
    }
    if (filters.mineType) {
      filtered = filtered.filter(item => item.mineType === filters.mineType);
    }
    if (filters.category) {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    set({ filteredData: filtered });
  },

  clearFilters: () => {
    set({ 
      searchTerm: '', 
      filters: {},
      filteredData: get().data 
    });
  },

  // 获取数据 - 目前使用mock数据，后续替换为API调用
  fetchData: async () => {
    try {
      set({ loading: true, error: null });
      
      // 模拟API调用延迟
      await delay(500);
      
      // TODO: 替换为真实API调用
      // const response = await fetch('/api/safety-data');
      // const data = await response.json();
      
      const data = mockSafetyData;
      
      set({ 
        data, 
        filteredData: data, 
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '获取数据失败',
        loading: false 
      });
    }
  },

  // 添加数据
  addData: async (newData) => {
    try {
      set({ loading: true, error: null });
      
      // 模拟API调用延迟
      await delay(800);
      
      // TODO: 替换为真实API调用
      // const response = await fetch('/api/safety-data', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newData)
      // });
      // const createdData = await response.json();
      
      const createdData: SafetyData = {
        ...newData,
        id: generateId(),
        viewCount: 0,
        publishDate: newData.publishDate || new Date().toISOString()
      };
      
      const { data } = get();
      const updatedData = [createdData, ...data];
      
      set({ 
        data: updatedData,
        loading: false 
      });
      
      get().applyFilters();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '添加数据失败',
        loading: false 
      });
      throw error;
    }
  },

  // 更新数据
  updateData: async (id, updatedData) => {
    try {
      set({ loading: true, error: null });
      
      // 模拟API调用延迟
      await delay(800);
      
      // TODO: 替换为真实API调用
      // const response = await fetch(`/api/safety-data/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updatedData)
      // });
      // const updated = await response.json();
      
      const { data } = get();
      const updatedDataList = data.map(item =>
        item.id === id ? { ...item, ...updatedData } : item
      );
      
      set({ 
        data: updatedDataList,
        loading: false 
      });
      
      get().applyFilters();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '更新数据失败',
        loading: false 
      });
      throw error;
    }
  },

  // 删除数据
  deleteData: async (id) => {
    try {
      set({ loading: true, error: null });
      
      // 模拟API调用延迟
      await delay(500);
      
      // TODO: 替换为真实API调用
      // await fetch(`/api/safety-data/${id}`, {
      //   method: 'DELETE'
      // });
      
      const { data } = get();
      const filteredData = data.filter(item => item.id !== id);
      
      set({ 
        data: filteredData,
        loading: false 
      });
      
      get().applyFilters();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '删除数据失败',
        loading: false 
      });
      throw error;
    }
  }
}));

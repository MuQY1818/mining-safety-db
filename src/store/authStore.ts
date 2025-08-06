// 认证状态管理
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginRequest } from '../types/database';
import { authApi } from '../services/database';

interface AuthState {
  // 状态
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // 操作
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // 登录
      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });

        try {
          // 模拟登录 - 开发阶段使用
          await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟网络延迟

          const mockUser: User = {
            id: 1,
            username: credentials.username,
            role: 'admin',
            email: `${credentials.username}@cumt.edu.cn`
          };

          const mockToken = 'mock_jwt_token_' + Date.now();

          // 保存token到localStorage
          localStorage.setItem('auth_token', mockToken);

          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          // TODO: 替换为真实API调用
          // const response = await authApi.login(credentials);
          // const { token, user } = response;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : '登录失败'
          });
          throw error;
        }
      },

      // 登出
      logout: () => {
        // 调用API登出
        authApi.logout().catch(console.error);
        
        // 清除本地状态
        localStorage.removeItem('auth_token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null
        });
      },

      // 清除错误
      clearError: () => {
        set({ error: null });
      },

      // 检查认证状态
      checkAuth: async () => {
        const token = localStorage.getItem('auth_token');

        if (!token) {
          set({ isAuthenticated: false });
          return;
        }

        set({ isLoading: true });

        try {
          // 模拟用户信息 - 开发阶段使用
          if (token.startsWith('mock_jwt_token_')) {
            const mockUser: User = {
              id: 1,
              username: '演示用户',
              role: 'admin',
              email: 'demo@cumt.edu.cn'
            };

            set({
              user: mockUser,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
            return;
          }

          // TODO: 替换为真实API调用
          // const user = await authApi.getUserInfo();
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
        } catch (error) {
          // Token无效，清除认证状态
          localStorage.removeItem('auth_token');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

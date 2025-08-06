// AI聊天状态管理
import { create } from 'zustand';
import { ChatMessage, ChatSession } from '../types/ai';
import { aiApi } from '../services/ai';

interface ChatState {
  // 状态
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;

  // 操作
  createSession: (title?: string) => string;
  setCurrentSession: (sessionId: string) => void;
  sendMessage: (content: string) => Promise<void>;
  loadSessions: () => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  clearError: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  // 初始状态
  sessions: [],
  currentSession: null,
  isLoading: false,
  isStreaming: false,
  error: null,

  // 创建新会话
  createSession: (title = '新对话') => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newSession: ChatSession = {
      id: sessionId,
      userId: 1, // TODO: 从认证状态获取
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: []
    };

    set(state => ({
      sessions: [newSession, ...state.sessions],
      currentSession: newSession
    }));

    return sessionId;
  },

  // 设置当前会话
  setCurrentSession: (sessionId: string) => {
    const session = get().sessions.find(s => s.id === sessionId);
    if (session) {
      set({ currentSession: session });
    }
  },

  // 发送消息
  sendMessage: async (content: string) => {
    const { currentSession } = get();
    
    if (!currentSession) {
      set({ error: '请先创建或选择一个会话' });
      return;
    }

    // 创建用户消息
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId: currentSession.id,
      role: 'user',
      content,
      timestamp: new Date()
    };

    // 添加用户消息到会话
    set(state => ({
      sessions: state.sessions.map(session =>
        session.id === currentSession.id
          ? {
              ...session,
              messages: [...session.messages, userMessage],
              updatedAt: new Date()
            }
          : session
      ),
      currentSession: {
        ...currentSession,
        messages: [...currentSession.messages, userMessage],
        updatedAt: new Date()
      },
      isStreaming: true,
      error: null
    }));

    try {
      // 创建AI消息占位符
      const aiMessage: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        sessionId: currentSession.id,
        role: 'assistant',
        content: '',
        timestamp: new Date()
      };

      // 添加AI消息占位符
      set(state => ({
        sessions: state.sessions.map(session =>
          session.id === currentSession.id
            ? {
                ...session,
                messages: [...session.messages, aiMessage]
              }
            : session
        ),
        currentSession: {
          ...state.currentSession!,
          messages: [...state.currentSession!.messages, aiMessage]
        }
      }));

      // 获取所有消息用于AI对话
      const allMessages = [...currentSession.messages, userMessage];
      
      // 使用流式响应
      await aiApi.chatStream(
        content, // 用户消息内容
        currentSession.id,
        // onChunk - 处理流式数据
        (chunk: string) => {
          set(state => ({
            sessions: state.sessions.map(session =>
              session.id === currentSession.id
                ? {
                    ...session,
                    messages: session.messages.map(msg =>
                      msg.id === aiMessage.id
                        ? { ...msg, content: msg.content + chunk }
                        : msg
                    )
                  }
                : session
            ),
            currentSession: state.currentSession
              ? {
                  ...state.currentSession,
                  messages: state.currentSession.messages.map(msg =>
                    msg.id === aiMessage.id
                      ? { ...msg, content: msg.content + chunk }
                      : msg
                  )
                }
              : null
          }));
        },
        // onComplete - 完成回调
        () => {
          console.log('AI响应完成');
        },
        // onError - 错误处理
        (error: string) => {
          console.error('AI响应错误:', error);
          set(state => ({
            sessions: state.sessions.map(session =>
              session.id === currentSession.id
                ? {
                    ...session,
                    messages: session.messages.map(msg =>
                      msg.id === aiMessage.id
                        ? { ...msg, content: '抱歉，AI服务暂时不可用，请稍后再试。' }
                        : msg
                    )
                  }
                : session
            ),
            currentSession: state.currentSession
              ? {
                  ...state.currentSession,
                  messages: state.currentSession.messages.map(msg =>
                    msg.id === aiMessage.id
                      ? { ...msg, content: '抱歉，AI服务暂时不可用，请稍后再试。' }
                      : msg
                  )
                }
              : null
          }));
        }
      );

      // 保存会话到后端
      const updatedSession = get().currentSession;
      if (updatedSession) {
        await aiApi.saveSession(updatedSession.id, updatedSession.messages);
      }

    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'AI对话失败',
        isStreaming: false
      });
      
      // 移除失败的AI消息
      set(state => ({
        sessions: state.sessions.map(session =>
          session.id === currentSession.id
            ? {
                ...session,
                messages: session.messages.slice(0, -1)
              }
            : session
        ),
        currentSession: state.currentSession
          ? {
              ...state.currentSession,
              messages: state.currentSession.messages.slice(0, -1)
            }
          : null
      }));
    } finally {
      set({ isStreaming: false });
    }
  },

  // 加载会话列表
  loadSessions: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const sessions = await aiApi.getSessions(1); // TODO: 从认证状态获取用户ID
      set({ sessions, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '加载会话失败',
        isLoading: false
      });
    }
  },

  // 删除会话
  deleteSession: async (sessionId: string) => {
    try {
      await aiApi.deleteSession(sessionId);
      
      set(state => ({
        sessions: state.sessions.filter(s => s.id !== sessionId),
        currentSession: state.currentSession?.id === sessionId ? null : state.currentSession
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '删除会话失败'
      });
    }
  },

  // 清除错误
  clearError: () => {
    set({ error: null });
  }
}));

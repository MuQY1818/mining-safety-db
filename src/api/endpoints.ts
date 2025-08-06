// API接口端点定义

// 基础API配置
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

// API端点常量
export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile'
  },

  // 数据管理相关
  ITEMS: {
    LIST: '/items',                    // GET - 获取数据列表
    CREATE: '/items',                  // POST - 创建新数据
    DETAIL: (id: number) => `/items/${id}`,  // GET - 获取单个数据详情
    UPDATE: (id: number) => `/items/${id}`,  // PUT - 更新数据
    DELETE: (id: number) => `/items/${id}`,  // DELETE - 删除数据
    BATCH_DELETE: '/items/batch-delete',     // POST - 批量删除
    BATCH_UPDATE: '/items/batch-update',     // POST - 批量更新
    EXPORT: '/items/export',                 // POST - 导出数据
    STATS: '/items/stats'                    // GET - 获取统计信息
  },

  // 文件上传相关
  UPLOAD: {
    FILE: '/upload/file',              // POST - 单文件上传
    MULTIPLE: '/upload/multiple',      // POST - 多文件上传
    DELETE: (fileId: string) => `/upload/${fileId}` // DELETE - 删除文件
  },

  // 搜索相关
  SEARCH: {
    ITEMS: '/search/items',            // GET - 搜索数据
    SUGGESTIONS: '/search/suggestions', // GET - 搜索建议
    KEYWORDS: '/search/keywords'       // GET - 关键词提示
  },

  // 系统配置相关
  CONFIG: {
    CATEGORIES: '/config/categories',   // GET - 获取安全类别列表
    MINING_TYPES: '/config/mining-types', // GET - 获取矿区类型列表
    LANGUAGE_TYPES: '/config/language-types', // GET - 获取语言类型列表
    SAFETY_LEVELS: '/config/safety-levels' // GET - 获取安全等级列表
  }
} as const;

// HTTP方法类型
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// API请求配置类型
export interface ApiRequestConfig {
  method: HttpMethod;
  url: string;
  params?: Record<string, any>;      // URL参数
  data?: Record<string, any>;        // 请求体数据
  headers?: Record<string, string>;  // 请求头
  timeout?: number;                  // 超时时间
}

// 分页请求参数
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 文件上传配置
export interface UploadConfig {
  maxSize: number;                   // 最大文件大小（字节）
  allowedTypes: string[];            // 允许的文件类型
  multiple: boolean;                 // 是否支持多文件
}

// 默认上传配置
export const DEFAULT_UPLOAD_CONFIG: UploadConfig = {
  maxSize: 100 * 1024 * 1024,       // 100MB
  allowedTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'video/mp4',
    'video/avi',
    'audio/mp3',
    'audio/wav',
    'image/jpeg',
    'image/png',
    'image/gif'
  ],
  multiple: false
};

// API错误码定义
export const API_ERROR_CODES = {
  // 通用错误
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,

  // 业务错误码
  INVALID_CREDENTIALS: 1001,         // 无效凭证
  TOKEN_EXPIRED: 1002,               // Token过期
  INSUFFICIENT_PERMISSIONS: 1003,    // 权限不足
  DUPLICATE_TITLE: 2001,             // 标题重复
  FILE_TOO_LARGE: 2002,              // 文件过大
  INVALID_FILE_TYPE: 2003,           // 无效文件类型
  ITEM_NOT_FOUND: 2004,              // 数据不存在
  CATEGORY_NOT_FOUND: 2005,          // 类别不存在
  VALIDATION_ERROR: 2006             // 数据验证错误
} as const;

// API错误消息映射
export const API_ERROR_MESSAGES: Record<number, string> = {
  [API_ERROR_CODES.BAD_REQUEST]: '请求参数错误',
  [API_ERROR_CODES.UNAUTHORIZED]: '未授权访问',
  [API_ERROR_CODES.FORBIDDEN]: '访问被禁止',
  [API_ERROR_CODES.NOT_FOUND]: '资源不存在',
  [API_ERROR_CODES.INTERNAL_ERROR]: '服务器内部错误',
  [API_ERROR_CODES.INVALID_CREDENTIALS]: '用户名或密码错误',
  [API_ERROR_CODES.TOKEN_EXPIRED]: '登录已过期，请重新登录',
  [API_ERROR_CODES.INSUFFICIENT_PERMISSIONS]: '权限不足',
  [API_ERROR_CODES.DUPLICATE_TITLE]: '标题已存在',
  [API_ERROR_CODES.FILE_TOO_LARGE]: '文件大小超出限制',
  [API_ERROR_CODES.INVALID_FILE_TYPE]: '不支持的文件类型',
  [API_ERROR_CODES.ITEM_NOT_FOUND]: '数据不存在',
  [API_ERROR_CODES.CATEGORY_NOT_FOUND]: '安全类别不存在',
  [API_ERROR_CODES.VALIDATION_ERROR]: '数据验证失败'
};

// 请求超时配置
export const REQUEST_TIMEOUT = {
  DEFAULT: 10000,                    // 默认10秒
  UPLOAD: 60000,                     // 上传60秒
  EXPORT: 30000                      // 导出30秒
};

// 分页默认配置
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
};

// 搜索配置
export const SEARCH_CONFIG = {
  DEBOUNCE_DELAY: 300,               // 搜索防抖延迟（毫秒）
  MIN_KEYWORD_LENGTH: 2,             // 最小搜索关键词长度
  MAX_SUGGESTIONS: 10                // 最大搜索建议数量
};

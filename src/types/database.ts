// 数据库相关类型定义

// 安全等级枚举
export enum SafetyLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM', 
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

// 访问权限枚举
export enum AccessLevel {
  PUBLIC = 'PUBLIC',
  INTERNAL = 'INTERNAL',
  RESTRICTED = 'RESTRICTED'
}

// 矿区语言安全资料数据模型
export interface MiningLanguageItem {
  id: number;
  title: string;                    // 资料标题
  category: string;                 // 安全类别（瓦斯安全、机械安全等）
  downloadUrl: string;              // 下载地址
  description?: string;             // 资料描述
  safetyLevel: SafetyLevel;         // 安全等级
  miningType: string;               // 矿区类型（煤矿、金属矿等）
  languageType: string;             // 语言类型（中文、英文等）
  standardCode?: string;            // 标准编码
  keywords: string[];               // 关键词标签
  createdAt: string;                // 创建时间
  updatedAt: string;                // 更新时间
  fileSize?: number;                // 文件大小（字节）
  fileType?: string;                // 文件类型
  accessLevel: AccessLevel;         // 访问权限级别
}

// 搜索参数类型
export interface SearchParams {
  keyword?: string;                 // 关键词搜索
  category?: string;                // 安全类别筛选
  safetyLevel?: SafetyLevel;        // 安全等级筛选
  miningType?: string;              // 矿区类型筛选
  languageType?: string;            // 语言类型筛选
  accessLevel?: AccessLevel;        // 访问权限筛选
  standardCode?: string;            // 标准编码搜索
  page: number;                     // 页码
  pageSize: number;                 // 每页数量
  sortBy?: 'title' | 'createdAt' | 'category' | 'safetyLevel';
  sortOrder?: 'asc' | 'desc';
}

// API响应类型
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 分页响应类型
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 用户信息类型
export interface User {
  id: number;
  username: string;
  role: 'admin' | 'user' | 'viewer';
  email?: string;
  avatar?: string;
}

// 登录请求类型
export interface LoginRequest {
  username: string;
  password: string;
}

// 登录响应类型
export interface LoginResponse {
  token: string;
  user: User;
  expiresIn: number;
}

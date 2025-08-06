# 矿区安全语言资料数据库 API 设计文档

## 基础信息

- **Base URL**: `https://api.mining-safety.com/v1`
- **认证方式**: JWT Bearer Token
- **数据格式**: JSON
- **字符编码**: UTF-8

## 通用响应格式

### 成功响应
```json
{
  "success": true,
  "data": {}, // 具体数据
  "message": "操作成功",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### 错误响应
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述",
    "details": {} // 详细错误信息（可选）
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### 分页响应
```json
{
  "success": true,
  "data": {
    "items": [], // 数据列表
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 100,
      "totalPages": 5
    }
  },
  "message": "获取成功"
}
```

## 1. 安全资料管理 API

### 1.1 获取安全资料列表
```
GET /safety-data
```

**查询参数:**
```typescript
interface SafetyDataQuery {
  page?: number;           // 页码，默认1
  pageSize?: number;       // 每页数量，默认20
  search?: string;         // 搜索关键词
  safetyLevel?: 'low' | 'medium' | 'high' | 'critical';
  mineType?: 'coal' | 'metal' | 'nonmetal' | 'openpit';
  category?: 'gas_detection' | 'equipment_safety' | 'emergency_response' | 'safety_training' | 'accident_prevention' | 'environmental_protection';
  sortBy?: 'publishDate' | 'viewCount' | 'title';
  sortOrder?: 'asc' | 'desc';
}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "sd_001",
        "title": "煤矿瓦斯检测技术规范",
        "description": "详细介绍煤矿瓦斯检测的技术要求和操作规程",
        "safetyLevel": "critical",
        "mineType": "coal",
        "category": "gas_detection",
        "publishDate": "2024-01-01T00:00:00Z",
        "viewCount": 1250,
        "downloadUrl": "https://files.mining-safety.com/documents/sd_001.pdf",
        "fileSize": 2048576,
        "fileType": "pdf",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

### 1.2 获取单个安全资料详情
```
GET /safety-data/{id}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "id": "sd_001",
    "title": "煤矿瓦斯检测技术规范",
    "description": "详细介绍煤矿瓦斯检测的技术要求和操作规程",
    "safetyLevel": "critical",
    "mineType": "coal",
    "category": "gas_detection",
    "publishDate": "2024-01-01T00:00:00Z",
    "viewCount": 1250,
    "downloadUrl": "https://files.mining-safety.com/documents/sd_001.pdf",
    "fileSize": 2048576,
    "fileType": "pdf",
    "tags": ["瓦斯", "检测", "安全规范"],
    "relatedItems": ["sd_002", "sd_003"],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 1.3 创建安全资料
```
POST /safety-data
```

**请求体:**
```json
{
  "title": "新安全资料标题",
  "description": "资料描述",
  "safetyLevel": "medium",
  "mineType": "coal",
  "category": "safety_training",
  "publishDate": "2024-01-01T00:00:00Z",
  "tags": ["标签1", "标签2"],
  "file": "base64编码的文件内容或文件URL"
}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "id": "sd_new_001",
    "title": "新安全资料标题",
    // ... 其他字段
  },
  "message": "创建成功"
}
```

### 1.4 更新安全资料
```
PUT /safety-data/{id}
```

**请求体:** 同创建接口，所有字段可选

### 1.5 删除安全资料
```
DELETE /safety-data/{id}
```

**响应示例:**
```json
{
  "success": true,
  "message": "删除成功"
}
```

### 1.6 批量操作
```
POST /safety-data/batch
```

**请求体:**
```json
{
  "action": "delete" | "update",
  "ids": ["sd_001", "sd_002"],
  "data": {} // 批量更新时的数据
}
```

## 2. 文件上传 API

### 2.1 上传文件
```
POST /upload
```

**请求格式:** multipart/form-data

**响应示例:**
```json
{
  "success": true,
  "data": {
    "fileId": "file_001",
    "fileName": "document.pdf",
    "fileSize": 2048576,
    "fileType": "pdf",
    "url": "https://files.mining-safety.com/documents/file_001.pdf",
    "thumbnailUrl": "https://files.mining-safety.com/thumbnails/file_001.jpg"
  }
}
```

## 3. 统计数据 API

### 3.1 获取仪表板统计
```
GET /statistics/dashboard
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "totalItems": 1250,
    "safetyLevelCounts": {
      "low": 300,
      "medium": 450,
      "high": 350,
      "critical": 150
    },
    "mineTypeCounts": {
      "coal": 500,
      "metal": 300,
      "nonmetal": 250,
      "openpit": 200
    },
    "categoryCounts": {
      "gas_detection": 200,
      "equipment_safety": 300,
      "emergency_response": 150,
      "safety_training": 250,
      "accident_prevention": 200,
      "environmental_protection": 150
    },
    "recentActivity": {
      "newItemsThisWeek": 15,
      "totalDownloadsThisMonth": 2500,
      "mostViewedItems": ["sd_001", "sd_002", "sd_003"]
    }
  }
}
```

## 4. AI 问答 API

### 4.1 发送消息
```
POST /ai/chat
```

**请求体:**
```json
{
  "message": "用户问题",
  "sessionId": "session_001",
  "context": {
    "relatedDataId": "sd_001" // 可选，相关的安全资料ID
  }
}
```

**响应示例 (流式):**
```json
{
  "success": true,
  "data": {
    "messageId": "msg_001",
    "sessionId": "session_001",
    "response": "AI回答内容",
    "relatedItems": ["sd_001", "sd_002"], // 相关推荐资料
    "confidence": 0.95
  }
}
```

### 4.2 获取会话历史
```
GET /ai/sessions/{sessionId}/messages
```

## 5. 用户认证 API

### 5.1 用户登录
```
POST /auth/login
```

**请求体:**
```json
{
  "username": "用户名",
  "password": "密码"
}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "refreshToken": "refresh_token_here",
    "user": {
      "id": "user_001",
      "username": "admin",
      "role": "admin",
      "permissions": ["read", "write", "delete"]
    },
    "expiresIn": 3600
  }
}
```

### 5.2 刷新Token
```
POST /auth/refresh
```

### 5.3 用户登出
```
POST /auth/logout
```

## 6. 错误代码

| 错误代码 | HTTP状态码 | 描述 |
|---------|-----------|------|
| INVALID_REQUEST | 400 | 请求参数无效 |
| UNAUTHORIZED | 401 | 未授权访问 |
| FORBIDDEN | 403 | 权限不足 |
| NOT_FOUND | 404 | 资源不存在 |
| CONFLICT | 409 | 资源冲突 |
| VALIDATION_ERROR | 422 | 数据验证失败 |
| INTERNAL_ERROR | 500 | 服务器内部错误 |
| SERVICE_UNAVAILABLE | 503 | 服务不可用 |

## 7. 请求头要求

```
Authorization: Bearer {jwt_token}
Content-Type: application/json
Accept: application/json
X-Client-Version: 1.0.0
```

## 8. 限流规则

- 普通用户：100 请求/分钟
- 管理员用户：500 请求/分钟
- 文件上传：10 请求/分钟，单文件最大 50MB

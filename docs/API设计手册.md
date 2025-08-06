# 矿区安全语言资料数据库 - 后端API设计手册

## 1. 项目概述

### 1.1 项目简介
矿区安全语言资料数据库是一个专业的矿区安全知识资源管理平台，用于存储、管理和检索各类矿区安全相关的文档、规范、培训材料等。

### 1.2 技术栈建议
- **后端框架**: Spring Boot 3.x / Node.js (Express/Nest.js) / Python (Django/FastAPI)
- **数据库**: MySQL 8.0+ / PostgreSQL 14+
- **文件存储**: 阿里云OSS / 腾讯云COS / MinIO
- **搜索引擎**: Elasticsearch (可选)
- **缓存**: Redis
- **认证**: JWT

## 2. 数据模型设计

### 2.1 用户表 (users)
```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    real_name VARCHAR(50),
    phone VARCHAR(20),
    role ENUM('admin', 'editor', 'viewer') DEFAULT 'viewer',
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2.2 安全资料表 (safety_data)
```sql
CREATE TABLE safety_data (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    safety_level ENUM('low', 'medium', 'high', 'critical') NOT NULL,
    mine_type ENUM('coal', 'metal', 'nonmetal', 'openpit') NOT NULL,
    category ENUM('gas_detection', 'equipment_safety', 'emergency_response', 
                  'safety_training', 'accident_prevention', 'environmental_protection') NOT NULL,
    publish_date DATE NOT NULL,
    view_count INT DEFAULT 0,
    download_count INT DEFAULT 0,
    province VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    district VARCHAR(50),
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    download_url VARCHAR(500),
    file_size BIGINT,
    file_type VARCHAR(20),
    tags JSON,
    related_items JSON,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_safety_level (safety_level),
    INDEX idx_mine_type (mine_type),
    INDEX idx_category (category),
    INDEX idx_location (province, city),
    INDEX idx_publish_date (publish_date),
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### 2.3 用户反馈表 (feedback)
```sql
CREATE TABLE feedback (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    type ENUM('bug', 'feature', 'improvement', 'other') NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    contact_info VARCHAR(100),
    status ENUM('pending', 'processing', 'resolved', 'closed') DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    admin_reply TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 2.4 AI对话记录表 (ai_conversations)
```sql
CREATE TABLE ai_conversations (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    session_id VARCHAR(36) NOT NULL,
    message_type ENUM('user', 'assistant') NOT NULL,
    content TEXT NOT NULL,
    tokens_used INT,
    model_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_session (session_id),
    INDEX idx_user_session (user_id, session_id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 3. API接口设计

### 3.1 通用响应格式
```json
{
  "success": true,
  "data": {},
  "message": "操作成功",
  "timestamp": "2024-02-06T10:30:00Z",
  "code": 200
}
```

### 3.2 错误响应格式
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "参数验证失败",
    "details": {
      "field": "title",
      "reason": "标题不能为空"
    }
  },
  "timestamp": "2024-02-06T10:30:00Z"
}
```

### 3.3 分页响应格式
```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 100,
      "totalPages": 5
    }
  },
  "message": "查询成功",
  "timestamp": "2024-02-06T10:30:00Z"
}
```

## 4. 认证授权接口

### 4.1 用户注册
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "zhangsan",
  "email": "zhangsan@example.com",
  "password": "password123",
  "realName": "张三",
  "phone": "13800138000"
}

Response:
{
  "success": true,
  "data": {
    "user": {
      "id": "user_001",
      "username": "zhangsan",
      "email": "zhangsan@example.com",
      "realName": "张三",
      "role": "viewer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "注册成功"
}
```

### 4.2 用户登录
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "zhangsan",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "user": {
      "id": "user_001",
      "username": "zhangsan",
      "email": "zhangsan@example.com",
      "realName": "张三",
      "role": "viewer",
      "avatarUrl": "https://example.com/avatar.jpg"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  },
  "message": "登录成功"
}
```

### 4.3 刷新Token
```
POST /api/auth/refresh
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  },
  "message": "Token刷新成功"
}
```

### 4.4 用户登出
```
POST /api/auth/logout
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "登出成功"
}
```

## 5. 安全资料管理接口

### 5.1 获取安全资料列表
```
GET /api/safety-data?page=1&pageSize=20&keyword=瓦斯&safetyLevel=critical&mineType=coal&category=gas_detection&province=山西省&city=太原市&sortBy=publishDate&sortOrder=desc

Response:
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "sd_001",
        "title": "煤矿瓦斯检测技术规范",
        "description": "详细介绍煤矿瓦斯检测的技术要求...",
        "safetyLevel": "critical",
        "mineType": "coal",
        "category": "gas_detection",
        "publishDate": "2024-01-15",
        "viewCount": 1250,
        "downloadCount": 89,
        "location": {
          "province": "山西省",
          "city": "太原市",
          "district": "万柏林区",
          "address": "山西焦煤集团西山煤电",
          "coordinates": {
            "latitude": 37.8706,
            "longitude": 112.5489
          }
        },
        "downloadUrl": "https://example.com/documents/gas-detection-standard.pdf",
        "fileSize": 2048576,
        "fileType": "pdf",
        "tags": ["瓦斯", "检测", "安全规范"],
        "createdAt": "2024-01-15T00:00:00Z",
        "updatedAt": "2024-01-15T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 100,
      "totalPages": 5
    }
  },
  "message": "查询成功"
}
```

### 5.2 获取安全资料详情
```
GET /api/safety-data/{id}

Response:
{
  "success": true,
  "data": {
    "id": "sd_001",
    "title": "煤矿瓦斯检测技术规范",
    "description": "详细介绍煤矿瓦斯检测的技术要求、操作规程和安全标准，包括检测设备的使用方法和数据分析。",
    "safetyLevel": "critical",
    "mineType": "coal",
    "category": "gas_detection",
    "publishDate": "2024-01-15",
    "viewCount": 1251,
    "downloadCount": 89,
    "location": {
      "province": "山西省",
      "city": "太原市",
      "district": "万柏林区",
      "address": "山西焦煤集团西山煤电",
      "coordinates": {
        "latitude": 37.8706,
        "longitude": 112.5489
      }
    },
    "downloadUrl": "https://example.com/documents/gas-detection-standard.pdf",
    "fileSize": 2048576,
    "fileType": "pdf",
    "tags": ["瓦斯", "检测", "安全规范"],
    "relatedItems": ["sd_002", "sd_007"],
    "createdBy": "user_001",
    "createdAt": "2024-01-15T00:00:00Z",
    "updatedAt": "2024-01-15T00:00:00Z"
  },
  "message": "查询成功"
}
```

### 5.3 创建安全资料
```
POST /api/safety-data
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "title": "新的安全资料",
  "description": "资料描述",
  "safetyLevel": "high",
  "mineType": "coal",
  "category": "safety_training",
  "publishDate": "2024-02-06",
  "location": {
    "province": "河南省",
    "city": "郑州市",
    "district": "中原区"
  },
  "tags": ["培训", "安全"],
  "file": <文件对象>
}

Response:
{
  "success": true,
  "data": {
    "id": "sd_013",
    "title": "新的安全资料",
    "downloadUrl": "https://example.com/documents/new-safety-material.pdf"
  },
  "message": "创建成功"
}
```

### 5.4 更新安全资料
```
PUT /api/safety-data/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "更新后的标题",
  "description": "更新后的描述",
  "safetyLevel": "medium"
}

Response:
{
  "success": true,
  "data": {
    "id": "sd_001",
    "title": "更新后的标题"
  },
  "message": "更新成功"
}
```

### 5.5 删除安全资料
```
DELETE /api/safety-data/{id}
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "删除成功"
}
```

### 5.6 增加浏览次数
```
POST /api/safety-data/{id}/view
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "viewCount": 1252
  },
  "message": "浏览次数已更新"
}
```

### 5.7 文件下载
```
GET /api/safety-data/{id}/download
Authorization: Bearer <token>

Response: 文件流或重定向到文件URL
```

## 6. 统计数据接口

### 6.1 获取数据库统计信息
```
GET /api/statistics/overview

Response:
{
  "success": true,
  "data": {
    "totalItems": 120,
    "safetyLevelCounts": {
      "low": 25,
      "medium": 45,
      "high": 35,
      "critical": 15
    },
    "mineTypeCounts": {
      "coal": 60,
      "metal": 30,
      "nonmetal": 20,
      "openpit": 10
    },
    "categoryCounts": {
      "gas_detection": 25,
      "equipment_safety": 30,
      "emergency_response": 20,
      "safety_training": 25,
      "accident_prevention": 15,
      "environmental_protection": 5
    },
    "recentActivity": {
      "newItemsThisWeek": 5,
      "totalDownloadsThisMonth": 1250,
      "mostViewedItems": ["sd_001", "sd_003", "sd_007"]
    }
  },
  "message": "查询成功"
}
```

### 6.2 获取地理分布统计
```
GET /api/statistics/geographic

Response:
{
  "success": true,
  "data": {
    "provinces": [
      {
        "province": "山西省",
        "count": 25,
        "cities": [
          {"city": "太原市", "count": 15},
          {"city": "大同市", "count": 10}
        ]
      }
    ]
  },
  "message": "查询成功"
}
```

## 7. 用户反馈接口

### 7.1 提交用户反馈
```
POST /api/feedback
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "feature",
  "title": "希望增加批量导入功能",
  "content": "建议增加Excel批量导入安全资料的功能，提高录入效率。",
  "contactInfo": "zhangsan@example.com"
}

Response:
{
  "success": true,
  "data": {
    "id": "fb_001",
    "type": "feature",
    "title": "希望增加批量导入功能",
    "status": "pending"
  },
  "message": "反馈提交成功"
}
```

### 7.2 获取用户反馈列表
```
GET /api/feedback?page=1&pageSize=20&type=feature&status=pending

Response:
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "fb_001",
        "type": "feature",
        "title": "希望增加批量导入功能",
        "content": "建议增加Excel批量导入安全资料的功能...",
        "status": "pending",
        "priority": "medium",
        "createdAt": "2024-02-06T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 10,
      "totalPages": 1
    }
  },
  "message": "查询成功"
}
```

### 7.3 更新反馈状态（管理员）
```
PUT /api/feedback/{id}/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "processing",
  "adminReply": "我们正在评估这个功能的可行性，预计下个版本会考虑加入。"
}

Response:
{
  "success": true,
  "data": {
    "id": "fb_001",
    "status": "processing"
  },
  "message": "状态更新成功"
}
```

## 8. AI问答接口

### 8.1 发送AI问答消息
```
POST /api/ai/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "煤矿瓦斯检测的标准浓度是多少？",
  "sessionId": "session_001",
  "context": []
}

Response:
{
  "success": true,
  "data": {
    "messageId": "msg_001",
    "response": "根据《煤矿安全规程》规定，煤矿井下瓦斯浓度检测标准如下：\n\n1. 采掘工作面风流中瓦斯浓度不得超过1%\n2. 采掘工作面回风流中瓦斯浓度不得超过1%\n3. 采区回风巷、一翼回风巷、总回风巷的瓦斯浓度不得超过0.75%\n\n当瓦斯浓度达到1.5%时，必须停止作业，撤出人员，进行处理。",
    "tokensUsed": 156,
    "modelName": "qwen-plus"
  },
  "message": "回答成功"
}
```

### 8.2 获取AI对话历史
```
GET /api/ai/conversations/{sessionId}?page=1&pageSize=50
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "msg_001",
        "messageType": "user",
        "content": "煤矿瓦斯检测的标准浓度是多少？",
        "createdAt": "2024-02-06T10:30:00Z"
      },
      {
        "id": "msg_002",
        "messageType": "assistant",
        "content": "根据《煤矿安全规程》规定...",
        "tokensUsed": 156,
        "modelName": "qwen-plus",
        "createdAt": "2024-02-06T10:30:15Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 50,
      "total": 2,
      "totalPages": 1
    }
  },
  "message": "查询成功"
}
```

## 9. 文件管理接口

### 9.1 文件上传
```
POST /api/files/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "file": <文件对象>,
  "category": "safety_document"
}

Response:
{
  "success": true,
  "data": {
    "fileId": "file_001",
    "fileName": "safety-manual.pdf",
    "fileUrl": "https://example.com/files/safety-manual.pdf",
    "fileSize": 2048576,
    "fileType": "pdf",
    "uploadedAt": "2024-02-06T10:30:00Z"
  },
  "message": "上传成功"
}
```

### 9.2 文件删除
```
DELETE /api/files/{fileId}
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "文件删除成功"
}
```

## 10. 搜索接口

### 10.1 全文搜索
```
GET /api/search?q=瓦斯检测&type=safety_data&page=1&pageSize=20

Response:
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "sd_001",
        "title": "煤矿<em>瓦斯检测</em>技术规范",
        "description": "详细介绍煤矿<em>瓦斯检测</em>的技术要求...",
        "type": "safety_data",
        "score": 0.95,
        "highlights": {
          "title": ["煤矿<em>瓦斯检测</em>技术规范"],
          "description": ["详细介绍煤矿<em>瓦斯检测</em>的技术要求"]
        }
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 5,
      "totalPages": 1
    },
    "suggestions": ["瓦斯监测", "瓦斯治理", "瓦斯防治"]
  },
  "message": "搜索成功"
}
```

### 10.2 搜索建议
```
GET /api/search/suggestions?q=瓦斯

Response:
{
  "success": true,
  "data": {
    "suggestions": [
      "瓦斯检测",
      "瓦斯监测",
      "瓦斯治理",
      "瓦斯防治",
      "瓦斯爆炸"
    ]
  },
  "message": "查询成功"
}
```

## 11. 系统管理接口

### 11.1 获取系统配置
```
GET /api/system/config
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "data": {
    "maxFileSize": 10485760,
    "allowedFileTypes": ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"],
    "aiModelConfig": {
      "defaultModel": "qwen-plus",
      "maxTokens": 2000,
      "temperature": 0.7
    },
    "systemMaintenance": false
  },
  "message": "查询成功"
}
```

### 11.2 更新系统配置
```
PUT /api/system/config
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "maxFileSize": 20971520,
  "allowedFileTypes": ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"]
}

Response:
{
  "success": true,
  "message": "配置更新成功"
}
```

## 12. 错误码定义

| 错误码 | HTTP状态码 | 描述 |
|--------|------------|------|
| SUCCESS | 200 | 操作成功 |
| CREATED | 201 | 创建成功 |
| BAD_REQUEST | 400 | 请求参数错误 |
| UNAUTHORIZED | 401 | 未授权 |
| FORBIDDEN | 403 | 禁止访问 |
| NOT_FOUND | 404 | 资源不存在 |
| CONFLICT | 409 | 资源冲突 |
| VALIDATION_ERROR | 422 | 数据验证失败 |
| INTERNAL_ERROR | 500 | 服务器内部错误 |
| SERVICE_UNAVAILABLE | 503 | 服务不可用 |

### 具体业务错误码
| 错误码 | 描述 |
|--------|------|
| USER_NOT_FOUND | 用户不存在 |
| INVALID_PASSWORD | 密码错误 |
| TOKEN_EXPIRED | Token已过期 |
| INSUFFICIENT_PERMISSION | 权限不足 |
| FILE_TOO_LARGE | 文件过大 |
| UNSUPPORTED_FILE_TYPE | 不支持的文件类型 |
| DUPLICATE_TITLE | 标题重复 |
| AI_SERVICE_ERROR | AI服务错误 |

## 13. 开发规范

### 13.1 接口命名规范
- 使用RESTful风格
- URL使用小写字母和连字符
- 资源名称使用复数形式
- 版本号放在URL中：`/api/v1/`

### 13.2 请求头规范
```
Content-Type: application/json
Authorization: Bearer <token>
Accept: application/json
User-Agent: MiningDB-Frontend/1.0.0
```

### 13.3 响应时间要求
- 查询接口：< 500ms
- 创建/更新接口：< 1s
- 文件上传接口：< 30s
- AI问答接口：< 10s

### 13.4 安全要求
- 所有接口必须使用HTTPS
- 敏感操作需要二次验证
- 实现请求频率限制
- 记录操作日志
- 数据脱敏处理

### 13.5 测试要求
- 单元测试覆盖率 > 80%
- 集成测试覆盖主要业务流程
- 性能测试验证响应时间
- 安全测试防范常见攻击

## 14. 部署说明

### 14.1 环境变量配置
```bash
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=mining_safety_db
DB_USER=root
DB_PASSWORD=password

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT配置
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=86400

# 文件存储配置
OSS_ACCESS_KEY_ID=your-access-key
OSS_ACCESS_KEY_SECRET=your-secret-key
OSS_BUCKET=mining-safety-files
OSS_REGION=oss-cn-beijing

# AI服务配置
AI_API_KEY=your-ai-api-key
AI_BASE_URL=https://api.siliconflow.cn/v1
```

### 14.2 数据库初始化
```sql
-- 创建数据库
CREATE DATABASE mining_safety_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 执行建表脚本
-- 插入初始数据
-- 创建索引
```

### 14.3 API文档
建议使用Swagger/OpenAPI生成在线API文档，访问地址：`http://your-domain/api/docs`

---

**联系方式**：如有疑问，请联系前端开发团队
**更新时间**：2024年2月6日
**版本**：v1.0.0

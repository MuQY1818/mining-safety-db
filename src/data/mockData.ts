// Mock数据定义
import { 
  MiningLanguageItem, 
  SafetyLevel, 
  AccessLevel, 
  SafetyCategory, 
  MiningType, 
  LanguageType, 
  FileType,
  DatabaseStats 
} from '../types/database';

// Mock矿区安全数据
export const mockMiningLanguageItems: MiningLanguageItem[] = [
  {
    id: 1001,
    title: '煤矿瓦斯检测标准操作规程',
    category: SafetyCategory.GAS_SAFETY,
    downloadUrl: '/files/gas-detection-standard.pdf',
    description: '详细介绍煤矿瓦斯检测的标准操作流程、检测设备使用方法及安全注意事项',
    safetyLevel: SafetyLevel.CRITICAL,
    miningType: MiningType.COAL,
    languageType: LanguageType.CHINESE,
    standardCode: 'MT/T 1158-2011',
    keywords: ['瓦斯检测', '标准操作', '安全规程', '煤矿安全'],
    createdAt: '2024-01-15T08:30:00Z',
    updatedAt: '2024-07-20T14:22:00Z',
    fileSize: 2048576,
    fileType: FileType.PDF,
    accessLevel: AccessLevel.INTERNAL,
    authorName: '张安全',
    version: 'v2.1',
    isActive: true
  },
  {
    id: 1002,
    title: '矿山机械设备安全操作手册',
    category: SafetyCategory.MECHANICAL_SAFETY,
    downloadUrl: '/files/mechanical-safety-manual.pdf',
    description: '涵盖各类矿山机械设备的安全操作要点、维护保养及故障处理方法',
    safetyLevel: SafetyLevel.HIGH,
    miningType: MiningType.METAL,
    languageType: LanguageType.BILINGUAL,
    standardCode: 'GB 16423-2020',
    keywords: ['机械安全', '设备操作', '维护保养', '故障处理'],
    createdAt: '2024-02-10T10:15:00Z',
    updatedAt: '2024-08-01T09:45:00Z',
    fileSize: 5242880,
    fileType: FileType.PDF,
    accessLevel: AccessLevel.PUBLIC,
    authorName: '李工程师',
    version: 'v1.5',
    isActive: true
  },
  {
    id: 1003,
    title: '矿区消防安全培训视频',
    category: SafetyCategory.FIRE_SAFETY,
    downloadUrl: '/files/fire-safety-training.mp4',
    description: '专业的矿区消防安全培训视频，包含火灾预防、应急疏散和灭火器使用方法',
    safetyLevel: SafetyLevel.HIGH,
    miningType: MiningType.COAL,
    languageType: LanguageType.CHINESE,
    standardCode: 'AQ 1029-2019',
    keywords: ['消防安全', '培训视频', '火灾预防', '应急疏散'],
    createdAt: '2024-03-05T14:20:00Z',
    updatedAt: '2024-07-15T16:30:00Z',
    fileSize: 157286400,
    fileType: FileType.VIDEO,
    accessLevel: AccessLevel.INTERNAL,
    authorName: '王消防',
    version: 'v1.0',
    isActive: true
  },
  {
    id: 1004,
    title: '电气安全检查清单',
    category: SafetyCategory.ELECTRICAL_SAFETY,
    downloadUrl: '/files/electrical-safety-checklist.docx',
    description: '矿区电气设备安全检查的详细清单，包含检查项目、标准要求和记录表格',
    safetyLevel: SafetyLevel.MEDIUM,
    miningType: MiningType.NON_METAL,
    languageType: LanguageType.CHINESE,
    standardCode: 'GB 3836.1-2021',
    keywords: ['电气安全', '检查清单', '设备检查', '安全标准'],
    createdAt: '2024-04-12T11:45:00Z',
    updatedAt: '2024-06-28T13:15:00Z',
    fileSize: 1048576,
    fileType: FileType.DOCX,
    accessLevel: AccessLevel.PUBLIC,
    authorName: '赵电工',
    version: 'v2.0',
    isActive: true
  },
  {
    id: 1005,
    title: '化学品安全数据表(MSDS)',
    category: SafetyCategory.CHEMICAL_SAFETY,
    downloadUrl: '/files/chemical-msds.pdf',
    description: '矿区常用化学品的安全数据表，包含物理化学性质、危险性和防护措施',
    safetyLevel: SafetyLevel.CRITICAL,
    miningType: MiningType.METAL,
    languageType: LanguageType.MULTILINGUAL,
    standardCode: 'GB/T 16483-2008',
    keywords: ['化学安全', 'MSDS', '危险化学品', '防护措施'],
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-07-10T15:20:00Z',
    fileSize: 3145728,
    fileType: FileType.PDF,
    accessLevel: AccessLevel.RESTRICTED,
    authorName: '陈化学师',
    version: 'v3.2',
    isActive: true
  },
  {
    id: 1006,
    title: '露天矿边坡稳定性监测指南',
    category: SafetyCategory.STRUCTURAL_SAFETY,
    downloadUrl: '/files/slope-monitoring-guide.pdf',
    description: '露天矿边坡稳定性监测的技术指南，包含监测方法、设备选择和数据分析',
    safetyLevel: SafetyLevel.HIGH,
    miningType: MiningType.OPEN_PIT,
    languageType: LanguageType.BILINGUAL,
    standardCode: 'GB 51016-2014',
    keywords: ['边坡监测', '稳定性分析', '露天矿', '安全监测'],
    createdAt: '2024-02-28T16:30:00Z',
    updatedAt: '2024-08-05T10:45:00Z',
    fileSize: 4194304,
    fileType: FileType.PDF,
    accessLevel: AccessLevel.INTERNAL,
    authorName: '孙地质师',
    version: 'v1.8',
    isActive: true
  },
  {
    id: 1007,
    title: '个人防护用品使用说明',
    category: SafetyCategory.PERSONAL_PROTECTION,
    downloadUrl: '/files/ppe-instructions.pdf',
    description: '矿区个人防护用品的正确使用方法、维护保养和更换周期说明',
    safetyLevel: SafetyLevel.MEDIUM,
    miningType: MiningType.COAL,
    languageType: LanguageType.CHINESE,
    standardCode: 'GB 2811-2019',
    keywords: ['个人防护', 'PPE', '使用说明', '安全防护'],
    createdAt: '2024-03-15T12:00:00Z',
    updatedAt: '2024-07-25T14:30:00Z',
    fileSize: 1572864,
    fileType: FileType.PDF,
    accessLevel: AccessLevel.PUBLIC,
    authorName: '刘安全员',
    version: 'v1.3',
    isActive: true
  },
  {
    id: 1008,
    title: '矿山应急救援预案',
    category: SafetyCategory.EMERGENCY_RESPONSE,
    downloadUrl: '/files/emergency-response-plan.docx',
    description: '完整的矿山应急救援预案，包含各类事故的应急处置流程和救援措施',
    safetyLevel: SafetyLevel.CRITICAL,
    miningType: MiningType.METAL,
    languageType: LanguageType.CHINESE,
    standardCode: 'AQ 1009-2007',
    keywords: ['应急救援', '预案', '事故处置', '救援措施'],
    createdAt: '2024-01-08T08:15:00Z',
    updatedAt: '2024-06-30T11:20:00Z',
    fileSize: 2621440,
    fileType: FileType.DOCX,
    accessLevel: AccessLevel.INTERNAL,
    authorName: '马救援队长',
    version: 'v2.5',
    isActive: true
  },
  {
    id: 1009,
    title: '环境保护监测报告模板',
    category: SafetyCategory.ENVIRONMENTAL_SAFETY,
    downloadUrl: '/files/environmental-monitoring-template.docx',
    description: '矿区环境保护监测报告的标准模板，包含监测项目、方法和评价标准',
    safetyLevel: SafetyLevel.MEDIUM,
    miningType: MiningType.NON_METAL,
    languageType: LanguageType.CHINESE,
    standardCode: 'HJ 819-2017',
    keywords: ['环境监测', '报告模板', '环境保护', '监测标准'],
    createdAt: '2024-04-20T15:45:00Z',
    updatedAt: '2024-07-18T09:30:00Z',
    fileSize: 1310720,
    fileType: FileType.DOCX,
    accessLevel: AccessLevel.PUBLIC,
    authorName: '周环保师',
    version: 'v1.2',
    isActive: true
  },
  {
    id: 1010,
    title: '新员工安全培训课程',
    category: SafetyCategory.TRAINING_EDUCATION,
    downloadUrl: '/files/new-employee-training.mp4',
    description: '专为新员工设计的安全培训课程，涵盖基础安全知识和操作规范',
    safetyLevel: SafetyLevel.LOW,
    miningType: MiningType.COAL,
    languageType: LanguageType.BILINGUAL,
    standardCode: 'AQ 1013-2008',
    keywords: ['安全培训', '新员工', '基础知识', '操作规范'],
    createdAt: '2024-05-10T10:30:00Z',
    updatedAt: '2024-08-02T16:15:00Z',
    fileSize: 209715200,
    fileType: FileType.VIDEO,
    accessLevel: AccessLevel.PUBLIC,
    authorName: '吴培训师',
    version: 'v1.1',
    isActive: true
  }
];

// Mock统计数据
export const mockDatabaseStats: DatabaseStats = {
  totalItems: 10,
  categoryCounts: {
    [SafetyCategory.GAS_SAFETY]: 1,
    [SafetyCategory.MECHANICAL_SAFETY]: 1,
    [SafetyCategory.FIRE_SAFETY]: 1,
    [SafetyCategory.ELECTRICAL_SAFETY]: 1,
    [SafetyCategory.CHEMICAL_SAFETY]: 1,
    [SafetyCategory.STRUCTURAL_SAFETY]: 1,
    [SafetyCategory.PERSONAL_PROTECTION]: 1,
    [SafetyCategory.EMERGENCY_RESPONSE]: 1,
    [SafetyCategory.ENVIRONMENTAL_SAFETY]: 1,
    [SafetyCategory.TRAINING_EDUCATION]: 1
  },
  safetyLevelCounts: {
    [SafetyLevel.LOW]: 1,
    [SafetyLevel.MEDIUM]: 3,
    [SafetyLevel.HIGH]: 3,
    [SafetyLevel.CRITICAL]: 3
  },
  miningTypeCounts: {
    [MiningType.COAL]: 4,
    [MiningType.METAL]: 3,
    [MiningType.NON_METAL]: 2,
    [MiningType.OPEN_PIT]: 1
  },
  recentUploads: 3,
  lastUpdateTime: '2024-08-05T16:30:00Z'
};

// 安全类别中文映射
export const safetyCategoryLabels: Record<SafetyCategory, string> = {
  [SafetyCategory.GAS_SAFETY]: '瓦斯安全',
  [SafetyCategory.MECHANICAL_SAFETY]: '机械安全',
  [SafetyCategory.FIRE_SAFETY]: '消防安全',
  [SafetyCategory.ELECTRICAL_SAFETY]: '电气安全',
  [SafetyCategory.CHEMICAL_SAFETY]: '化学安全',
  [SafetyCategory.STRUCTURAL_SAFETY]: '结构安全',
  [SafetyCategory.PERSONAL_PROTECTION]: '个人防护',
  [SafetyCategory.EMERGENCY_RESPONSE]: '应急响应',
  [SafetyCategory.ENVIRONMENTAL_SAFETY]: '环境安全',
  [SafetyCategory.TRAINING_EDUCATION]: '培训教育'
};

// 安全等级中文映射
export const safetyLevelLabels: Record<SafetyLevel, string> = {
  [SafetyLevel.LOW]: '低风险',
  [SafetyLevel.MEDIUM]: '中等风险',
  [SafetyLevel.HIGH]: '高风险',
  [SafetyLevel.CRITICAL]: '极高风险'
};

// 矿区类型中文映射
export const miningTypeLabels: Record<MiningType, string> = {
  [MiningType.COAL]: '煤矿',
  [MiningType.METAL]: '金属矿',
  [MiningType.NON_METAL]: '非金属矿',
  [MiningType.OPEN_PIT]: '露天矿'
};

// 语言类型中文映射
export const languageTypeLabels: Record<LanguageType, string> = {
  [LanguageType.CHINESE]: '中文',
  [LanguageType.ENGLISH]: '英文',
  [LanguageType.BILINGUAL]: '双语',
  [LanguageType.MULTILINGUAL]: '多语言'
};

// 访问权限中文映射
export const accessLevelLabels: Record<AccessLevel, string> = {
  [AccessLevel.PUBLIC]: '公开',
  [AccessLevel.INTERNAL]: '内部',
  [AccessLevel.RESTRICTED]: '受限'
};

// 简化的安全数据类型（用于数据管理功能）
export interface SafetyData {
  id: string;
  title: string;
  description: string;
  safetyLevel: 'low' | 'medium' | 'high' | 'critical';
  mineType: 'coal' | 'metal' | 'nonmetal' | 'openpit';
  category: 'gas_detection' | 'equipment_safety' | 'emergency_response' | 'safety_training' | 'accident_prevention' | 'environmental_protection';
  publishDate: string;
  viewCount: number;
  downloadUrl?: string;
  fileSize?: number;
  fileType?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// 模拟安全数据（用于数据管理功能）
export const mockSafetyData: SafetyData[] = [
  {
    id: 'sd_001',
    title: '煤矿瓦斯检测技术规范',
    description: '详细介绍煤矿瓦斯检测的技术要求、操作规程和安全标准，包括检测设备的使用方法和数据分析。',
    safetyLevel: 'critical',
    mineType: 'coal',
    category: 'gas_detection',
    publishDate: '2024-01-15T00:00:00Z',
    viewCount: 1250,
    downloadUrl: 'https://example.com/documents/gas-detection-standard.pdf',
    fileSize: 2048576,
    fileType: 'pdf',
    tags: ['瓦斯', '检测', '安全规范'],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'sd_002',
    title: '矿山机械设备安全操作手册',
    description: '涵盖各类矿山机械设备的安全操作要点、维护保养和故障处理方法。',
    safetyLevel: 'high',
    mineType: 'metal',
    category: 'equipment_safety',
    publishDate: '2024-01-10T00:00:00Z',
    viewCount: 890,
    downloadUrl: 'https://example.com/documents/equipment-safety-manual.pdf',
    fileSize: 3145728,
    fileType: 'pdf',
    tags: ['机械设备', '安全操作', '维护'],
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    id: 'sd_003',
    title: '矿区应急预案制定指南',
    description: '指导矿区制定完善的应急预案，包括事故预防、应急响应和救援措施。',
    safetyLevel: 'critical',
    mineType: 'coal',
    category: 'emergency_response',
    publishDate: '2024-01-05T00:00:00Z',
    viewCount: 1456,
    downloadUrl: 'https://example.com/documents/emergency-plan-guide.pdf',
    fileSize: 1572864,
    fileType: 'pdf',
    tags: ['应急预案', '事故预防', '救援'],
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  },
  {
    id: 'sd_004',
    title: '安全培训教材汇编',
    description: '矿区安全培训的标准教材，包括理论知识和实践操作指导。',
    safetyLevel: 'medium',
    mineType: 'nonmetal',
    category: 'safety_training',
    publishDate: '2023-12-20T00:00:00Z',
    viewCount: 678,
    downloadUrl: 'https://example.com/documents/safety-training-materials.pdf',
    fileSize: 4194304,
    fileType: 'pdf',
    tags: ['安全培训', '教材', '理论实践'],
    createdAt: '2023-12-20T00:00:00Z',
    updatedAt: '2023-12-20T00:00:00Z'
  },
  {
    id: 'sd_005',
    title: '事故预防与风险评估方法',
    description: '介绍矿区事故预防的科学方法和风险评估技术，提高安全管理水平。',
    safetyLevel: 'high',
    mineType: 'openpit',
    category: 'accident_prevention',
    publishDate: '2023-12-15T00:00:00Z',
    viewCount: 923,
    downloadUrl: 'https://example.com/documents/accident-prevention-methods.pdf',
    fileSize: 2621440,
    fileType: 'pdf',
    tags: ['事故预防', '风险评估', '安全管理'],
    createdAt: '2023-12-15T00:00:00Z',
    updatedAt: '2023-12-15T00:00:00Z'
  }
];

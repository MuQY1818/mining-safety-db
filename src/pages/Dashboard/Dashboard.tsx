// 主数据展示页面
import React, { useState, useEffect } from 'react';
import {
  Layout,
  Card,
  Row,
  Col,

  Button,
  Space,
  Typography,
  message,
  Badge,

} from 'antd';
import {
  PlusOutlined,
  DownloadOutlined,
  BarChartOutlined,
  FileTextOutlined,
  SafetyOutlined,

  RiseOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import DataTable from '../../components/DataTable/DataTable';
import SearchFilters from '../../components/Search/SearchFilters';
import {
  MiningLanguageItem,
  SearchParams,
  DatabaseStats,
  SafetyLevel
} from '../../types/database';
import { 
  mockMiningLanguageItems, 
  mockDatabaseStats,
  safetyLevelLabels 
} from '../../data/mockData';
import { MINING_BLUE_COLORS } from '../../config/theme';

const { Content } = Layout;
const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  // 状态管理
  const [data, setData] = useState<MiningLanguageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    page: 1,
    pageSize: 20,
    sortBy: 'updatedAt',
    sortOrder: 'desc'
  });

  // 模拟数据加载
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.page, searchParams.pageSize, searchParams.keyword, searchParams.category, searchParams.safetyLevel, searchParams.miningType, searchParams.languageType, searchParams.accessLevel, searchParams.standardCode, searchParams.authorName, searchParams.sortBy, searchParams.sortOrder]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500));

      // 模拟筛选、分页和排序
      const { page, pageSize, sortBy, sortOrder, keyword, category, safetyLevel, miningType, languageType, accessLevel, standardCode, authorName } = searchParams;
      let filteredData = [...mockMiningLanguageItems];

      // 筛选逻辑
      if (keyword) {
        const lowerKeyword = keyword.toLowerCase();
        filteredData = filteredData.filter(item =>
          item.title.toLowerCase().includes(lowerKeyword) ||
          item.description?.toLowerCase().includes(lowerKeyword) ||
          item.keywords.some(k => k.toLowerCase().includes(lowerKeyword))
        );
      }

      if (category) {
        filteredData = filteredData.filter(item => item.category === category);
      }

      if (safetyLevel) {
        filteredData = filteredData.filter(item => item.safetyLevel === safetyLevel);
      }

      if (miningType) {
        filteredData = filteredData.filter(item => item.miningType === miningType);
      }

      if (languageType) {
        filteredData = filteredData.filter(item => item.languageType === languageType);
      }

      if (accessLevel) {
        filteredData = filteredData.filter(item => item.accessLevel === accessLevel);
      }

      if (standardCode) {
        filteredData = filteredData.filter(item =>
          item.standardCode?.toLowerCase().includes(standardCode.toLowerCase())
        );
      }

      if (authorName) {
        filteredData = filteredData.filter(item =>
          item.authorName?.toLowerCase().includes(authorName.toLowerCase())
        );
      }

      // 排序
      if (sortBy) {
        filteredData.sort((a, b) => {
          let aValue: any = a[sortBy as keyof MiningLanguageItem];
          let bValue: any = b[sortBy as keyof MiningLanguageItem];

          if (sortBy === 'updatedAt' || sortBy === 'createdAt') {
            aValue = new Date(aValue as string).getTime();
            bValue = new Date(bValue as string).getTime();
          }

          if (aValue === undefined || aValue === null) aValue = '';
          if (bValue === undefined || bValue === null) bValue = '';

          if (sortOrder === 'desc') {
            return bValue > aValue ? 1 : -1;
          }
          return aValue > bValue ? 1 : -1;
        });
      }

      // 更新总数（用于分页）
      const totalFiltered = filteredData.length;

      // 分页
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      setData(paginatedData);

      // 更新搜索参数中的总数
      setSearchParams(prev => ({ ...prev, total: totalFiltered }));

    } catch (error) {
      message.error('数据加载失败');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 300));
      setStats(mockDatabaseStats);
    } catch (error) {
      console.error('统计数据加载失败:', error);
    }
  };

  // 搜索处理
  const handleSearch = (filters: Partial<SearchParams>) => {
    setSearchParams(prev => ({
      ...prev,
      ...filters,
      page: 1 // 重置到第一页
    }));
  };

  // 分页处理
  const handlePaginationChange = (page: number, pageSize: number) => {
    setSearchParams(prev => ({
      ...prev,
      page,
      pageSize
    }));
  };

  // 表格操作处理
  const handleEdit = (record: MiningLanguageItem) => {
    message.info(`编辑: ${record.title}`);
    // TODO: 跳转到编辑页面
  };

  const handleDelete = (record: MiningLanguageItem) => {
    message.success(`删除成功: ${record.title}`);
    // TODO: 调用删除API
    loadData();
  };

  const handleDownload = (record: MiningLanguageItem) => {
    message.info(`下载: ${record.title}`);
    // TODO: 实现文件下载
    window.open(record.downloadUrl, '_blank');
  };

  const handlePreview = (record: MiningLanguageItem) => {
    message.info(`预览: ${record.title}`);
    // TODO: 打开预览模态框
  };

  const handleAIAnalyze = (record: MiningLanguageItem) => {
    message.info(`AI解读: ${record.title}`);
    // TODO: 跳转到AI分析页面
  };

  const handleAddNew = () => {
    message.info('跳转到添加页面');
    // TODO: 跳转到添加页面
  };

  const handleExport = () => {
    message.info('导出数据');
    // TODO: 实现数据导出
  };



  return (
    <Layout style={{
      minHeight: '100vh',
      background: '#ffffff'
    }}>
      <Content style={{ padding: '24px', background: '#ffffff' }}>
        {/* 页面标题 */}
        <div style={{
          marginBottom: 32,
          padding: '32px 0',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <Title level={1} style={{
                margin: 0,
                color: '#1f2937',
                fontSize: '2rem',
                fontWeight: '700',
                marginBottom: '8px'
              }}>
                <SafetyOutlined style={{
                  marginRight: 16,
                  color: MINING_BLUE_COLORS.primary,
                  fontSize: '2rem'
                }} />
                矿区安全语言资料数据库
              </Title>
              <Text style={{
                fontSize: '16px',
                color: '#6b7280'
              }}>
                专业的矿区安全知识资源管理平台
              </Text>
            </div>

            {/* 状态指示器和操作按钮 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => window.location.href = '/data-management'}
                size="large"
              >
                数据管理
              </Button>
              <Badge status="processing" text="系统运行正常" />
              <Badge status="success" text="数据同步完成" />
            </div>
          </div>
        </div>

        {/* 统计卡片 */}
        {stats && (
          <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
            {/* 总资料数卡片 */}
            <Col flex="1" style={{ minWidth: 0 }}>
              <Card
                style={{
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  background: '#ffffff'
                }}
                bodyStyle={{ padding: '24px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      marginBottom: '8px',
                      fontWeight: '500'
                    }}>
                      总资料数
                    </div>
                    <div style={{
                      fontSize: '32px',
                      fontWeight: '700',
                      color: '#1f2937',
                      lineHeight: '1'
                    }}>
                      {stats.totalItems.toLocaleString()}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#10b981',
                      marginTop: '8px',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <RiseOutlined style={{ marginRight: '4px' }} /> +12%
                    </div>
                  </div>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: `${MINING_BLUE_COLORS.primary}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FileTextOutlined style={{
                      fontSize: '24px',
                      color: MINING_BLUE_COLORS.primary
                    }} />
                  </div>
                </div>
              </Card>
            </Col>

            {/* 安全等级统计卡片 */}
            {Object.entries(stats.safetyLevelCounts).map(([level, count], index) => {
              const colors = ['#10b981', '#f59e0b', '#f97316', '#ef4444'];
              const bgColors = ['#10b98115', '#f59e0b15', '#f9731615', '#ef444415'];
              const icons = ['🟢', '🟡', '🟠', '🔴'];

              return (
                <Col flex="1" style={{ minWidth: 0 }} key={level}>
                  <Card
                    style={{
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      background: '#ffffff'
                    }}
                    bodyStyle={{ padding: '24px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{
                          fontSize: '14px',
                          color: '#6b7280',
                          marginBottom: '8px',
                          fontWeight: '500'
                        }}>
                          {icons[index]} {safetyLevelLabels[level as SafetyLevel]}
                        </div>
                        <div style={{
                          fontSize: '32px',
                          fontWeight: '700',
                          color: colors[index],
                          lineHeight: '1'
                        }}>
                          {count}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#6b7280',
                          marginTop: '8px'
                        }}>
                          {((count / stats.totalItems) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: bgColors[index],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px'
                      }}>
                        {icons[index]}
                      </div>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}

        {/* 搜索筛选 */}
        <SearchFilters
          onSearch={handleSearch}
          loading={loading}
          initialValues={searchParams}
        />

        {/* 操作栏 */}
        <Card
          style={{
            marginBottom: 24,
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            background: '#ffffff'
          }}
          bodyStyle={{ padding: '20px 24px' }}
        >
          <Row justify="space-between" align="middle">
            <Col>
              <Space size="middle">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddNew}
                  style={{
                    backgroundColor: MINING_BLUE_COLORS.primary,
                    borderColor: MINING_BLUE_COLORS.primary
                  }}
                >
                  添加资料
                </Button>

                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleExport}
                >
                  导出数据
                </Button>

                <Button
                  icon={<BarChartOutlined />}
                >
                  统计分析
                </Button>
              </Space>
            </Col>
            <Col>
              <Text type="secondary" style={{ fontSize: '14px' }}>
                <ClockCircleOutlined style={{ marginRight: 8, color: MINING_BLUE_COLORS.secondary }} />
                最后更新: {stats ? new Date(stats.lastUpdateTime).toLocaleString('zh-CN') : '-'}
              </Text>
            </Col>
          </Row>
        </Card>

        {/* 数据表格 */}
        <DataTable
          data={data}
          loading={loading}
          pagination={{
            current: searchParams.page,
            pageSize: searchParams.pageSize,
            total: searchParams.total || mockMiningLanguageItems.length,
            onChange: handlePaginationChange,
          }}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDownload={handleDownload}
          onPreview={handlePreview}
          onAIAnalyze={handleAIAnalyze}
        />
      </Content>
    </Layout>
  );
};

export default Dashboard;

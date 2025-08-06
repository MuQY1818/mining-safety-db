// 主页面 - 数据库展示
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Input, 
  Select, 
  Button, 
  Space, 
  Tag, 
  Typography, 
  Row, 
  Col,
  Statistic,
  Tooltip,
  message
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  DownloadOutlined, 
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  RobotOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { MiningLanguageItem, SearchParams, SafetyLevel } from '../../types/database';
import { getSafetyLevelColor, getSafetyLevelIcon } from '../../config/theme';

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<MiningLanguageItem[]>([]);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    page: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const navigate = useNavigate();

  // 模拟数据
  const mockData: MiningLanguageItem[] = [
    {
      id: 1,
      title: '煤矿瓦斯安全操作手册',
      category: '瓦斯安全',
      downloadUrl: 'https://example.com/files/gas-safety-manual.pdf',
      description: '详细介绍煤矿瓦斯检测和防护措施的标准化操作手册',
      safetyLevel: SafetyLevel.HIGH,
      miningType: '煤矿',
      languageType: '中文',
      standardCode: 'AQ1029-2019',
      keywords: ['瓦斯', '安全', '检测', '防护'],
      createdAt: '2024-01-15T08:30:00Z',
      updatedAt: '2024-01-15T08:30:00Z',
      fileSize: 2048576,
      fileType: 'PDF',
      accessLevel: 'PUBLIC' as any
    },
    {
      id: 2,
      title: '金属矿山机械安全规程',
      category: '机械安全',
      downloadUrl: 'https://example.com/files/mechanical-safety.pdf',
      description: '金属矿山机械设备安全操作和维护规程',
      safetyLevel: SafetyLevel.MEDIUM,
      miningType: '金属矿',
      languageType: '中文',
      standardCode: 'GB16423-2020',
      keywords: ['机械', '安全', '维护', '操作'],
      createdAt: '2024-01-10T10:15:00Z',
      updatedAt: '2024-01-10T10:15:00Z',
      fileSize: 1536000,
      fileType: 'PDF',
      accessLevel: 'PUBLIC' as any
    }
  ];

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const loadData = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      setData(mockData);
      setTotal(mockData.length);
    } catch (error) {
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchParams(prev => ({
      ...prev,
      keyword: value,
      page: 1
    }));
  };

  const handleFilterChange = (field: string, value: any) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value,
      page: 1
    }));
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setSearchParams(prev => ({
      ...prev,
      page: pagination.current,
      pageSize: pagination.pageSize,
      sortBy: sorter.field,
      sortOrder: sorter.order === 'ascend' ? 'asc' : 'desc'
    }));
  };

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (text: string, record: MiningLanguageItem) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.standardCode}
          </Text>
        </div>
      ),
    },
    {
      title: '安全类别',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: string) => (
        <Tag color="blue">{category}</Tag>
      ),
    },
    {
      title: '安全等级',
      dataIndex: 'safetyLevel',
      key: 'safetyLevel',
      width: 120,
      render: (level: SafetyLevel) => (
        <Tag 
          color={getSafetyLevelColor(level)}
          style={{ color: 'white' }}
        >
          {getSafetyLevelIcon(level)} {level}
        </Tag>
      ),
    },
    {
      title: '矿区类型',
      dataIndex: 'miningType',
      key: 'miningType',
      width: 100,
    },
    {
      title: '语言类型',
      dataIndex: 'languageType',
      key: 'languageType',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      sorter: true,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_: any, record: MiningLanguageItem) => (
        <Space size="small">
          <Tooltip title="下载">
            <Button 
              type="text" 
              icon={<DownloadOutlined />} 
              size="small"
              onClick={() => window.open(record.downloadUrl)}
            />
          </Tooltip>
          <Tooltip title="预览">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              size="small"
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => navigate(`/edit-data/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="AI解读">
            <Button 
              type="text" 
              icon={<RobotOutlined />} 
              size="small"
              onClick={() => navigate('/ai-chat', { state: { relatedItem: record } })}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button 
              type="text" 
              icon={<DeleteOutlined />} 
              size="small"
              danger
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总资料数"
              value={156}
              valueStyle={{ color: '#1e3a8a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="高风险资料"
              value={23}
              valueStyle={{ color: '#dc2626' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="本月新增"
              value={12}
              valueStyle={{ color: '#16a34a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="AI问答次数"
              value={89}
              valueStyle={{ color: '#3b82f6' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容卡片 */}
      <Card>
        {/* 标题和添加按钮 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 24 
        }}>
          <Title level={4} style={{ margin: 0 }}>
            矿区安全语言资料库
          </Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => navigate('/add-data')}
          >
            添加资料
          </Button>
        </div>

        {/* 搜索和筛选区域 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Search
              placeholder="搜索标题、关键词、标准编码..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="安全类别"
              allowClear
              style={{ width: '100%' }}
              size="large"
              onChange={(value) => handleFilterChange('category', value)}
            >
              <Option value="瓦斯安全">瓦斯安全</Option>
              <Option value="机械安全">机械安全</Option>
              <Option value="电气安全">电气安全</Option>
              <Option value="消防安全">消防安全</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="安全等级"
              allowClear
              style={{ width: '100%' }}
              size="large"
              onChange={(value) => handleFilterChange('safetyLevel', value)}
            >
              <Option value="CRITICAL">🔴 极高风险</Option>
              <Option value="HIGH">🟠 高风险</Option>
              <Option value="MEDIUM">🟡 中等风险</Option>
              <Option value="LOW">🟢 低风险</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="矿区类型"
              allowClear
              style={{ width: '100%' }}
              size="large"
              onChange={(value) => handleFilterChange('miningType', value)}
            >
              <Option value="煤矿">煤矿</Option>
              <Option value="金属矿">金属矿</Option>
              <Option value="非金属矿">非金属矿</Option>
              <Option value="露天矿">露天矿</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="语言类型"
              allowClear
              style={{ width: '100%' }}
              size="large"
              onChange={(value) => handleFilterChange('languageType', value)}
            >
              <Option value="中文">中文</Option>
              <Option value="英文">英文</Option>
              <Option value="中英对照">中英对照</Option>
            </Select>
          </Col>
        </Row>

        {/* 数据表格 */}
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={{
            current: searchParams.page,
            pageSize: searchParams.pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
};

export default DashboardPage;

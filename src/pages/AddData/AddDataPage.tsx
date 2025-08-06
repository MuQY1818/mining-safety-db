// 添加数据页面
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layout,
  Card,
  Typography,
  Breadcrumb,
  Space,
  message
} from 'antd';
import {
  HomeOutlined,
  PlusOutlined,
  DatabaseOutlined
} from '@ant-design/icons';
import DataForm from '../../components/DataManagement/DataForm';
import { useSafetyDataStore } from '../../store/safetyDataStore';
import { SafetyData } from '../../types/safety';
import { MINING_BLUE_COLORS } from '../../config/theme';

const { Content } = Layout;
const { Title } = Typography;

const AddDataPage: React.FC = () => {
  const navigate = useNavigate();
  const { addData } = useSafetyDataStore();

  // 处理表单提交
  const handleSubmit = async (formData: Partial<SafetyData>) => {
    try {
      await addData(formData as Omit<SafetyData, 'id'>);
      message.success('添加成功！');
      navigate('/'); // 返回主页
    } catch (error) {
      throw error; // 让表单组件处理错误
    }
  };

  // 处理取消
  const handleCancel = () => {
    navigate('/');
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#ffffff' }}>
      <Content style={{ padding: '24px' }}>
        {/* 面包屑导航 */}
        <Breadcrumb
          style={{ marginBottom: 24 }}
          items={[
            {
              href: '/',
              title: (
                <Space>
                  <HomeOutlined />
                  <span>首页</span>
                </Space>
              ),
            },
            {
              title: (
                <Space>
                  <PlusOutlined />
                  <span>添加数据</span>
                </Space>
              ),
            },
          ]}
        />

        {/* 页面标题 */}
        <div style={{ marginBottom: 24, textAlign: 'center' }}>
          <Title level={2} style={{ color: MINING_BLUE_COLORS.primary, margin: 0 }}>
            添加安全资料
          </Title>
          <p style={{ color: '#666', marginTop: 8 }}>
            请填写完整的资料信息，确保数据的准确性和完整性
          </p>
        </div>

        {/* 表单卡片 */}
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Card
            style={{
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <DataForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default AddDataPage;

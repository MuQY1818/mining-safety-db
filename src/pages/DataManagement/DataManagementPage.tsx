// 数据管理页面
import React, { useEffect } from 'react';
import { Layout, Breadcrumb, Space } from 'antd';
import { HomeOutlined, DatabaseOutlined } from '@ant-design/icons';
import DataManagement from '../../components/DataManagement/DataManagement';
import { useSafetyDataStore } from '../../store/safetyDataStore';
import { MINING_BLUE_COLORS } from '../../config/theme';

const { Content } = Layout;

const DataManagementPage: React.FC = () => {
  const { fetchData } = useSafetyDataStore();

  // 页面加载时获取数据
  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
                  <DatabaseOutlined />
                  <span>数据管理</span>
                </Space>
              ),
            },
          ]}
        />

        {/* 数据管理组件 */}
        <DataManagement />
      </Content>
    </Layout>
  );
};

export default DataManagementPage;

// 主布局组件
import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space, Typography, Badge } from 'antd';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  DatabaseOutlined,
  PlusOutlined,
  MessageOutlined,
  BulbOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { MINING_BLUE_COLORS } from '../../config/theme';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  // 菜单项配置
  const menuItems = [
    {
      key: '/',
      icon: <DatabaseOutlined />,
      label: '数据库',
    },
    {
      key: '/add-data',
      icon: <PlusOutlined />,
      label: '添加数据',
    },
    {
      key: '/ai-chat',
      icon: <MessageOutlined />,
      label: 'AI问答',
    },
    {
      key: '/feedback',
      icon: <BulbOutlined />,
      label: '用户建议',
    },
  ];

  // 用户菜单
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        logout();
        navigate('/login');
      },
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          background: MINING_BLUE_COLORS.background.card,
          borderRight: `1px solid ${MINING_BLUE_COLORS.border.light}`,
        }}
      >
        {/* Logo区域 */}
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? 0 : '0 16px',
          borderBottom: `1px solid ${MINING_BLUE_COLORS.border.light}`,
        }}>
          {!collapsed ? (
            <Space>
              <div style={{
                width: 32,
                height: 32,
                background: MINING_BLUE_COLORS.primary,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
              }}>
                矿
              </div>
              <div>
                <Title level={5} style={{ margin: 0, color: MINING_BLUE_COLORS.primary }}>
                  矿大安全数据库
                </Title>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  语言景观视域研究
                </Text>
              </div>
            </Space>
          ) : (
            <div style={{
              width: 32,
              height: 32,
              background: MINING_BLUE_COLORS.primary,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
            }}>
              矿
            </div>
          )}
        </div>

        {/* 菜单 */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{
            border: 'none',
            background: 'transparent',
          }}
        />
      </Sider>

      {/* 主内容区 */}
      <Layout>
        {/* 顶部导航栏 */}
        <Header style={{
          padding: '0 16px',
          background: MINING_BLUE_COLORS.background.card,
          borderBottom: `1px solid ${MINING_BLUE_COLORS.border.light}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* 左侧：折叠按钮和标题 */}
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            <Title level={4} style={{ margin: 0, color: MINING_BLUE_COLORS.text.primary }}>
              语言景观视域下矿区语言安全研究及多模态数据库建设
            </Title>
          </Space>

          {/* 右侧：用户信息 */}
          <Space>
            {/* AI状态指示 */}
            <Badge status="success" text="AI在线" />
            
            {/* 用户头像和菜单 */}
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar 
                  size="small" 
                  style={{ 
                    backgroundColor: MINING_BLUE_COLORS.primary 
                  }}
                >
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
                <Text>{user?.username || '用户'}</Text>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        {/* 内容区域 */}
        <Content style={{
          margin: '16px',
          padding: '24px',
          background: MINING_BLUE_COLORS.background.card,
          borderRadius: 8,
          minHeight: 'calc(100vh - 112px)',
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;

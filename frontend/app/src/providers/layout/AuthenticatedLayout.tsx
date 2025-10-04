import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Divider, Layout } from 'antd';
import { Link, Outlet } from 'react-router';
import { SignOutButton, useUser } from '@clerk/react-router';
import SidebarLinks from '../../components/SidebarLinks';

const { Content, Footer, Sider } = Layout;

const siderStyle: React.CSSProperties = {
    height: '100vh',
    position: 'sticky',
    insetInlineStart: 0,
    top: 0,
    scrollbarWidth: 'thin',
    scrollbarGutter: 'stable',
    background: 'linear-gradient(180deg, #00674f 0%, #0a8f6b 50%, #00674f 100%)',
    boxShadow: '2px 0 20px rgba(0, 103, 79, 0.1)',
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
};

const AuthenticatedLayout: React.FC = () => {
    const { isSignedIn, user } = useUser();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* Sidebar Container */}
            <Sider style={siderStyle} role="navigation" aria-label="Main sidebar navigation">
                {/* Logo and Title Container */}
                <div className="logo-container flex flex-column align-items-center justify-content-center py-4 px-3">
                    <Link
                        to="/"
                        className="text-decoration-none d-flex align-items-center gap-3 my-auto p-3 rounded-4 transition-all hover-lift"
                        style={{
                            background: 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                        }}
                    >
                        <div className="position-relative">
                            <img
                                src="/logo.png"
                                alt="EZRA Logo"
                                className="logo-image bg-white rounded-4 shadow-sm transition-all"
                                width={44}
                                height={44}
                                style={{
                                    filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1))',
                                }}
                            />
                            <div
                                className="position-absolute top-0 start-0 w-100 h-100 rounded-4"
                                style={{
                                    background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
                                    animation: 'gentle-float 3s ease-in-out infinite',
                                }}
                            />
                        </div>
                        <h2
                            className="logo-title text-white my-0 fw-bold text-center"
                            style={{
                                fontSize: '1.5rem',
                                letterSpacing: '-0.025em',
                                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                            }}
                        >
                            EZRA
                        </h2>
                    </Link>
                    <Divider
                        className="my-4 opacity-50"
                        style={{
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            borderWidth: '1px 0 0 0',
                            boxShadow: '0 1px 0 rgba(255, 255, 255, 0.1)',
                        }}
                    />
                </div>

                {/* Menu Container */}
                <SidebarLinks />
                {/* Avatar and Login Container */}
                <div className="avatar-container position-absolute bottom-0 w-100 pb-4 px-3">
                    {isSignedIn ? (
                        <SignOutButton>
                            <div
                                className="user-card d-flex align-items-center justify-content-center gap-3 p-3 rounded-4 transition-all hover-lift cursor-pointer"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                                }}
                            >
                                <div className="position-relative">
                                    <Avatar
                                        className="avatar-icon shadow-sm"
                                        size={36}
                                        src={user?.imageUrl}
                                        style={{
                                            border: '2px solid rgba(255, 255, 255, 0.3)',
                                        }}
                                    />
                                    <div className="position-absolute -top-1 -right-1 w-3 h-3 bg-success rounded-circle border border-white"></div>
                                </div>
                                <div className="text-start">
                                    <p
                                        className="user-name text-white m-0 fw-medium"
                                        style={{
                                            fontSize: '0.9rem',
                                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                                        }}
                                    >
                                        {user?.firstName || 'User'}
                                    </p>
                                    <p
                                        className="sign-out-text text-white-50 m-0"
                                        style={{
                                            fontSize: '0.75rem',
                                            opacity: 0.8,
                                        }}
                                    >
                                        Click to sign out
                                    </p>
                                </div>
                            </div>
                        </SignOutButton>
                    ) : (
                        <Link to="/auth/sign-in" className="text-decoration-none">
                            <div
                                className="login-card d-flex align-items-center justify-content-center gap-3 p-3 rounded-4 transition-all hover-lift"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                                }}
                            >
                                <p
                                    className="login-text text-white m-0 fw-medium"
                                    style={{
                                        fontSize: '0.95rem',
                                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                                    }}
                                >
                                    Login
                                </p>
                                <div className="position-relative">
                                    <Avatar
                                        className="avatar-icon shadow-sm"
                                        size={36}
                                        icon={<UserOutlined />}
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.2)',
                                            border: '2px solid rgba(255, 255, 255, 0.3)',
                                        }}
                                    />
                                    <div
                                        className="position-absolute top-0 start-0 w-100 h-100 rounded-circle"
                                        style={{
                                            background:
                                                'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
                                            animation: 'gentle-float 3s ease-in-out infinite',
                                        }}
                                    />
                                </div>
                            </div>
                        </Link>
                    )}
                </div>
            </Sider>

            {/* Content Container */}
            <Layout className="main-content-layout">
                <Content className="main-content-area">
                    <Outlet />
                </Content>

                {/* Footer Container */}
                <Footer
                    className="authenticated-footer"
                    style={{
                        textAlign: 'center',
                    }}
                >
                    <nav className="footer-links-group">
                        <Link to="/about" className="footer-link-item">
                            About
                        </Link>
                        <span className="separator">|</span>
                        <Link to="/contact" className="footer-link-item">
                            Contact
                        </Link>
                        <span className="separator">|</span>
                        <Link to="/privacy" className="footer-link-item">
                            Privacy Policy
                        </Link>
                        <span className="separator">|</span>
                        <Link to="/terms" className="footer-link-item">
                            Terms of Service
                        </Link>
                    </nav>
                    <p className="footer-copyright-text">
                        EZRA © {new Date().getFullYear()} &mdash; All Rights Reserved
                    </p>
                </Footer>
            </Layout>
        </Layout>
    );
};

export default AuthenticatedLayout;

import React from 'react';
import { Layout, Menu, theme } from 'antd';
import { Link, Outlet } from 'react-router';
import { SignOutButton } from '@clerk/react-router';
import { useUserRole } from '../../hooks/useUserRole';
import { UpCircleOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

const PreAuthedLayout: React.FC = () => {
    // Use custom hook for user role management
    const { isSignedIn, isAdmin, isTenant } = useUserRole();

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // Right Hand Sidebar Items
    const items = [
        {
            key: '1',
            label: isSignedIn ? (
                <Link className="text-white" to={isAdmin ? '/admin' : '/tenant'}>
                    Dashboard
                </Link>
            ) : (
                <Link className="text-white" to="/">
                    Home
                </Link>
            ),
        },
        {
            key: '2',
            label: isSignedIn ? (
                <SignOutButton>
                    <div className="text-white">Logout</div>
                </SignOutButton>
            ) : (
                <Link to="/auth/sign-in">Login</Link>
            ),
        },
    ];

    return (
        <Layout className="app-layout">
            <Header className="modern-header" role="banner">
                {/* Left Side Nav */}
                <div className="header-left">
                    <Link to="/" className="logo-link" aria-label="Go to EZRA homepage">
                        <div className="logo-container">
                            <img src="/logo.png" alt="EZRA Logo" className="logo-image" />
                            <div className="logo-glow" aria-hidden="true" />
                        </div>
                    </Link>
                </div>

                {/* Center Nav */}
                <nav className="header-center" aria-label="Main navigation">
                    <Link to="/" className="brand-link" aria-label="EZRA brand homepage">
                        <span className="brand-text">EZRA</span>
                        <div className="brand-accent" aria-hidden="true" />
                        <div className="brand-glow" aria-hidden="true" />
                    </Link>
                </nav>

                {/* Top right Nav */}
                <nav className="header-right" aria-label="User navigation">
                    <Menu
                        mode="horizontal"
                        className="header-menu"
                        items={items.map((item) => ({
                            ...item,
                            className: 'header-menu-item',
                        }))}
                        aria-label="User menu"
                    />
                </nav>
            </Header>
            <main role="main" id="main-content">
                <Content>
                    <div
                        className="main-content-container fade-in-content"
                        style={{
                            minHeight: 380,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                            position: 'relative',
                            animation: 'fade-in-content 0.8s ease-out',
                        }}
                    >
                        {/* Subtle background pattern for depth */}
                        <div
                            className="content-bg-pattern"
                            style={{
                                position: 'absolute',
                                inset: 0,
                                opacity: 0.02,
                                backgroundImage:
                                    'radial-gradient(circle at 25% 25%, rgba(0, 103, 79, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(119, 137, 244, 0.1) 0%, transparent 50%)',
                                borderRadius: borderRadiusLG,
                                pointerEvents: 'none',
                            }}
                        />
                        {/* Outlet is a React Router component to help present what shows up from the main.tsx children routes */}
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <Outlet />
                        </div>
                    </div>
                </Content>
            </main>

            {/* Call to Action Section */}
            <section className="call-to-action-section">
                <div className="container">
                    <div className="call-to-action-content">
                        <h2 className="call-to-action-title">Ready for Modern Living?</h2>
                        <p className="call-to-action-description">
                            Join EZRA Apartments today and experience the future of apartment management.
                        </p>
                        <Link to="/auth/sign-in" className="call-to-action-button">
                            Get Started Now
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer Container */}
            <Footer className="modern-footer" role="contentinfo">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <div className="footer-logo-container">
                                <img src="/logo.png" alt="EZRA Logo" className="footer-logo" />
                                <div className="footer-logo-glow" />
                            </div>
                            <h3 className="footer-brand-text">EZRA</h3>
                            <p className="footer-tagline">Modern apartment management made simple</p>
                        </div>

                        <div className="footer-links">
                            <div className="footer-link-group">
                                <h4 className="footer-link-title">Company</h4>
                                <div className="footer-links-list">
                                    <Link to="/about" className="footer-link disabled-link">
                                        About Us
                                    </Link>
                                    <Link to="/contact" className="footer-link disabled-link">
                                        Contact
                                    </Link>
                                </div>
                            </div>

                            <div className="footer-link-group">
                                <h4 className="footer-link-title">Legal</h4>
                                <div className="footer-links-list">
                                    <Link to="/privacy" className="footer-link disabled-link">
                                        Privacy Policy
                                    </Link>
                                    <Link to="/terms" className="footer-link disabled-link">
                                        Terms of Service
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <div className="footer-copyright">
                            <p>© {new Date().getFullYear()} EZRA. All rights reserved.</p>
                        </div>
                        <div className="footer-accent">
                            <div className="accent-line" />
                        </div>
                    </div>
                </div>
            </Footer>

            {/* showBackToTop && (
                <button className="back-to-top-button" onClick={scrollToTop} aria-label="Back to top">
                    <UpCircleOutlined />
                </button>
            ) */}
        </Layout>
    );
};

export default PreAuthedLayout;

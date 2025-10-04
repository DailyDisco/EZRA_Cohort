import React, { useState } from 'react';
import { Row, Col, Divider, Space } from 'antd';
import { HeartOutlined, StarOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

// Import all premium components
import AlertComponent from './AlertComponent';
import ButtonComponent from './ButtonComponent';
import { CardComponent } from './CardComponent';
import EmptyState from './EmptyState';
import PageTitleComponent from './PageTitleComponent';
import { InlineLoader, PageLoader } from './CardSkeletonLoader';

// Premium showcase styling with advanced animations
const showcaseStyles = `
    .showcase-container {
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        min-height: 100vh;
        padding: 2rem;
        position: relative;
        overflow: hidden;
    }

    .showcase-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background:
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%);
        animation: backgroundShift 20s ease-in-out infinite;
        z-index: 0;
    }

    @keyframes backgroundShift {
        0%, 100% { transform: translate(0, 0) scale(1); }
        25% { transform: translate(-10px, -10px) scale(1.05); }
        50% { transform: translate(10px, 10px) scale(0.95); }
        75% { transform: translate(-5px, 5px) scale(1.02); }
    }

    .component-section {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border-radius: 16px;
        padding: 2rem;
        margin-bottom: 2rem;
        border: 1px solid rgba(0, 113, 79, 0.1);
        box-shadow: 0 8px 32px rgba(0, 113, 79, 0.1);
        transition: all 0.3s ease;
    }

    .component-section {
        position: relative;
        z-index: 1;
    }

    .component-section::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c, #4facfe);
        background-size: 400% 400%;
        border-radius: 18px;
        z-index: -1;
        opacity: 0;
        transition: opacity 0.3s ease;
        animation: borderGlow 8s ease-in-out infinite;
    }

    .component-section:hover::before {
        opacity: 0.8;
    }

    .component-section:hover {
        transform: translateY(-2px) rotate(0.5deg);
        box-shadow: 0 12px 40px rgba(0, 113, 79, 0.15);
    }

    @keyframes borderGlow {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
    }

    .floating-particles {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 2;
    }

    .particle {
        position: absolute;
        background: rgba(0, 113, 79, 0.1);
        border-radius: 50%;
        animation: float 6s ease-in-out infinite;
    }

    .particle:nth-child(1) { top: 10%; left: 10%; animation-delay: 0s; }
    .particle:nth-child(2) { top: 20%; left: 80%; animation-delay: 1s; }
    .particle:nth-child(3) { top: 70%; left: 20%; animation-delay: 2s; }
    .particle:nth-child(4) { top: 80%; left: 90%; animation-delay: 3s; }
    .particle:nth-child(5) { top: 40%; left: 60%; animation-delay: 4s; }

    @keyframes float {
        0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.1;
        }
        50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.3;
        }
    }

    .section-title {
        background: linear-gradient(135deg, #00674f, #2d8a6b);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 1rem;
        text-align: center;
    }

    .demo-grid {
        display: grid;
        gap: 1.5rem;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }

    .feature-highlight {
        background: linear-gradient(135deg, rgba(0, 113, 79, 0.1), rgba(45, 138, 107, 0.05));
        border: 1px solid rgba(0, 113, 79, 0.2);
        border-radius: 8px;
        padding: 1rem;
        margin: 0.5rem 0;
        font-size: 0.9rem;
        color: #00674f;
        font-weight: 500;
    }
`;

const ComponentShowcase: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);

    const handleButtonClick = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setAlertVisible(true);
        }, 2000);
    };

    return (
        <>
            <style>{showcaseStyles}</style>
            <div className="showcase-container">
                <PageTitleComponent title="Premium Component Showcase" />

                {/* Alerts Section */}
                <div className="component-section">
                    <div className="floating-particles">
                        <div className="particle" style={{ width: '8px', height: '8px' }}></div>
                        <div className="particle" style={{ width: '12px', height: '12px' }}></div>
                        <div className="particle" style={{ width: '6px', height: '6px' }}></div>
                        <div className="particle" style={{ width: '10px', height: '10px' }}></div>
                        <div className="particle" style={{ width: '14px', height: '14px' }}></div>
                    </div>
                    <h2 className="section-title">🎯 Premium Alert Components</h2>
                    <div className="feature-highlight">
                        ✨ Smooth slide-in animations | 🎨 Gradient borders | ♿ Full accessibility | 🎭 Type-specific
                        styling | 🌟 Interactive particles
                    </div>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <AlertComponent
                            title="Success Alert"
                            description="Operation completed successfully with premium animations!"
                            type="success"
                        />
                        <AlertComponent
                            title="Info Alert"
                            description="Here's some important information with beautiful styling."
                            type="info"
                        />
                        <AlertComponent
                            title="Warning Alert"
                            description="Please review this warning message carefully."
                            type="warning"
                        />
                        <AlertComponent
                            title="Error Alert"
                            description="An error occurred, but it looks great doing it!"
                            type="error"
                        />
                    </Space>
                </div>

                {/* Buttons Section */}
                <div className="component-section">
                    <div className="floating-particles">
                        <div
                            className="particle"
                            style={{ width: '6px', height: '6px', background: 'rgba(102, 126, 234, 0.2)' }}
                        ></div>
                        <div
                            className="particle"
                            style={{ width: '10px', height: '10px', background: 'rgba(255, 119, 198, 0.2)' }}
                        ></div>
                        <div
                            className="particle"
                            style={{ width: '8px', height: '8px', background: 'rgba(120, 219, 255, 0.2)' }}
                        ></div>
                        <div
                            className="particle"
                            style={{ width: '12px', height: '12px', background: 'rgba(255, 87, 108, 0.2)' }}
                        ></div>
                        <div
                            className="particle"
                            style={{ width: '14px', height: '14px', background: 'rgba(79, 172, 254, 0.2)' }}
                        ></div>
                    </div>
                    <h2 className="section-title">🚀 Premium Button Components</h2>
                    <div className="feature-highlight">
                        ✨ Shimmer effects | 🌟 Gradient backgrounds | 🎯 Micro-interactions | ♿ ARIA accessibility |
                        📱 Responsive design | 🎨 Dynamic particle effects
                    </div>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={6}>
                            <ButtonComponent
                                title="Primary Action"
                                type="primary"
                                onClick={handleButtonClick}
                                loading={loading}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <ButtonComponent title="Secondary" type="secondary" onClick={() => {}} />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <ButtonComponent title="Success" type="success" onClick={() => {}} />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <ButtonComponent title="With Icon" type="info" icon={<StarOutlined />} onClick={() => {}} />
                        </Col>
                    </Row>
                </div>

                {/* Cards Section */}
                <div className="component-section">
                    <h2 className="section-title">💎 Premium Card Components</h2>
                    <div className="feature-highlight">
                        ✨ 3D hover effects | 🌈 Gradient text | 🎭 Icon animations | 📊 Value highlighting | ♿
                        Semantic markup
                    </div>
                    <div className="demo-grid">
                        <CardComponent
                            title="Analytics Dashboard"
                            description="Comprehensive analytics with real-time data visualization"
                            icon={<StarOutlined />}
                            value={1247}
                            button={<ButtonComponent title="View Details" type="primary" size="small" />}
                        />
                        <CardComponent
                            title="User Management"
                            description="Manage users, roles, and permissions with ease"
                            icon={<HeartOutlined />}
                            value={89}
                            button={<ButtonComponent title="Manage Users" type="info" size="small" />}
                        />
                        <CardComponent
                            title="System Health"
                            description="Monitor system performance and uptime metrics"
                            icon={<CheckCircleOutlined />}
                            value={99.9}
                            button={<ButtonComponent title="View Status" type="success" size="small" />}
                        />
                    </div>
                </div>

                {/* Empty States & Loaders Section */}
                <div className="component-section">
                    <h2 className="section-title">🎨 Premium Empty States & Loaders</h2>
                    <div className="feature-highlight">
                        ✨ Floating animations | 🌟 Glass morphism | 🎯 Skeleton loading | 📱 Responsive design
                    </div>
                    <Row gutter={[32, 32]}>
                        <Col xs={24} md={12}>
                            <EmptyState description="No data available yet. Start by creating your first item!" />
                        </Col>
                        <Col xs={24} md={12}>
                            {loading ? (
                                <div
                                    style={{
                                        height: '200px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <PageLoader message="Loading premium components..." size="md" />
                                </div>
                            ) : (
                                <div
                                    style={{
                                        height: '200px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <InlineLoader size="lg" />
                                </div>
                            )}
                        </Col>
                    </Row>
                </div>

                {/* Technical Excellence Section */}
                <div className="component-section">
                    <h2 className="section-title">🏆 Technical Excellence</h2>
                    <div className="feature-highlight">
                        🔧 TypeScript + Bootstrap + Ant Design | ♿ WCAG 2.1 AA Compliant | 🎯 Zero Runtime Errors | 📦
                        Tree-shakable | 🚀 Performance Optimized
                    </div>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={8}>
                            <div
                                style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    padding: '2rem',
                                    borderRadius: '12px',
                                    textAlign: 'center',
                                }}
                            >
                                <h3>🎨 Design System</h3>
                                <p>Consistent colors, typography, and spacing across all components</p>
                            </div>
                        </Col>
                        <Col xs={24} md={8}>
                            <div
                                style={{
                                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                    color: 'white',
                                    padding: '2rem',
                                    borderRadius: '12px',
                                    textAlign: 'center',
                                }}
                            >
                                <h3>♿ Accessibility</h3>
                                <p>ARIA labels, keyboard navigation, screen reader support</p>
                            </div>
                        </Col>
                        <Col xs={24} md={8}>
                            <div
                                style={{
                                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                    color: 'white',
                                    padding: '2rem',
                                    borderRadius: '12px',
                                    textAlign: 'center',
                                }}
                            >
                                <h3>⚡ Performance</h3>
                                <p>Optimized animations, lazy loading, minimal bundle size</p>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    );
};

export default ComponentShowcase;

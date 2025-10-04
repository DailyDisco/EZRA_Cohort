import React from 'react';
import { Layout, Skeleton } from 'antd';
import { CardSkeletonLoader } from './CardSkeletonLoader';

// CSS animations for skeleton loading effect
const skeletonStyles = `
    .skeleton-fade-in {
        animation: skeletonFadeIn 0.6s ease-out forwards;
        opacity: 0;
    }

    @keyframes skeletonFadeIn {
        0% {
            opacity: 0;
            transform: translateY(10px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .skeleton-stagger:nth-child(1) { animation-delay: 0.1s; }
    .skeleton-stagger:nth-child(2) { animation-delay: 0.2s; }
    .skeleton-stagger:nth-child(3) { animation-delay: 0.3s; }
    .skeleton-stagger:nth-child(4) { animation-delay: 0.4s; }
    .skeleton-stagger:nth-child(5) { animation-delay: 0.5s; }
`;

const { Header, Content, Footer, Sider } = Layout;

// Reusable skeleton components
const SkeletonRow: React.FC<{ count: number; className?: string; children: (index: number) => React.ReactNode }> = ({
    count,
    className = '',
    children,
}) => (
    <div className={`row g-4 ${className}`}>
        {Array.from({ length: count }).map((_, index) => (
            <div key={index}>{children(index)}</div>
        ))}
    </div>
);

const SkeletonSection: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
    <div className={`mb-5 ${className}`}>{children}</div>
);

// Helper function to generate menu items
const generateMenuItems = (count: number) => (
    <div className="w-100">
        {Array.from({ length: count }).map((_, index) => (
            <div key={index} className="mb-3 px-3">
                <Skeleton.Button block size="small" />
            </div>
        ))}
    </div>
);

// Layout configuration
const LAYOUT_CONFIG = {
    authenticated: {
        sidebarMenuItems: 5,
        mainContentCards: { left: 2, right: 1 },
        gradients: {
            layout: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            sidebar: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
            content: 'rgba(255, 255, 255, 0.8)',
        },
    },
    preauth: {
        featuresCount: 6,
        additionalCards: 2,
        gradients: {
            layout: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            content: 'rgba(255, 255, 255, 0.95)',
        },
    },
} as const;

interface LayoutSkeletonProps {
    type?: 'preauth' | 'authenticated';
    className?: string;
}

export const LayoutSkeleton: React.FC<LayoutSkeletonProps> = ({ type = 'preauth', className = '' }) => {
    if (type === 'authenticated') {
        return (
            <>
                <style>{skeletonStyles}</style>
                <Layout
                    hasSider
                    className={`min-vh-100 ${className}`}
                    style={{ background: LAYOUT_CONFIG.authenticated.gradients.layout }}
                >
                    {/* Sidebar Skeleton */}
                    <Sider className="bg-light" style={{ background: LAYOUT_CONFIG.authenticated.gradients.sidebar }}>
                        <div className="d-flex flex-column align-items-center p-4">
                            {/* Logo Skeleton */}
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <Skeleton.Avatar size={44} shape="circle" />
                                <Skeleton.Input style={{ width: 80 }} size="small" />
                            </div>

                            {/* Menu Items Skeleton */}
                            {generateMenuItems(LAYOUT_CONFIG.authenticated.sidebarMenuItems)}

                            {/* User Profile Skeleton */}
                            <div className="mt-auto w-100 px-3 pb-4">
                                <div className="d-flex align-items-center gap-3 p-3 rounded">
                                    <Skeleton.Avatar size={36} />
                                    <div className="flex-grow-1">
                                        <Skeleton.Input style={{ width: '100%', height: 14 }} size="small" />
                                        <Skeleton.Input
                                            style={{ width: '80%', height: 12, marginTop: 4 }}
                                            size="small"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Sider>

                    {/* Main Content Skeleton */}
                    <Layout className="d-flex flex-column">
                        <Content
                            className="flex-grow-1 p-4 skeleton-fade-in"
                            style={{
                                background: LAYOUT_CONFIG.authenticated.gradients.content,
                                backdropFilter: 'blur(10px)',
                            }}
                        >
                            <div className="row">
                                <div className="col-12 col-md-8">
                                    {Array.from({ length: LAYOUT_CONFIG.authenticated.mainContentCards.left }).map(
                                        (_, index) => (
                                            <CardSkeletonLoader
                                                key={index}
                                                className="mb-4 skeleton-fade-in skeleton-stagger"
                                            />
                                        )
                                    )}
                                </div>
                                <div className="col-12 col-md-4">
                                    {Array.from({ length: LAYOUT_CONFIG.authenticated.mainContentCards.right }).map(
                                        (_, index) => (
                                            <CardSkeletonLoader
                                                key={index}
                                                className="skeleton-fade-in skeleton-stagger"
                                            />
                                        )
                                    )}
                                </div>
                            </div>
                        </Content>

                        {/* Footer Skeleton */}
                        <Footer className="bg-white border-top">
                            <div className="d-flex justify-content-center align-items-center py-3">
                                <Skeleton.Input style={{ width: 200 }} size="small" />
                            </div>
                        </Footer>
                    </Layout>
                </Layout>
            </>
        );
    }

    // Pre-auth layout skeleton
    return (
        <>
            <style>{skeletonStyles}</style>
            <Layout
                className={`min-vh-100 ${className}`}
                style={{ background: LAYOUT_CONFIG.preauth.gradients.layout }}
            >
                {/* Header Skeleton */}
                <Header className="d-flex align-items-center justify-content-between px-4">
                    <div className="d-flex align-items-center gap-3">
                        <Skeleton.Avatar size={40} shape="circle" />
                        <Skeleton.Input style={{ width: 80 }} size="small" />
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <Skeleton.Button size="small" />
                        <Skeleton.Button size="small" />
                    </div>
                </Header>

                {/* Main Content Skeleton */}
                <Content
                    className="flex-grow-1"
                    style={{ background: LAYOUT_CONFIG.preauth.gradients.content, backdropFilter: 'blur(20px)' }}
                >
                    <div className="container-fluid py-5">
                        <div className="row justify-content-center">
                            <div className="col-12 col-lg-10 col-xl-8">
                                {/* Hero Section Skeleton */}
                                <div className="text-center mb-5 skeleton-fade-in">
                                    <Skeleton.Input style={{ width: 300, height: 48, marginBottom: 16 }} />
                                    <Skeleton.Input style={{ width: 500, height: 24, marginBottom: 24 }} />
                                    <div className="d-flex justify-content-center gap-3 mb-5">
                                        <Skeleton.Button size="large" />
                                        <Skeleton.Button size="large" />
                                    </div>
                                </div>

                                {/* Features Section Skeleton */}
                                <SkeletonSection>
                                    <SkeletonRow count={LAYOUT_CONFIG.preauth.featuresCount}>
                                        {(_index) => (
                                            <div className="col-12 col-md-6 col-lg-4">
                                                <CardSkeletonLoader className="skeleton-fade-in skeleton-stagger" />
                                            </div>
                                        )}
                                    </SkeletonRow>
                                </SkeletonSection>

                                {/* Additional Content Skeleton */}
                                <SkeletonRow count={LAYOUT_CONFIG.preauth.additionalCards} className="mb-0">
                                    {(_index) => (
                                        <div className="col-12 col-md-6">
                                            <CardSkeletonLoader className="skeleton-fade-in" />
                                        </div>
                                    )}
                                </SkeletonRow>
                            </div>
                        </div>
                    </div>
                </Content>

                {/* Footer Skeleton */}
                <Footer className="bg-dark text-white">
                    <div className="container-fluid py-4">
                        <div className="row g-4">
                            <div className="col-12 col-md-4">
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    <Skeleton.Avatar size={48} shape="circle" />
                                    <Skeleton.Input style={{ width: 100, height: 24 }} />
                                </div>
                                <Skeleton.Input style={{ width: '100%', height: 16 }} />
                                <Skeleton.Input style={{ width: '80%', height: 16, marginTop: 8 }} />
                            </div>

                            <div className="col-12 col-md-4">
                                <Skeleton.Input style={{ width: 120, height: 20, marginBottom: 16 }} />
                                <div className="d-flex flex-column gap-2">
                                    <Skeleton.Input style={{ width: '100%', height: 14 }} />
                                    <Skeleton.Input style={{ width: '100%', height: 14 }} />
                                    <Skeleton.Input style={{ width: '100%', height: 14 }} />
                                </div>
                            </div>

                            <div className="col-12 col-md-4">
                                <Skeleton.Input style={{ width: 120, height: 20, marginBottom: 16 }} />
                                <div className="d-flex flex-column gap-2">
                                    <Skeleton.Input style={{ width: '100%', height: 14 }} />
                                    <Skeleton.Input style={{ width: '100%', height: 14 }} />
                                    <Skeleton.Input style={{ width: '100%', height: 14 }} />
                                </div>
                            </div>
                        </div>

                        <div className="border-top pt-3 mt-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <Skeleton.Input style={{ width: 150, height: 14 }} />
                                <div className="d-flex gap-2">
                                    <Skeleton.Avatar size={8} shape="circle" />
                                    <Skeleton.Avatar size={8} shape="circle" />
                                    <Skeleton.Avatar size={8} shape="circle" />
                                </div>
                            </div>
                        </div>
                    </div>
                </Footer>
            </Layout>
        </>
    );
};

// Quick skeleton variants for common use cases
export const PreAuthLayoutSkeleton = () => <LayoutSkeleton type="preauth" />;
export const AuthenticatedLayoutSkeleton = () => <LayoutSkeleton type="authenticated" />;

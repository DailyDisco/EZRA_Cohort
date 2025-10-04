import React from 'react';
import { Spin } from 'antd';

// Type definitions
type LoaderSize = 'sm' | 'md' | 'lg';
type SpinSize = 'small' | 'default' | 'large';

// Utility functions for consistent size mappings
const getSpinSize = (size: LoaderSize): SpinSize => {
    const sizeMap: Record<LoaderSize, SpinSize> = {
        sm: 'small',
        md: 'default',
        lg: 'large',
    };
    return sizeMap[size];
};

const getContainerHeight = (size: LoaderSize): string => {
    const heightMap: Record<LoaderSize, string> = {
        sm: 'min-vh-30',
        md: 'min-vh-40',
        lg: 'min-vh-50',
    };
    return heightMap[size];
};

// Base loader props shared across components
interface BaseLoaderProps {
    message?: string;
    className?: string;
    size?: LoaderSize;
}

interface CardSkeletonLoaderProps {
    className?: string;
}

export const CardSkeletonLoader: React.FC<CardSkeletonLoaderProps> = ({ className = '' }) => {
    return (
        <div className={`card p-4 ${className}`} style={{ border: 'none', boxShadow: 'var(--shadow-sm)' }}>
            {/* Header skeleton */}
            <div className="d-flex align-items-center justify-content-between mb-3">
                <div
                    className="skeleton-placeholder"
                    style={{ height: '24px', width: '96px', backgroundColor: '#e2e8f0', borderRadius: '4px' }}
                ></div>
                <div
                    className="skeleton-placeholder"
                    style={{ height: '20px', width: '20px', backgroundColor: '#e2e8f0', borderRadius: '4px' }}
                ></div>
            </div>

            {/* Value skeleton */}
            <div
                className="skeleton-placeholder mb-2"
                style={{ height: '32px', width: '64px', backgroundColor: '#e2e8f0', borderRadius: '4px' }}
            ></div>

            {/* Description skeleton */}
            <div className="mb-3">
                <div
                    className="skeleton-placeholder mb-2"
                    style={{ height: '16px', width: '100%', backgroundColor: '#e2e8f0', borderRadius: '4px' }}
                ></div>
                <div
                    className="skeleton-placeholder"
                    style={{ height: '16px', width: '75%', backgroundColor: '#e2e8f0', borderRadius: '4px' }}
                ></div>
            </div>

            {/* Button skeleton */}
            <div
                className="skeleton-placeholder"
                style={{ height: '32px', width: '100%', backgroundColor: '#e2e8f0', borderRadius: '4px' }}
            ></div>
        </div>
    );
};

interface InlineLoaderProps {
    size?: LoaderSize;
    className?: string;
}

export const InlineLoader: React.FC<InlineLoaderProps> = ({ size = 'md', className = '' }) => {
    return (
        <div className={`d-inline-flex align-items-center justify-content-center ${className}`}>
            <Spin size={getSpinSize(size)} />
        </div>
    );
};

interface PageLoaderProps extends BaseLoaderProps {
    showDots?: boolean;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
    message = 'Loading...',
    className = '',
    size = 'lg',
    showDots = true,
}) => {
    return (
        <div
            className={`d-flex flex-column align-items-center justify-content-center ${getContainerHeight(
                size
            )} ${className}`}
        >
            {/* Ant Design spinner with custom styling */}
            <div className="mb-4">
                <Spin size={getSpinSize(size)} style={{ color: '#00674f' }} />
            </div>

            {/* Loading message */}
            <div className="text-center">
                <h3 className="h5 font-weight-semibold mb-3" style={{ color: '#1e293b' }}>
                    {message}
                </h3>

                {/* Animated dots */}
                {showDots && (
                    <div className="d-flex justify-content-center">
                        <div
                            className="mx-1"
                            style={{
                                width: '8px',
                                height: '8px',
                                backgroundColor: '#00674f',
                                borderRadius: '50%',
                                animation: 'bounce 1.4s infinite ease-in-out both',
                            }}
                        ></div>
                        <div
                            className="mx-1"
                            style={{
                                width: '8px',
                                height: '8px',
                                backgroundColor: '#00674f',
                                borderRadius: '50%',
                                animation: 'bounce 1.4s infinite ease-in-out both 0.1s',
                            }}
                        ></div>
                        <div
                            className="mx-1"
                            style={{
                                width: '8px',
                                height: '8px',
                                backgroundColor: '#00674f',
                                borderRadius: '50%',
                                animation: 'bounce 1.4s infinite ease-in-out both 0.2s',
                            }}
                        ></div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Enhanced version with progress indication
interface ProgressLoaderProps extends BaseLoaderProps {
    progress?: number; // 0-100, clamped internally
    showProgress?: boolean;
}

export const ProgressLoader: React.FC<ProgressLoaderProps> = ({
    message = 'Loading...',
    className = '',
    size = 'lg',
    progress,
    showProgress = false,
}) => {
    // Clamp progress to valid range
    const clampedProgress = progress !== undefined ? Math.max(0, Math.min(100, progress)) : undefined;
    return (
        <div
            className={`d-flex flex-column align-items-center justify-content-center ${getContainerHeight(
                size
            )} ${className}`}
        >
            {/* Enhanced spinner with progress ring */}
            <div className="position-relative mb-4">
                <Spin size={getSpinSize(size)} style={{ color: '#00674f' }} />

                {/* Progress ring overlay */}
                {showProgress && clampedProgress !== undefined && (
                    <div className="position-absolute top-50 start-50 translate-middle">
                        <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
                            <circle cx="40" cy="40" r="35" fill="none" stroke="#e2e8f0" strokeWidth="6" />
                            <circle
                                cx="40"
                                cy="40"
                                r="35"
                                fill="none"
                                stroke="#00674f"
                                strokeWidth="6"
                                strokeDasharray={`${2 * Math.PI * 35}`}
                                strokeDashoffset={`${2 * Math.PI * 35 * (1 - clampedProgress / 100)}`}
                                strokeLinecap="round"
                                style={{ transition: 'stroke-dashoffset 0.3s ease-out' }}
                            />
                        </svg>
                    </div>
                )}
            </div>

            {/* Loading content */}
            <div className="text-center">
                <h3 className="h5 font-weight-semibold mb-3" style={{ color: '#1e293b' }}>
                    {message}
                </h3>

                {showProgress && clampedProgress !== undefined && (
                    <div className="mb-4">
                        <div className="progress mb-2" style={{ height: '8px' }}>
                            <div
                                className="progress-bar"
                                role="progressbar"
                                style={{
                                    width: `${clampedProgress}%`,
                                    backgroundColor: '#00674f',
                                    transition: 'width 0.3s ease-out',
                                }}
                                aria-valuenow={clampedProgress}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            ></div>
                        </div>
                        <small style={{ color: '#64748b' }}>{clampedProgress}%</small>
                    </div>
                )}

                {/* Animated dots */}
                <div className="d-flex justify-content-center">
                    <div
                        className="mx-1"
                        style={{
                            width: '8px',
                            height: '8px',
                            backgroundColor: '#00674f',
                            borderRadius: '50%',
                            animation: 'bounce 1.4s infinite ease-in-out both',
                        }}
                    ></div>
                    <div
                        className="mx-1"
                        style={{
                            width: '8px',
                            height: '8px',
                            backgroundColor: '#00674f',
                            borderRadius: '50%',
                            animation: 'bounce 1.4s infinite ease-in-out both 0.1s',
                        }}
                    ></div>
                    <div
                        className="mx-1"
                        style={{
                            width: '8px',
                            height: '8px',
                            backgroundColor: '#00674f',
                            borderRadius: '50%',
                            animation: 'bounce 1.4s infinite ease-in-out both 0.2s',
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

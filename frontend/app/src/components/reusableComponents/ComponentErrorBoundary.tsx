import React, { Component, ReactNode, ErrorInfo } from 'react';
import { Alert, Button, Result } from 'antd';
import { ExclamationCircleOutlined, ReloadOutlined, BugOutlined } from '@ant-design/icons';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    componentName?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
    retryCount: number;
}

// Premium error boundary styles
const errorBoundaryStyles = `
    .error-boundary-container {
        position: relative;
        min-height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%);
        backdrop-filter: blur(20px);
        border-radius: 16px;
        padding: 2rem;
        border: 1px solid rgba(245, 87, 108, 0.2);
        animation: errorFadeIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .error-boundary-icon {
        font-size: 3rem;
        color: #f5576c;
        margin-bottom: 1rem;
        animation: errorPulse 2s ease-in-out infinite;
    }

    .error-boundary-title {
        color: #1e293b;
        font-weight: 700;
        margin-bottom: 0.5rem;
    }

    .error-boundary-description {
        color: #64748b;
        margin-bottom: 1.5rem;
        text-align: center;
    }

    .error-boundary-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
    }

    .error-boundary-debug {
        background: rgba(0, 0, 0, 0.05);
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        padding: 1rem;
        margin-top: 1rem;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 0.8rem;
        color: #64748b;
        max-height: 200px;
        overflow-y: auto;
    }

    @keyframes errorFadeIn {
        from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    @keyframes errorPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
`;

class ComponentErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            retryCount: 0,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null,
            retryCount: 0,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({
            error,
            errorInfo,
        });

        // Call the optional error handler
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error(`Error in ${this.props.componentName || 'Component'}:`, error, errorInfo);
        }
    }

    handleRetry = () => {
        this.setState((prevState) => ({
            hasError: false,
            error: null,
            errorInfo: null,
            retryCount: prevState.retryCount + 1,
        }));
    };

    handleReportError = () => {
        const { error, errorInfo } = this.state;
        const report = {
            component: this.props.componentName || 'Unknown',
            error: error?.message,
            stack: error?.stack,
            componentStack: errorInfo?.componentStack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            retryCount: this.state.retryCount,
        };

        // In a real app, this would send to an error reporting service
        console.log('Error Report:', report);
        alert('Error report logged to console. In production, this would be sent to your error tracking service.');
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default premium error UI
            const { error, errorInfo, retryCount } = this.state;
            const isDev = process.env.NODE_ENV === 'development';

            return (
                <>
                    <style>{errorBoundaryStyles}</style>
                    <div className="error-boundary-container">
                        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
                            <ExclamationCircleOutlined className="error-boundary-icon" />

                            <h3 className="error-boundary-title">Oops! Something went wrong</h3>

                            <p className="error-boundary-description">
                                {this.props.componentName
                                    ? `The ${this.props.componentName} component encountered an error.`
                                    : 'This component encountered an unexpected error.'}
                                {retryCount > 0 && ` (Retry attempt: ${retryCount})`}
                            </p>

                            <div className="error-boundary-actions">
                                <Button type="primary" icon={<ReloadOutlined />} onClick={this.handleRetry}>
                                    Try Again
                                </Button>

                                <Button icon={<BugOutlined />} onClick={this.handleReportError}>
                                    Report Error
                                </Button>
                            </div>

                            {isDev && error && (
                                <details className="error-boundary-debug">
                                    <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                        Error Details (Development Only)
                                    </summary>
                                    <div>
                                        <strong>Error:</strong> {error.message}
                                        <br />
                                        <strong>Stack:</strong>
                                        <pre
                                            style={{ whiteSpace: 'pre-wrap', fontSize: '0.7rem', marginTop: '0.5rem' }}
                                        >
                                            {error.stack}
                                        </pre>
                                        {errorInfo && (
                                            <>
                                                <strong>Component Stack:</strong>
                                                <pre
                                                    style={{
                                                        whiteSpace: 'pre-wrap',
                                                        fontSize: '0.7rem',
                                                        marginTop: '0.5rem',
                                                    }}
                                                >
                                                    {errorInfo.componentStack}
                                                </pre>
                                            </>
                                        )}
                                    </div>
                                </details>
                            )}
                        </div>
                    </div>
                </>
            );
        }

        return this.props.children;
    }
}

// Higher-order component for easy wrapping
export const withErrorBoundary = <P extends object>(
    Component: React.ComponentType<P>,
    errorBoundaryProps?: Omit<Props, 'children'>
) => {
    const WrappedComponent = (props: P) => (
        <ComponentErrorBoundary {...errorBoundaryProps}>
            <Component {...props} />
        </ComponentErrorBoundary>
    );

    WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

    return WrappedComponent;
};

export default ComponentErrorBoundary;

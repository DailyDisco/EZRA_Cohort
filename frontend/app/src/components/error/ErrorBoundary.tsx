import React, { Component, ReactNode } from 'react';
import { Button, Result } from 'antd';
import { Link } from 'react-router';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error Boundary caught an error:', error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: undefined });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
                    <Result
                        status="error"
                        title="Something went wrong"
                        subTitle="We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists."
                        extra={
                            <div className="d-flex gap-3 justify-content-center">
                                <Button type="primary" onClick={this.handleRetry}>
                                    Try Again
                                </Button>
                                <Link to="/">
                                    <Button>Go Home</Button>
                                </Link>
                            </div>
                        }
                    />
                </div>
            );
        }

        return this.props.children;
    }
}

// Hook-based error boundary wrapper for functional components
export const withErrorBoundary = <P extends object>(Component: React.ComponentType<P>, fallback?: ReactNode) => {
    const WrappedComponent = (props: P) => (
        <ErrorBoundary fallback={fallback}>
            <Component {...props} />
        </ErrorBoundary>
    );

    WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

    return WrappedComponent;
};

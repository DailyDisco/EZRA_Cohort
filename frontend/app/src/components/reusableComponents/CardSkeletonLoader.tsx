import React from "react";

interface CardSkeletonLoaderProps {
    className?: string;
}

export const CardSkeletonLoader: React.FC<CardSkeletonLoaderProps> = ({ className = "" }) => {
    return (
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse ${className}`}>
            {/* Header skeleton */}
            <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-gray-200 rounded w-24"></div>
                <div className="h-5 w-5 bg-gray-200 rounded"></div>
            </div>

            {/* Value skeleton */}
            <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>

            {/* Description skeleton */}
            <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>

            {/* Button skeleton */}
            <div className="h-8 bg-gray-200 rounded w-full"></div>
        </div>
    );
};

export const InlineLoader: React.FC<{ size?: "sm" | "md" | "lg"; className?: string }> = ({ size = "md", className = "" }) => {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8",
    };

    return (
        <div className={`inline-flex items-center justify-center ${className}`}>
            <div
                className={`${sizeClasses[size]} border-2 border-gray-300 border-t-primary rounded-full animate-spin`}
                aria-label="Loading"
            />
        </div>
    );
};

interface PageLoaderProps {
    message?: string;
    className?: string;
    size?: "sm" | "md" | "lg";
    showDots?: boolean;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ message = "Loading...", className = "", size = "lg", showDots = true }) => {
    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-16 h-16",
    };

    const containerClasses = {
        sm: "min-h-[30vh]",
        md: "min-h-[40vh]",
        lg: "min-h-[50vh]",
    };

    return (
        <div className={`flex flex-col items-center justify-center ${containerClasses[size]} ${className}`}>
            {/* Modern spinner with gradient */}
            <div className="relative mb-6">
                {/* Outer ring */}
                <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-transparent rounded-full animate-spin`}></div>

                {/* Inner ring for depth */}
                <div
                    className={`absolute inset-2 border-2 border-primary/20 border-t-transparent rounded-full animate-spin`}
                    style={{ animationDirection: "reverse", animationDuration: "1.5s" }}></div>

                {/* Center dot */}
                <div className="absolute inset-1/2 w-2 h-2 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 opacity-60"></div>
            </div>

            {/* Loading message */}
            <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{message}</h3>

                {/* Animated dots */}
                {showDots && (
                    <div className="flex justify-center space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div
                            className="w-2 h-2 bg-primary rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}></div>
                        <div
                            className="w-2 h-2 bg-primary rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}></div>
                    </div>
                )}
            </div>

            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, #000 1px, transparent 1px),
                                    radial-gradient(circle at 75% 75%, #000 1px, transparent 1px)`,
                        backgroundSize: "20px 20px",
                    }}></div>
            </div>
        </div>
    );
};

// Enhanced version with progress indication
interface ProgressLoaderProps extends Omit<PageLoaderProps, "showDots"> {
    progress?: number; // 0-100
    showProgress?: boolean;
}

export const ProgressLoader: React.FC<ProgressLoaderProps> = ({ message = "Loading...", className = "", size = "lg", progress, showProgress = false }) => {
    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-16 h-16",
    };

    const containerClasses = {
        sm: "min-h-[30vh]",
        md: "min-h-[40vh]",
        lg: "min-h-[50vh]",
    };

    return (
        <div className={`flex flex-col items-center justify-center ${containerClasses[size]} ${className}`}>
            {/* Enhanced spinner */}
            <div className="relative mb-6">
                <div className={`${sizeClasses[size]} border-4 border-gray-200 rounded-full`}></div>
                <div className={`${sizeClasses[size]} border-4 border-transparent border-t-primary rounded-full animate-spin absolute inset-0`}></div>

                {/* Progress ring */}
                {showProgress && progress !== undefined && (
                    <svg
                        className={`absolute inset-0 ${sizeClasses[size]}`}
                        viewBox="0 0 64 64">
                        <circle
                            cx="32"
                            cy="32"
                            r="28"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="4"
                        />
                        <circle
                            cx="32"
                            cy="32"
                            r="28"
                            fill="none"
                            stroke="#1890ff"
                            strokeWidth="4"
                            strokeDasharray={`${2 * Math.PI * 28}`}
                            strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
                            strokeLinecap="round"
                            className="transition-all duration-300 ease-out"
                            transform="rotate(-90 32 32)"
                        />
                    </svg>
                )}
            </div>

            {/* Loading content */}
            <div className="text-center max-w-xs">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{message}</h3>

                {showProgress && progress !== undefined && (
                    <div className="mb-4">
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div
                                className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}></div>
                        </div>
                        <span className="text-sm text-gray-600">{progress}%</span>
                    </div>
                )}

                {/* Animated dots */}
                <div className="flex justify-center space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}></div>
                    <div
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}></div>
                </div>
            </div>
        </div>
    );
};

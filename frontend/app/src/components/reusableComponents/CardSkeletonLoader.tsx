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

export const PageLoader: React.FC<{ message?: string; className?: string }> = ({ message = "Loading...", className = "" }) => {
    return (
        <div className={`flex flex-col items-center justify-center min-h-[50vh] ${className}`}>
            <div className="flex items-center justify-center mb-4">
                <div
                    className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"
                    aria-label="Loading"
                />
            </div>
            <span className="text-lg font-medium text-gray-700">{message}</span>
        </div>
    );
};

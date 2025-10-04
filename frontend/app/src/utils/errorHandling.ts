/**
 * Error handling utilities for consistent error messaging and user feedback
 */

export interface ErrorDetail {
    category: string;
    message: string;
    severity: 'error' | 'warning' | 'info';
}

/**
 * Maps error types to user-friendly messages
 */
export const ERROR_MESSAGES = {
    complaints: 'Unable to load complaints data',
    'work orders': 'Unable to load work orders data',
    'package information': 'Unable to load package information',
    'parking permits': 'Unable to load parking permits data',
    'lease status': 'Unable to load lease status',
    network: 'Network connection error',
    authentication: 'Authentication failed',
    unknown: 'An unexpected error occurred',
} as const;

/**
 * Creates a comprehensive error message from error details
 */
export const createErrorMessage = (errorDetails: string[]): string => {
    if (errorDetails.length === 0) return '';

    if (errorDetails.length === 1) {
        return ERROR_MESSAGES[errorDetails[0] as keyof typeof ERROR_MESSAGES] || errorDetails[0];
    }

    const messages = errorDetails.map((detail) => ERROR_MESSAGES[detail as keyof typeof ERROR_MESSAGES] || detail);

    return `Multiple issues detected: ${messages.join(', ')}`;
};

/**
 * Determines if errors are critical (should prevent normal operation)
 */
export const areErrorsCritical = (errorDetails: string[]): boolean => {
    const criticalErrors = ['authentication', 'network'];
    return errorDetails.some((detail) => criticalErrors.includes(detail));
};

/**
 * Formats error details for display in UI components
 */
export const formatErrorDetails = (errorDetails: string[]): ErrorDetail[] => {
    return errorDetails.map((detail) => ({
        category: detail,
        message: ERROR_MESSAGES[detail as keyof typeof ERROR_MESSAGES] || detail,
        severity: detail === 'authentication' ? 'error' : 'warning',
    }));
};

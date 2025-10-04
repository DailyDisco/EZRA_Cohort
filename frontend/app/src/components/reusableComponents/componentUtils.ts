// Shared utilities for reusable components

// Common color constants used across components
export const COMPONENT_COLORS = {
    primary: '#00674f',
    secondary: '#64748b',
    dark: '#1e293b',
    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f',
    info: '#1890ff',
} as const;

// Common transition styles
export const TRANSITIONS = {
    smooth: 'all 0.3s ease-in-out',
    fast: 'all 0.2s ease-in-out',
    bounce: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

// Utility function to create consistent shadow styles
export const createShadowStyle = (level: 'sm' | 'md' | 'lg' = 'sm') => {
    const shadows = {
        sm: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        md: '0 4px 6px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 25px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
    };
    return { boxShadow: shadows[level] };
};

// Utility function to create consistent border radius
export const createBorderRadius = (size: 'sm' | 'md' | 'lg' | 'full' = 'md') => {
    const radii = {
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        full: '50%',
    };
    return { borderRadius: radii[size] };
};

// Utility function for consistent text styling
export const createTextStyle = (
    size: 'sm' | 'md' | 'lg' | 'xl' = 'md',
    weight: 'normal' | 'medium' | 'semibold' | 'bold' = 'normal',
    color: keyof typeof COMPONENT_COLORS = 'dark'
) => {
    const sizes = {
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
    };

    const weights = {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
    };

    return {
        fontSize: sizes[size],
        fontWeight: weights[weight],
        color: COMPONENT_COLORS[color],
    };
};

// Utility function to validate required props
export const validateRequiredProps = <T extends Record<string, any>>(props: T, requiredKeys: (keyof T)[]): boolean => {
    return requiredKeys.every((key) => props[key] !== undefined && props[key] !== null);
};

// Utility function to validate string props
export const validateStringProp = (value: any, propName: string, minLength = 1, maxLength = 255): string | null => {
    if (typeof value !== 'string') {
        return `${propName} must be a string`;
    }
    if (value.length < minLength) {
        return `${propName} must be at least ${minLength} characters long`;
    }
    if (value.length > maxLength) {
        return `${propName} must be no more than ${maxLength} characters long`;
    }
    return null;
};

// Utility function to validate numeric props
export const validateNumericProp = (value: any, propName: string, min?: number, max?: number): string | null => {
    if (typeof value !== 'number' || isNaN(value)) {
        return `${propName} must be a valid number`;
    }
    if (min !== undefined && value < min) {
        return `${propName} must be at least ${min}`;
    }
    if (max !== undefined && value > max) {
        return `${propName} must be no more than ${max}`;
    }
    return null;
};

// Utility function to validate enum props
export const validateEnumProp = <T extends string>(
    value: any,
    propName: string,
    allowedValues: readonly T[]
): string | null => {
    if (!allowedValues.includes(value)) {
        return `${propName} must be one of: ${allowedValues.join(', ')}`;
    }
    return null;
};

// Utility function to create error boundary for components
export const createComponentError = (componentName: string, error: string): Error => {
    return new Error(`[${componentName}] ${error}`);
};

// Utility function to merge class names
export const mergeClasses = (...classes: (string | undefined | null | false)[]): string => {
    return classes.filter(Boolean).join(' ');
};

// Utility function to create component props validator
export const createPropsValidator = <T extends Record<string, any>>(
    componentName: string,
    validations: Array<(props: T) => string | null>
) => {
    return (props: T): void => {
        const errors = validations.map((validation) => validation(props)).filter((error) => error !== null) as string[];

        if (errors.length > 0) {
            throw createComponentError(componentName, errors.join('; '));
        }
    };
};

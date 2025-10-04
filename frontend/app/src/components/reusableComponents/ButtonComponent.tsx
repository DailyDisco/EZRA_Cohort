import React, { memo } from 'react';
import { Button, ConfigProvider } from 'antd';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import { COMPONENT_COLORS, TRANSITIONS } from './componentUtils';

// Premium button animations with magnetic effects
const buttonPremiumStyles = `
    .premium-button {
        position: relative;
        overflow: hidden;
        transform: translateY(0);
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        cursor: pointer;
    }

    .premium-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s;
        z-index: 1;
    }

    .premium-button:hover::before {
        left: 100%;
    }

    .premium-button:hover {
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 8px 25px rgba(0, 113, 79, 0.3);
    }

    .premium-button:active {
        transform: translateY(0) scale(0.98);
        transition: transform 0.1s ease;
    }

    .button-glow {
        box-shadow: 0 0 20px rgba(0, 113, 79, 0.2);
        animation: buttonGlow 2s ease-in-out infinite alternate;
    }

    .magnetic-button {
        transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .magnetic-button:hover {
        transform: scale(1.05);
    }

    .interactive-ripple {
        position: relative;
        overflow: hidden;
    }

    .interactive-ripple::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
        z-index: 0;
    }

    .interactive-ripple:active::after {
        width: 300px;
        height: 300px;
    }

    @keyframes buttonGlow {
        from { box-shadow: 0 0 20px rgba(0, 113, 79, 0.2); }
        to { box-shadow: 0 0 30px rgba(0, 113, 79, 0.4), 0 0 40px rgba(0, 113, 79, 0.1); }
    }

    @keyframes magneticPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }

    .pulse-magnetic {
        animation: magneticPulse 2s ease-in-out infinite;
    }
`;

// Type definitions
type ButtonType = 'default' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'danger';
type ButtonSize = 'small' | 'default' | 'large';

// Props
export interface ButtonComponentProps {
    title: string;
    type?: ButtonType;
    disabled?: boolean;
    icon?: React.ReactNode;
    size?: ButtonSize;
    onClick?: () => void;
    loading?: boolean;
    className?: string;
    block?: boolean;
}

const ButtonComponentBase = (props: ButtonComponentProps) => {
    const {
        title,
        type = 'default',
        disabled = false,
        icon,
        size = 'default',
        onClick,
        loading = false,
        className = '',
        block = false,
    } = props;

    const isPrimary = type === 'primary' || type === 'info';

    return (
        <>
            <style>{buttonPremiumStyles}</style>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimaryHover: '#000000',
                    },
                    components: {
                        Button: {
                            colorInfoBg: COMPONENT_COLORS.primary,
                            colorInfoText: '#fff',
                            colorPrimary: COMPONENT_COLORS.primary,
                        },
                    },
                }}
            >
                <Button
                    size={size as SizeType}
                    disabled={disabled}
                    loading={loading}
                    block={block}
                    className={`btn btn-${type} premium-button magnetic-button interactive-ripple ${
                        isPrimary ? 'button-glow pulse-magnetic' : ''
                    } ${className}`}
                    style={{
                        transition: TRANSITIONS.smooth,
                        background: isPrimary
                            ? `linear-gradient(135deg, ${COMPONENT_COLORS.primary}, #2d8a6b)`
                            : undefined,
                        border: 'none',
                    }}
                    onClick={onClick}
                    aria-label={loading ? `Loading ${title}` : title}
                    aria-disabled={disabled}
                    role="button"
                    tabIndex={disabled ? -1 : 0}
                >
                    {icon && <span className="me-2">{icon}</span>}
                    {title}
                </Button>
            </ConfigProvider>
        </>
    );
};

const ButtonComponent = memo(ButtonComponentBase);
export default ButtonComponent;

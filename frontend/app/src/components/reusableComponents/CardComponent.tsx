import React, { JSX, memo } from 'react';
import Card from 'antd/es/card/Card';
import { COMPONENT_COLORS, TRANSITIONS, createShadowStyle, createTextStyle } from './componentUtils';

// Premium animation styles with color evolution
const cardHoverStyles = `
    .premium-card {
        transform: translateY(0);
        transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        position: relative;
        overflow: hidden;
    }

    .premium-card::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            rgba(255, 255, 255, 0.3),
            rgba(255, 255, 255, 0.1),
            transparent);
        transition: left 0.8s ease;
    }

    .premium-card:hover::after {
        left: 100%;
    }

    .premium-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1) !important;
        filter: brightness(1.02);
    }

    .color-evolution {
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .color-evolution:hover {
        background: linear-gradient(135deg,
            rgba(102, 126, 234, 0.1) 0%,
            rgba(118, 75, 162, 0.1) 25%,
            rgba(240, 147, 251, 0.1) 50%,
            rgba(245, 87, 108, 0.1) 75%,
            rgba(79, 172, 254, 0.1) 100%);
        background-size: 200% 200%;
        animation: colorShift 4s ease-in-out infinite;
    }

    @keyframes colorShift {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
    }

    .premium-card-icon {
        transition: all 0.3s ease;
    }

    .premium-card:hover .premium-card-icon {
        transform: scale(1.1) rotate(5deg);
        color: ${COMPONENT_COLORS.primary} !important;
    }

    .card-value-highlight {
        background: linear-gradient(135deg, ${COMPONENT_COLORS.primary}, #2d8a6b);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: valuePulse 2s ease-in-out infinite;
    }

    @keyframes valuePulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
    }
`;

interface CardComponentProps {
    title: string;
    description?: string;
    icon?: JSX.Element;
    button?: JSX.Element;
    hoverable?: boolean;
    value?: number;
    className?: string;
    loading?: boolean;
}

const CardComponentBase = (props: CardComponentProps) => {
    const { title, description, icon, button, hoverable = true, value, className = '', loading = false } = props;

    return (
        <>
            <style>{cardHoverStyles}</style>
            <Card
                title={
                    <div className="d-flex flex-column align-items-center justify-content-center text-center">
                        {icon && (
                            <div
                                className="mb-3 premium-card-icon"
                                style={{ fontSize: '2.5rem', color: COMPONENT_COLORS.primary }}
                                aria-hidden="true"
                            >
                                {icon}
                            </div>
                        )}
                        <h5 className="mb-0" style={createTextStyle('lg', 'semibold', 'dark')}>
                            {title}
                        </h5>
                    </div>
                }
                hoverable={hoverable}
                className={`card pb-2 premium-card color-evolution ${className}`}
                actions={button ? [button] : undefined}
                loading={loading}
                style={{
                    border: 'none',
                    ...createShadowStyle('sm'),
                    transition: TRANSITIONS.smooth,
                    background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
                }}
                styles={{ body: { padding: '1.5rem' } }}
                role="article"
                aria-label={`Card: ${title}`}
                tabIndex={hoverable ? 0 : undefined}
            >
                <div className="d-flex flex-column text-center">
                    {value && (
                        <span className="mb-3 card-value-highlight" style={createTextStyle('xl', 'bold', 'primary')}>
                            {value}
                        </span>
                    )}
                    {description && (
                        <span style={{ ...createTextStyle('sm', 'normal', 'secondary'), lineHeight: '1.6' }}>
                            {description}
                        </span>
                    )}
                </div>
            </Card>
        </>
    );
};

export const CardComponent = memo(CardComponentBase);

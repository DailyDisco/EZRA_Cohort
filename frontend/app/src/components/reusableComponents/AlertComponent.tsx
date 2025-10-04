import { useState } from 'react';
import { Alert } from 'antd';
import { COMPONENT_COLORS, TRANSITIONS } from './componentUtils';

// Premium alert animations
const alertPremiumStyles = `
    .premium-alert {
        border-left: 4px solid ${COMPONENT_COLORS.primary};
        border-radius: 8px;
        backdrop-filter: blur(10px);
        background: rgba(255, 255, 255, 0.95);
        animation: alertSlideIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .premium-alert-success {
        border-left-color: ${COMPONENT_COLORS.success};
        box-shadow: 0 4px 12px rgba(82, 196, 26, 0.15);
    }

    .premium-alert-info {
        border-left-color: ${COMPONENT_COLORS.info};
        box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
    }

    .premium-alert-warning {
        border-left-color: ${COMPONENT_COLORS.warning};
        box-shadow: 0 4px 12px rgba(250, 173, 20, 0.15);
    }

    .premium-alert-error {
        border-left-color: ${COMPONENT_COLORS.error};
        box-shadow: 0 4px 12px rgba(255, 77, 79, 0.15);
    }

    @keyframes alertSlideIn {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    .premium-alert-closing {
        animation: alertSlideOut 0.3s ease forwards;
    }

    @keyframes alertSlideOut {
        to {
            opacity: 0;
            transform: translateX(20px);
        }
    }
`;

interface AlertProps {
    title: string;
    message?: string;
    description: string;
    type: 'success' | 'info' | 'warning' | 'error';
    closable?: boolean;
    showIcon?: boolean;
    className?: string;
}

const AlertComponent = (props: AlertProps) => {
    const [visible, setVisible] = useState(true);
    const [closing, setClosing] = useState(false);

    const handleClose = () => {
        setClosing(true);
        setTimeout(() => setVisible(false), 300);
    };

    if (!visible) {
        return null;
    }

    const alertClasses = [
        'premium-alert',
        `premium-alert-${props.type}`,
        closing && 'premium-alert-closing',
        props.className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className="mb-4">
            <style>{alertPremiumStyles}</style>
            <Alert
                className={alertClasses}
                style={{
                    transition: TRANSITIONS.smooth,
                }}
                message={props.message || props.title}
                description={props.description}
                type={props.type}
                showIcon={props.showIcon}
                closable={props.closable}
                onClose={handleClose}
                role="alert"
                aria-live="polite"
                aria-describedby={`alert-description-${props.type}`}
            />
        </div>
    );
};

export default AlertComponent;

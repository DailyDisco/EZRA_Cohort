import { Divider } from 'antd';
import React from 'react';
import { COMPONENT_COLORS, TRANSITIONS, createTextStyle } from './componentUtils';

// Premium page title styling
const pageTitleStyles = `
    .premium-page-title {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%);
        backdrop-filter: blur(20px);
        border-radius: 12px;
        padding: 2rem 1.5rem;
        margin-bottom: 2rem;
        border: 1px solid rgba(0, 113, 79, 0.08);
        box-shadow: 0 4px 20px rgba(0, 113, 79, 0.06);
        animation: titleSlideIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .premium-title-text {
        background: linear-gradient(135deg, ${COMPONENT_COLORS.primary}, #2d8a6b);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 700;
        text-shadow: 0 2px 4px rgba(0, 113, 79, 0.1);
        animation: titleGlow 3s ease-in-out infinite alternate;
    }

    .premium-divider {
        height: 3px;
        background: linear-gradient(90deg, ${COMPONENT_COLORS.primary}, ${COMPONENT_COLORS.info});
        border-radius: 2px;
        margin: 1rem 0;
        animation: dividerExpand 0.8s ease-out;
    }

    @keyframes titleSlideIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes titleGlow {
        from { filter: drop-shadow(0 0 8px rgba(0, 113, 79, 0.3)); }
        to { filter: drop-shadow(0 0 16px rgba(0, 113, 79, 0.5)); }
    }

    @keyframes dividerExpand {
        from { width: 0; }
        to { width: 100%; }
    }
`;

interface PageTitleProps {
    title: string;
}

const PageTitleComponent: React.FC<PageTitleProps> = (props) => {
    return (
        <>
            <style>{pageTitleStyles}</style>
            <div className="premium-page-title">
                <h1 className="premium-title-text mb-0" style={{ fontSize: '2.5rem', lineHeight: '1.2' }}>
                    {props.title}
                </h1>
                <div className="premium-divider"></div>
            </div>
        </>
    );
};

export default PageTitleComponent;

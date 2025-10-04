import { Empty } from 'antd';
import { COMPONENT_COLORS } from './componentUtils';

// Premium empty state styling
const emptyStateStyles = `
    .premium-empty-state {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%);
        backdrop-filter: blur(20px);
        border-radius: 16px;
        padding: 2rem;
        border: 1px solid rgba(0, 113, 79, 0.1);
        animation: emptyStateFadeIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        box-shadow: 0 8px 32px rgba(0, 113, 79, 0.08);
    }

    .premium-empty-icon {
        filter: drop-shadow(0 4px 12px rgba(0, 113, 79, 0.2));
        animation: emptyIconFloat 3s ease-in-out infinite;
    }

    .premium-empty-text {
        background: linear-gradient(135deg, ${COMPONENT_COLORS.secondary}, ${COMPONENT_COLORS.dark});
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 500;
    }

    @keyframes emptyStateFadeIn {
        from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    @keyframes emptyIconFloat {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-8px); }
    }

    .empty-state:hover .premium-empty-icon {
        animation-duration: 2s;
    }
`;

interface EmptyStateProps {
    description: string;
    image?: React.ReactNode;
    className?: string;
}

const EmptyState = ({ description, image, className = '' }: EmptyStateProps) => (
    <>
        <style>{emptyStateStyles}</style>
        <div className={`empty-state text-center ${className}`}>
            <div className="premium-empty-state">
                <Empty
                    image={image || Empty.PRESENTED_IMAGE_SIMPLE}
                    description={<span className="premium-empty-text">{description}</span>}
                    imageStyle={{
                        opacity: 0.8,
                        filter: 'drop-shadow(0 4px 12px rgba(0, 113, 79, 0.2))',
                    }}
                    className="premium-empty-icon"
                />
            </div>
        </div>
    </>
);

export default EmptyState;

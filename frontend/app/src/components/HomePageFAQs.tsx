import React from 'react';
import { Collapse } from 'antd';

const { Panel } = Collapse;

interface FAQ {
    question: string;
    answer: string;
}

const faqs: FAQ[] = [
    {
        question: 'What is the lease length?',
        answer: 'We offer flexible lease terms starting from 6 months, with standard 12-month leases. Multi-year leases up to 3 years are available with additional incentives.',
    },
    {
        question: 'Do you have mailboxes?',
        answer: 'Yes! We provide secure smart package lockers with instant notifications when deliveries arrive. No more missed packages or waiting for mail.',
    },
    {
        question: 'Why EZRA?',
        answer: 'EZRA combines modern smart home technology with exceptional resident services. Our integrated platform makes managing your living experience seamless and secure.',
    },
];

const HomePageFAQs: React.FC = () => {
    return (
        <div className="modern-container fade-in-up py-5">
            <div className="text-center mb-5">
                <h2
                    className="fw-bold mb-3"
                    style={{
                        color: '#1e293b',
                        fontSize: '2.25rem',
                        fontWeight: '700',
                        letterSpacing: '-0.025em',
                    }}
                >
                    Frequently Asked Questions
                </h2>
                <p
                    className="text-muted mx-auto"
                    style={{
                        maxWidth: '500px',
                        fontSize: '1.125rem',
                        lineHeight: '1.6',
                    }}
                >
                    Everything you need to know about getting started
                </p>
            </div>
            <div className="mx-auto" style={{ maxWidth: '700px' }}>
                <Collapse
                    accordion
                    defaultActiveKey={['0']}
                    style={{
                        background: 'transparent',
                        border: 'none',
                    }}
                >
                    {faqs.map((faq, index) => (
                        <Panel
                            header={
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                    }}
                                >
                                    <span
                                        style={{
                                            fontWeight: '600',
                                            color: '#1e293b',
                                            fontSize: '1.1rem',
                                            letterSpacing: '-0.01em',
                                        }}
                                    >
                                        {faq.question}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: '0.8rem',
                                            color: '#00674f',
                                            fontWeight: '500',
                                            backgroundColor: 'rgba(0, 103, 79, 0.1)',
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            marginLeft: '12px',
                                        }}
                                    >
                                        {index === 0 ? 'Popular' : index === 1 ? 'Quick' : 'Helpful'}
                                    </span>
                                </div>
                            }
                            key={index}
                            style={{
                                border: '1px solid rgba(0, 0, 0, 0.06)',
                                borderRadius: '12px',
                                marginBottom: '12px',
                                background: 'white',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
                            }}
                        >
                            <p
                                style={{
                                    color: '#64748b',
                                    lineHeight: '1.7',
                                    fontSize: '1rem',
                                    margin: '20px 0 16px 0',
                                }}
                            >
                                {faq.answer}
                            </p>
                        </Panel>
                    ))}
                </Collapse>
            </div>
        </div>
    );
};

export default HomePageFAQs;

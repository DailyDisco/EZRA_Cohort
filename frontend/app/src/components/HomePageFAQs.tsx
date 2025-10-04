import React from "react";
import { Collapse } from "antd";
import { Link } from "react-router";

const { Panel } = Collapse;

interface FAQ {
    question: string;
    answer: string;
}

const faqs: FAQ[] = [
    {
        question: "What is the lease length?",
        answer: "We offer flexible lease terms starting from 6 months, with standard 12-month leases. Multi-year leases up to 3 years are available with additional incentives.",
    },
    {
        question: "Do you have mailboxes?",
        answer: "Yes! We provide secure smart package lockers with instant notifications when deliveries arrive. No more missed packages or waiting for mail.",
    },
    {
        question: "Why EZRA?",
        answer: "EZRA combines modern smart home technology with exceptional resident services. Our integrated platform makes managing your living experience seamless and secure.",
    },
];

const HomePageFAQs: React.FC = () => {
    return (
        <div className="modern-container fade-in-up">
            <h2
                className="text-center mb-5"
                style={{ color: "#1e293b", fontSize: "2.5rem", fontWeight: "700" }}>
                Frequently Asked Questions
            </h2>
            <div
                className="mx-auto"
                style={{ maxWidth: "800px" }}>
                <Collapse
                    accordion
                    defaultActiveKey={["0"]}
                    className="modern-card"
                    style={{ border: "none", background: "transparent" }}>
                    {faqs.map((faq, index) => (
                        <Panel
                            header={<span style={{ fontWeight: "500", color: "#1e293b" }}>{faq.question}</span>}
                            key={index}
                            className="hover-lift">
                            <p style={{ color: "#64748b", lineHeight: "1.7" }}>{faq.answer}</p>
                        </Panel>
                    ))}
                </Collapse>
            </div>
        </div>
    );
};

export default HomePageFAQs;

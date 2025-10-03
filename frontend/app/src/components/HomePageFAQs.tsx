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
        answer: "We often reccomend one year, but you can lease for up to 3 years at a time!",
    },
    {
        question: "Do you have mailboxes?",
        answer: "Yes! We implement a smart notification system to let you know when your package arrives!",
    },
    {
        question: "Why EZRA?",
        answer: "Because its so much better than RentDaddy",
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

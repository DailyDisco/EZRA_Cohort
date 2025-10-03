import React, { useState } from "react";
import { Button, Modal, Form, Input } from "antd";

const HeroBanner: React.FC = () => {
    const heroContent = {
        title: "Welcome to EZRA Apartments",
        subtitle: "Get ahead in life with your own place!",
        buttonText: "Contact us for a tour!",
        imageSrc: "https://felixwong.com/gallery/images/a/amsterdam0813-017.jpg",
    };

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [form] = Form.useForm();

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            console.log("Prospective Tenant Info:", values);
            setConfirmLoading(true);
            setTimeout(() => {
                setOpen(false);
                setConfirmLoading(false);
                form.resetFields();
            }, 2000);
        } catch (error) {}
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <div
            className="hero-banner text-white img-fluid flex flex-column justify-content-center align-items-center text-center position-relative overflow-hidden"
            style={{
                backgroundImage: `url(${heroContent.imageSrc})`,
                minHeight: "60vh",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}>
            {/* Modern gradient overlay */}
            <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                    background: "linear-gradient(135deg, rgba(0, 103, 79, 0.85) 0%, rgba(119, 137, 244, 0.75) 100%)",
                    backdropFilter: "blur(1px)",
                }}></div>

            {/* Content */}
            <div className="position-relative z-1 fade-in-up">
                <h1
                    className="display-4 fw-bold mb-4 text-shadow-lg"
                    style={{ letterSpacing: "-0.025em" }}>
                    {heroContent.title}
                </h1>
                <p
                    className="lead mb-5 fs-5 text-shadow"
                    style={{ maxWidth: "600px", margin: "0 auto" }}>
                    {heroContent.subtitle}
                </p>

                <Button
                    type="primary"
                    size="large"
                    className="modern-button pulse-on-hover glow-on-hover px-4 py-3"
                    onClick={showModal}
                    style={{
                        background: "linear-gradient(135deg, #00674f 0%, #00a86b 100%)",
                        border: "none",
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        minHeight: "48px",
                        boxShadow: "0 4px 14px 0 rgba(0, 103, 79, 0.39)",
                    }}>
                    {heroContent.buttonText}
                </Button>
            </div>
            <Modal
                title="Contact Info"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                footer={[
                    <Button
                        key="back"
                        onClick={handleCancel}>
                        Return
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={confirmLoading}
                        onClick={handleOk}>
                        Submit
                    </Button>,
                ]}>
                <p>Thanks for your intrest in EZRA Apartments! </p>
                <p>Please enter the info below to help us schedule a tour for you!</p>
                <Form
                    form={form}
                    layout="vertical">
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: "Please enter your name" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: "Please enter your email" },
                            { type: "email", message: "Enter a valid email" },
                        ]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="Phone"
                        rules={[{ required: true, message: "Please enter your phone number" }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default HeroBanner;

import React, { useState } from 'react';
import { Button, Modal, Form, Input } from 'antd';

const HeroBanner: React.FC = () => {
    const heroContent = {
        title: 'Welcome to EZRA Apartments',
        subtitle: 'Get ahead in life with your own place!',
        buttonText: 'Contact us for a tour!',
        imageSrc: 'https://felixwong.com/gallery/images/a/amsterdam0813-017.jpg',
    };

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [imageLoaded, setImageLoaded] = useState(false);
    const [form] = Form.useForm();

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            console.log('Prospective Tenant Info:', values);
            setConfirmLoading(true);
            setSubmissionStatus('idle');

            // Simulate API call with timeout
            setTimeout(() => {
                setConfirmLoading(false);
                setSubmissionStatus('success');

                // Show success message briefly, then close modal
                setTimeout(() => {
                    setOpen(false);
                    setSubmissionStatus('idle');
                    form.resetFields();
                }, 1500);
            }, 2000);
        } catch {
            setSubmissionStatus('error');
            setConfirmLoading(false);
        }
    };

    const handleCancel = () => {
        setOpen(false);
        setSubmissionStatus('idle');
    };

    return (
        <div
            className="hero-banner text-white img-fluid flex flex-column justify-content-center align-items-center text-center position-relative overflow-hidden"
            style={{
                background: imageLoaded
                    ? `url(${heroContent.imageSrc})`
                    : 'linear-gradient(135deg, #00674f 0%, #7789f4 50%, #00674f 100%)',
                minHeight: '60vh',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'background-image 0.8s ease-in-out',
            }}
        >
            {/* Image preloader */}
            <img
                src={heroContent.imageSrc}
                alt=""
                onLoad={() => setImageLoaded(true)}
                style={{ display: 'none' }}
                aria-hidden="true"
            />

            {/* Modern gradient overlay */}
            <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                    background: imageLoaded
                        ? 'linear-gradient(135deg, rgba(0, 103, 79, 0.8) 0%, rgba(119, 137, 244, 0.7) 100%)'
                        : 'linear-gradient(135deg, rgba(0, 103, 79, 0.9) 0%, rgba(119, 137, 244, 0.8) 100%)',
                    backdropFilter: imageLoaded ? 'blur(1px)' : 'blur(2px)',
                    transition: 'background-color 0.8s ease-in-out, backdrop-filter 0.8s ease-in-out',
                }}
            ></div>

            {/* Content */}
            <div className="position-relative z-1">
                <h1
                    className="display-3 fw-bold mb-4 text-shadow-lg"
                    style={{
                        letterSpacing: '-0.03em',
                        lineHeight: '1.1',
                        fontWeight: '700',
                    }}
                >
                    {heroContent.title}
                </h1>
                <p
                    className="lead mb-5 fs-4 text-shadow"
                    style={{
                        maxWidth: '650px',
                        margin: '0 auto',
                        lineHeight: '1.6',
                        fontWeight: '400',
                        letterSpacing: '-0.01em',
                    }}
                >
                    {heroContent.subtitle}
                </p>

                <Button
                    type="primary"
                    size="large"
                    className="modern-button px-5 py-3"
                    onClick={showModal}
                    style={{
                        backgroundColor: '#00674f',
                        border: 'none',
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        minHeight: '56px',
                        letterSpacing: '0.025em',
                        boxShadow: '0 4px 16px rgba(0, 103, 79, 0.25)',
                        transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 103, 79, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 103, 79, 0.25)';
                    }}
                >
                    <span style={{ position: 'relative', zIndex: 1 }}>{heroContent.buttonText}</span>
                    {/* Removed shine-effect for smoother animation */}
                </Button>
            </div>
            <Modal
                title="Contact Info"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                destroyOnClose
                footer={[
                    <Button
                        key="back"
                        onClick={handleCancel}
                        aria-label="Cancel and return to page"
                        disabled={confirmLoading}
                    >
                        {submissionStatus === 'success' ? 'Close' : 'Return'}
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={confirmLoading}
                        onClick={handleOk}
                        disabled={submissionStatus === 'success' || confirmLoading}
                        aria-label={
                            confirmLoading
                                ? 'Submitting contact information'
                                : submissionStatus === 'success'
                                ? 'Contact information submitted successfully'
                                : 'Submit contact information'
                        }
                    >
                        {confirmLoading ? 'Submitting...' : submissionStatus === 'success' ? 'Submitted!' : 'Submit'}
                    </Button>,
                ]}
                aria-labelledby="contact-modal-title"
                aria-describedby="contact-modal-description"
            >
                <div id="contact-modal-description">
                    {submissionStatus === 'success' ? (
                        <div className="text-center py-4">
                            <div className="mb-3">
                                <span style={{ fontSize: '2rem', color: '#10b981' }}>✅</span>
                            </div>
                            <h4 className="text-success mb-2">Thank you!</h4>
                            <p className="text-muted mb-0">
                                We've received your information and will contact you soon to schedule a tour.
                            </p>
                        </div>
                    ) : submissionStatus === 'error' ? (
                        <div className="text-center py-4">
                            <div className="mb-3">
                                <span style={{ fontSize: '2rem', color: '#ef4444' }}>❌</span>
                            </div>
                            <h4 className="text-danger mb-2">Something went wrong</h4>
                            <p className="text-muted mb-0">Please check your information and try again.</p>
                        </div>
                    ) : (
                        <>
                            <p>Thanks for your interest in EZRA Apartments!</p>
                            <p>Please enter the info below to help us schedule a tour for you!</p>
                            <Form form={form} layout="vertical" aria-label="Contact information form">
                                <Form.Item
                                    name="name"
                                    label="Name"
                                    rules={[{ required: true, message: 'Please enter your name' }]}
                                    aria-required="true"
                                >
                                    <Input
                                        placeholder="Enter your full name"
                                        aria-label="Full name"
                                        aria-describedby="name-error"
                                        disabled={confirmLoading}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="email"
                                    label="Email"
                                    rules={[
                                        { required: true, message: 'Please enter your email' },
                                        { type: 'email', message: 'Enter a valid email' },
                                    ]}
                                    aria-required="true"
                                >
                                    <Input
                                        type="email"
                                        placeholder="Enter your email address"
                                        aria-label="Email address"
                                        aria-describedby="email-error"
                                        disabled={confirmLoading}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="phone"
                                    label="Phone"
                                    rules={[{ required: true, message: 'Please enter your phone number' }]}
                                    aria-required="true"
                                >
                                    <Input
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        aria-label="Phone number"
                                        aria-describedby="phone-error"
                                        disabled={confirmLoading}
                                    />
                                </Form.Item>
                            </Form>
                        </>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default HeroBanner;

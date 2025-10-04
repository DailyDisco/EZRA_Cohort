import { LockOutlined, InboxOutlined, CarOutlined, MobileOutlined } from '@ant-design/icons';
import { CardComponent } from './reusableComponents/CardComponent';

/**
 * HomePageFeaturesComponent - Displays a grid of feature cards highlighting smart living amenities
 * Uses Ant Design's Card, Row, and Col components for responsive layout
 * Is used on the Home Page under the Hero Section
 */
const HomePageFeaturesComponent = () => {
    // Array of features with properties for title, icon, and description
    // TODO: Should we add more features? Like images or something
    const features = [
        {
            title: 'Smart Door Locks',
            icon: <LockOutlined style={{ color: '#00674f' }} />,
            description: 'Access your apartment securely through our mobile app. Grant temporary access to guests or maintenance with just a tap.',
            gradient: 'linear-gradient(135deg, #00674f 0%, #00a86b 100%)',
        },
        {
            title: 'Smart Package Lockers',
            icon: <InboxOutlined style={{ color: '#7789f4' }} />,
            description: 'Never miss a delivery with our secure smart lockers. Receive instant notifications when packages arrive.',
            gradient: 'linear-gradient(135deg, #7789f4 0%, #a5b4fc 100%)',
        },
        {
            title: 'Guest Parking Management',
            icon: <CarOutlined style={{ color: '#10b981' }} />,
            description: 'Easily register guest vehicles and manage parking permits through our convenient digital system.',
            gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
        },
        {
            title: 'Resident Portal',
            icon: <MobileOutlined style={{ color: '#d86364' }} />,
            description: 'Manage your entire resident experience from our website - pay rent, submit maintenance requests, and control smart home features.',
            gradient: 'linear-gradient(135deg, #d86364 0%, #f472b6 100%)',
        },
    ];

    return (
        <section
            className="py-5 position-relative overflow-hidden d-flex justify-content-center align-items-center"
            style={{
                background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
            }}>
            {/* Decorative background elements */}
            <div
                className="position-absolute rounded-circle"
                style={{
                    top: '-10%',
                    right: '-5%',
                    width: '400px',
                    height: '400px',
                    background: 'radial-gradient(circle, rgba(119, 137, 244, 0.1) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }}
            />
            <div
                className="position-absolute rounded-circle"
                style={{
                    bottom: '-15%',
                    left: '-8%',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }}
            />

            <div
                className="container fade-in-up position-relative mx-auto"
                style={{ maxWidth: '1400px', zIndex: 1 }}>
                {/* Section Header */}
                <div className="text-center mb-5">
                    <div
                        className="d-inline-block px-4 py-2 mb-3 rounded-pill"
                        style={{
                            background: 'linear-gradient(135deg, rgba(119, 137, 244, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
                            border: '1px solid rgba(119, 137, 244, 0.2)',
                        }}>
                        <span
                            className="fw-semibold"
                            style={{
                                background: 'linear-gradient(135deg, #7789f4 0%, #10b981 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontSize: '0.875rem',
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase',
                            }}>
                            ✨ Modern Living
                        </span>
                    </div>
                    <h2
                        className="fw-bold mb-3"
                        style={{
                            color: '#1e293b',
                            fontSize: '2.75rem',
                            letterSpacing: '-0.025em',
                        }}>
                        Smart Living Features
                    </h2>
                    <p
                        className="text-muted mx-auto"
                        style={{
                            maxWidth: '600px',
                            fontSize: '1.125rem',
                            lineHeight: '1.6',
                        }}>
                        Experience modern apartment living with our suite of intelligent amenities designed for your convenience
                    </p>
                </div>

                {/* Features Grid - All in a Row */}
                <div className="row g-4 justify-content-center mx-auto">
                    {features.map((feature, index) => (
                        <div
                            key={feature.title}
                            className="col-12 col-sm-6 col-md-6 col-lg-3 d-flex justify-content-center fade-in-up"
                            style={{ animationDelay: `${index * 0.1}s` }}>
                            <CardComponent
                                hoverable
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                            />
                        </div>
                    ))}
                </div>

                {/* Optional: Add a subtle call to action */}
                <div className="text-center mt-5 pt-4">
                    <p
                        className="text-muted mb-0"
                        style={{
                            fontSize: '0.95rem',
                            fontStyle: 'italic',
                        }}>
                        All features included with your lease — no extra fees required 🎉
                    </p>
                </div>
            </div>
        </section>
    );
};

export default HomePageFeaturesComponent;

import React from "react";
import { Layout, Menu, theme } from "antd";
import { Link, Outlet } from "react-router";
import { SignOutButton, useUser } from "@clerk/react-router";

const { Header, Content, Footer } = Layout;

const PreAuthedLayout: React.FC = () => {
    // Get Clerk User to get the user's role
    const { user } = useUser();

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    console.log(user, "user");

    // Right Hand Sidebar Items
    const items = [
        {
            key: "1",
            label: user ? (
                <Link
                    className="text-white"
                    to={user.publicMetadata.role === "admin" ? "/admin" : "/tenant"}>
                    Dashboard
                </Link>
            ) : (
                <Link
                    className="text-white"
                    to="/">
                    Home
                </Link>
            ),
        },
        {
            key: "2",
            label: user ? (
                <SignOutButton>
                    <div className="text-white">Logout</div>
                </SignOutButton>
            ) : (
                <Link to="/auth/sign-in">Login</Link>
            ),
        },
    ];

    return (
        <Layout>
            <Header className="modern-header">
                {/* Left Side Nav */}
                <div className="header-left">
                    <Link
                        to="/"
                        className="logo-link">
                        <div className="logo-container">
                            <img
                                src="/logo.png"
                                alt="EZRA Logo"
                                className="logo-image"
                            />
                            <div className="logo-glow" />
                        </div>
                    </Link>
                </div>

                {/* Center Nav */}
                <div className="header-center">
                    <Link
                        to="/"
                        className="brand-link">
                        <span className="brand-text">EZRA</span>
                        <div className="brand-accent" />
                    </Link>
                </div>

                {/* Top right Nav */}
                <div className="header-right">
                    <Menu
                        mode="horizontal"
                        className="header-menu"
                        items={items}
                    />
                </div>
            </Header>
            <Content>
                <div
                    style={{
                        padding: 24,
                        minHeight: 380,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}>
                    {/* Outlet is a React Router component to help present what shows up from the main.tsx children routes */}
                    <Outlet />
                </div>
            </Content>
            {/* Footer Container */}
            <Footer className="modern-footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <div className="footer-logo-container">
                            <img
                                src="/logo.png"
                                alt="EZRA Logo"
                                className="footer-logo"
                            />
                            <div className="footer-logo-shine" />
                        </div>
                        <h3 className="footer-brand-text">EZRA</h3>
                        <p className="footer-tagline">Modern apartment management made simple</p>
                    </div>

                    <div className="footer-links">
                        <div className="footer-link-group">
                            <h4 className="footer-link-title">Company</h4>
                            <Link
                                to="/about"
                                className="footer-link disabled-link">
                                About Us
                            </Link>
                            <Link
                                to="/contact"
                                className="footer-link disabled-link">
                                Contact
                            </Link>
                        </div>

                        <div className="footer-link-group">
                            <h4 className="footer-link-title">Legal</h4>
                            <Link
                                to="/privacy"
                                className="footer-link disabled-link">
                                Privacy Policy
                            </Link>
                            <Link
                                to="/terms"
                                className="footer-link disabled-link">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="footer-copyright">
                        <p>© {new Date().getFullYear()} EZRA. All rights reserved.</p>
                    </div>
                    <div className="footer-decorations">
                        <div className="footer-sparkle sparkle-1" />
                        <div className="footer-sparkle sparkle-2" />
                        <div className="footer-sparkle sparkle-3" />
                    </div>
                </div>
            </Footer>
        </Layout>
    );
};

export default PreAuthedLayout;

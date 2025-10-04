import { Link } from 'react-router';

const ErrorNotFound = () => {
    return (
        <main
            className="d-flex flex-column align-items-center justify-content-center min-vh-100 position-relative overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)',
            }}
        >
            {/* Decorative background elements */}
            <div
                className="position-absolute rounded-circle"
                style={{
                    top: '-8rem',
                    left: '-8rem',
                    width: '24rem',
                    height: '24rem',
                    background: '#cbd5e1',
                    opacity: 0.2,
                    filter: 'blur(80px)',
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
            />
            <div
                className="position-absolute rounded-circle"
                style={{
                    bottom: 0,
                    right: 0,
                    width: '20rem',
                    height: '20rem',
                    background: '#e2e8f0',
                    opacity: 0.25,
                    filter: 'blur(60px)',
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
            />

            <div
                className="position-relative d-flex flex-column align-items-center gap-4 px-5 py-5 rounded-4 shadow-lg bg-white border border-light"
                style={{
                    maxWidth: '48rem',
                    zIndex: 10,
                }}
            >
                <img
                    src="/sad_logo.png"
                    alt="Logo"
                    className="mb-2"
                    style={{
                        width: '6rem',
                        height: '6rem',
                        opacity: 0.8,
                    }}
                />
                <h1
                    className="display-1 fw-bold text-dark"
                    style={{
                        letterSpacing: '-0.025em',
                    }}
                >
                    404
                </h1>
                <h2 className="h2 fw-semibold text-secondary">Page Not Found</h2>
                <p
                    className="text-muted text-center"
                    style={{
                        maxWidth: '28rem',
                        lineHeight: '1.75',
                        fontSize: '1rem',
                    }}
                >
                    The page you are looking for does not exist or has been moved. Please check the URL or return to the
                    home page.
                </p>
                <Link
                    to="/"
                    className="d-inline-flex align-items-center gap-2 mt-3 px-4 py-3 rounded-3 bg-dark text-white fw-medium shadow text-decoration-none"
                    style={{
                        transition: 'all 0.2s ease-in-out',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#495057';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#212529';
                    }}
                >
                    <svg
                        className="bi"
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            stroke="currentColor"
                            fill="none"
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    Return to Home
                </Link>
                <div
                    className="mt-4 text-muted text-center border-top border-light pt-4 w-100"
                    style={{
                        fontSize: '0.875rem',
                    }}
                >
                    If you believe this is an error, please contact our support team for assistance.
                </div>
            </div>
        </main>
    );
};

export default ErrorNotFound;

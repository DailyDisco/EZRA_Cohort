import { UserOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router';

{
    /* Todo: If the user is on the sidebar link, make the link black */
}
const SidebarLinks = () => {
    const location = useLocation();
    const path = location.pathname;

    const getLinkClass = (linkPath: string) => {
        // Check if current path starts with the link path
        const isActive = path.startsWith(linkPath);

        // Base classes that are always applied
        const baseClasses = 'text-decoration-none transition-colors';

        // For main menu items
        if (linkPath === '/') {
            // Keep incase of mobile sidebar
            return `${baseClasses} ${isActive ? 'text-primary' : 'text-white hover:text-primary'}`;
        } else {
            return `${baseClasses} ${isActive ? 'text-light' : 'text-white-50 hover:text-secondary'}`;
        }
    };

    const isAdmin = path.startsWith('/admin');
    const isTenant = path.startsWith('/tenant');

    return (
        <div className="menu-container d-flex flex-column gap-2 px-3 mb-5">
            {/* Home Menu Item */}
            {/* <div className="menu-item p-3 rounded-4 transition-all hover-lift"
                 style={{
                     background: "rgba(255, 255, 255, 0.05)",
                     backdropFilter: "blur(10px)",
                     border: "1px solid rgba(255, 255, 255, 0.1)"
                 }}>
                <div className="d-flex align-items-center">
                    <HomeOutlined
                        className="menu-icon text-white me-3"
                        style={{ fontSize: "1.125rem" }}
                    />
                    <Link
                        to="/"
                        className="text-white text-decoration-none fw-medium hover-lift transition-all"
                        style={{
                            fontSize: "0.95rem",
                            letterSpacing: "0.025em"
                        }}>
                        Home
                    </Link>
                </div>
            </div> */}

            {isAdmin && (
                <div
                    className="menu-section p-3 rounded-4 transition-all sidebar-menu-item"
                    style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                    }}>
                    <div className="d-flex align-items-center mb-3">
                        <UserOutlined
                            className="menu-icon text-white me-3"
                            style={{ fontSize: '1.25rem' }}
                        />
                        <Link
                            to="/admin"
                            className="text-white text-decoration-none fw-medium hover-lift transition-all"
                            style={{
                                fontSize: '1.1rem',
                                letterSpacing: '0.025em',
                                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                            }}>
                            Admin
                        </Link>
                    </div>
                    <div className="ps-4 d-flex flex-column gap-1">
                        <Link
                            to="/admin"
                            className={`${getLinkClass('/admin')} ${path === '/admin' ? 'menu-link-active' : 'text-white-50 menu-link-hover'} hover-lift transition-all fw-medium`}
                            style={{
                                fontSize: '0.9rem',
                                padding: '0.5rem 0.75rem',
                                borderRadius: '0.375rem',
                                marginLeft: '-0.75rem',
                                transition: 'all 0.2s ease-in-out',
                            }}>
                            Dashboard
                        </Link>
                        <Link
                            to="/admin/init-apartment-complex"
                            className={`${getLinkClass('/admin/init-apartment-complex')} menu-link-hover hover-lift transition-all fw-medium`}
                            style={{
                                fontSize: '0.9rem',
                                padding: '0.5rem 0.75rem',
                                borderRadius: '0.375rem',
                                marginLeft: '-0.75rem',
                                transition: 'all 0.2s ease-in-out',
                            }}>
                            Apartment Setup
                        </Link>
                        <Link
                            to="/admin/manage-tenants"
                            className={`${getLinkClass('/admin/manage-tenants')} menu-link-hover hover-lift transition-all fw-medium`}
                            style={{
                                fontSize: '0.9rem',
                                padding: '0.5rem 0.75rem',
                                borderRadius: '0.375rem',
                                marginLeft: '-0.75rem',
                                transition: 'all 0.2s ease-in-out',
                            }}>
                            Manage Tenants
                        </Link>
                        <Link
                            to="/admin/admin-view-and-edit-leases"
                            className={`${getLinkClass('/admin/admin-view-and-edit-leases')} menu-link-hover hover-lift transition-all fw-medium`}
                            style={{
                                fontSize: '0.9rem',
                                padding: '0.5rem 0.75rem',
                                borderRadius: '0.375rem',
                                marginLeft: '-0.75rem',
                                transition: 'all 0.2s ease-in-out',
                            }}>
                            View Digital Leases
                        </Link>
                        <Link
                            to="/admin/admin-view-and-edit-work-orders-and-complaints"
                            className={`${getLinkClass('/admin/admin-view-and-edit-work-orders-and-complaints')} menu-link-hover hover-lift transition-all fw-medium`}
                            style={{
                                fontSize: '0.9rem',
                                padding: '0.5rem 0.75rem',
                                borderRadius: '0.375rem',
                                marginLeft: '-0.75rem',
                                transition: 'all 0.2s ease-in-out',
                            }}>
                            Work Orders & Complaints
                        </Link>
                        <Link
                            to="/admin/admin-view-and-edit-smart-lockers"
                            className={`${getLinkClass('/admin/admin-view-and-edit-smart-lockers')} menu-link-hover hover-lift transition-all fw-medium`}
                            style={{
                                fontSize: '0.9rem',
                                padding: '0.5rem 0.75rem',
                                borderRadius: '0.375rem',
                                marginLeft: '-0.75rem',
                                transition: 'all 0.2s ease-in-out',
                            }}>
                            Smart Lockers
                        </Link>
                    </div>
                </div>
            )}
            {isTenant && (
                <div
                    className="menu-section p-3 rounded-4 transition-all sidebar-menu-item"
                    style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                    }}>
                    <div className="d-flex align-items-center mb-3">
                        <UserOutlined
                            className="menu-icon text-white me-3"
                            style={{ fontSize: '1.25rem' }}
                        />
                        <Link
                            to="/tenant"
                            className="text-white text-decoration-none fw-medium hover-lift transition-all"
                            style={{
                                fontSize: '1.1rem',
                                letterSpacing: '0.025em',
                                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                            }}>
                            Tenant
                        </Link>
                    </div>
                    <div className="ps-4 d-flex flex-column gap-1">
                        <Link
                            to="/tenant"
                            className={`${getLinkClass('/tenant')} ${path === '/tenant' ? 'menu-link-active' : 'text-white-50 menu-link-hover'} hover-lift transition-all fw-medium`}
                            style={{
                                fontSize: '0.9rem',
                                padding: '0.5rem 0.75rem',
                                borderRadius: '0.375rem',
                                marginLeft: '-0.75rem',
                                transition: 'all 0.2s ease-in-out',
                            }}>
                            Dashboard
                        </Link>
                        {/* We are using a modal instead of this page  */}
                        {/* <Link
                        to="/tenant/guest-parking"
                        className={`${getLinkClass("/tenant/guest-parking")} hover-lift transition-all fw-medium`}
                        style={{
                            fontSize: "0.9rem",
                            padding: "0.5rem 0.75rem",
                            borderRadius: "0.375rem",
                            marginLeft: "-0.75rem",
                            transition: "all 0.2s ease-in-out"
                        }}>
                        Guest Parking
                    </Link> */}
                        {/* <Link
                            to="/tenant/tenant-view-and-edit-leases"
                            className={`${getLinkClass("/tenant/tenant-view-and-edit-leases")} menu-link-hover hover-lift transition-all fw-medium`}
                            style={{
                                fontSize: "0.9rem",
                                padding: "0.5rem 0.75rem",
                                borderRadius: "0.375rem",
                                marginLeft: "-0.75rem",
                                transition: "all 0.2s ease-in-out",
                            }}>
                            View Digital Leases
                        </Link> */}
                        <Link
                            to="/tenant/tenant-complaints"
                            className={`${getLinkClass('/tenant/tenant-work-orders-and-complaints')} menu-link-hover hover-lift transition-all fw-medium`}
                            style={{
                                fontSize: '0.9rem',
                                padding: '0.5rem 0.75rem',
                                borderRadius: '0.375rem',
                                marginLeft: '-0.75rem',
                                transition: 'all 0.2s ease-in-out',
                            }}>
                            Complaints
                        </Link>
                        <Link
                            to="/tenant/tenant-work-orders"
                            className={`${getLinkClass('/tenant/tenant-work-orders-and-complaints')} menu-link-hover hover-lift transition-all fw-medium`}
                            style={{
                                fontSize: '0.9rem',
                                padding: '0.5rem 0.75rem',
                                borderRadius: '0.375rem',
                                marginLeft: '-0.75rem',
                                transition: 'all 0.2s ease-in-out',
                            }}>
                            Work Orders
                        </Link>
                    </div>
                </div>
            )}
            <div className="mt-5" />
        </div>
    );
};

export default SidebarLinks;

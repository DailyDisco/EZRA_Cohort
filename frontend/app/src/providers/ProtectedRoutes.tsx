// This component is used to protect routes that are only accessible to signed in users
// It also checks the user's role and redirects to the correct route based on the role
// The ProtectedRoutes component is used in the Main.tsx file as a Route element that wraps the Tenant and Admin routes

import { Navigate, Outlet, useLocation } from 'react-router';
import { useUserRole } from '../hooks/useUserRole';
import { PageLoader } from '../components/reusableComponents/CardSkeletonLoader';

const ProtectedRoutes = () => {
    // Use custom hook for user role management
    const { isSignedIn, isLoaded, isAdmin, isTenant } = useUserRole();

    // Get the current path to check if the user is trying to access a tenant or admin route
    const location = useLocation();
    const currentPath = location.pathname;

    // Show loading state while Clerk is initializing
    // If we don't do this, the user will be redirected to the login page before the Clerk is initialized, even if they are signed in
    if (!isLoaded) {
        return (
            <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
                <PageLoader message="Authenticating..." size="lg" />
            </div>
        );
    }

    // If user is not signed in, redirect to login
    if (!isSignedIn) {
        return <Navigate to="/auth/sign-in" />;
    }

    // More strict role-based access control
    if (isTenant) {
        // Tenants can ONLY access tenant routes
        if (!currentPath.startsWith('/tenant')) {
            return <Navigate to="/tenant" />;
        }
    } else if (isAdmin) {
        // Admins can ONLY access admin routes
        if (!currentPath.startsWith('/admin')) {
            return <Navigate to="/admin" />;
        }
    } else {
        // Handle users with no role or invalid role - redirect to login to get role assigned
        console.warn('User has no valid role, redirecting to login');
        return <Navigate to="/auth/sign-in" />;
    }

    // Allow access to the route if the checks above passed
    return <Outlet />;
};

export default ProtectedRoutes;

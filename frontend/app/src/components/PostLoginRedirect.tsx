import { Navigate } from 'react-router';
import { useUserRole } from '../hooks/useUserRole';

const PostLoginRedirect = () => {
    const { isSignedIn, isLoaded, isAdmin, isTenant } = useUserRole();

    // If user data is not loaded yet, return null to avoid any rendering
    if (!isLoaded) {
        return null;
    }

    // If user is not signed in, redirect to login (this shouldn't happen in normal flow)
    if (!isSignedIn) {
        return <Navigate to="/auth/sign-in" />;
    }

    // Redirect based on user role - immediate redirect with replace to avoid history issues
    if (isAdmin) {
        return <Navigate to="/admin" replace />;
    } else if (isTenant) {
        return <Navigate to="/tenant" replace />;
    } else {
        // Handle users with no role or invalid role
        return <Navigate to="/error500" replace />;
    }
};

export default PostLoginRedirect;

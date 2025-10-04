import { useAuth, useUser } from '@clerk/react-router';

export const useUserRole = () => {
    const { isSignedIn: authSignedIn, isLoaded: authLoaded } = useAuth();
    const { user, isLoaded: userLoaded } = useUser();

    // Use auth state for faster loading, user state for role data
    const isLoaded = authLoaded && userLoaded;
    const isSignedIn = authSignedIn;

    const role = user?.publicMetadata?.role as string;

    const isAdmin = role === 'admin';
    const isTenant = role === 'tenant';

    return {
        isSignedIn,
        isLoaded,
        user,
        role,
        isAdmin,
        isTenant,
    };
};

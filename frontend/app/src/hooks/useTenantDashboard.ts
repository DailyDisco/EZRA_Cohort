import { useQueries, useQuery } from '@tanstack/react-query';
import { useAuth, useUser } from '@clerk/react-router';
import { ComplaintsData, Parking, WorkOrderData } from '../types/types';

interface LeaseStatus {
    lease_status: string;
    url: string;
}

// Use VITE_API_URL for the server URL, ensuring no trailing slash
const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const absoluteServerUrl = serverUrl.replace(/\/$/, '');

export const useTenantDashboard = () => {
    const { user } = useUser();
    const userId = user?.publicMetadata['db_id'];
    const { getToken } = useAuth();
    const clerkUserId = user?.id;

    // Common query configuration
    const queryConfig = {
        retry: 2,
        staleTime: 5 * 60 * 1000, // 5 minutes
    };

    const fetchData = async (endpoint: string, errorMessage: string) => {
        const authToken = await getToken();
        if (!authToken) {
            throw new Error('[TENANT_DASHBOARD] Error unauthorized');
        }

        const res = await fetch(`${absoluteServerUrl}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (!res.ok) {
            throw new Error(`[TENANT_DASHBOARD] Error ${errorMessage} request failed`);
        }

        return res.json();
    };

    // Data fetching queries
    const [complaints, workOrders, lockers, parking] = useQueries({
        queries: [
            {
                queryKey: [`${clerkUserId}-complaints`],
                queryFn: () => fetchData('/tenant/complaints', 'complaints'),
                ...queryConfig,
            },
            {
                queryKey: [`${clerkUserId}-work-orders`],
                queryFn: () => fetchData('/tenant/work_orders', 'work orders'),
                ...queryConfig,
            },
            {
                queryKey: [`${clerkUserId}-lockers`],
                queryFn: () => fetchData('/tenant/lockers', 'lockers'),
                ...queryConfig,
            },
            {
                queryKey: [`${clerkUserId}-parking`],
                queryFn: () => fetchData('/tenant/parking', 'parking_permits'),
                ...queryConfig,
            },
        ],
    });

    // Fetch lease status
    const { data: leaseStatus, error: leaseError } = useQuery<LeaseStatus>({
        queryKey: ['leaseStatus', clerkUserId],
        queryFn: async () => {
            const authToken = await getToken();
            if (!authToken) {
                throw new Error('[TENANT_DASHBOARD] Error unauthorized');
            }

            const response = await fetch(`${absoluteServerUrl}/tenant/leases/${userId}/signing-url`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch lease status');
            }
            return response.json();
        },
        enabled: !!userId,
        retry: 2,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });

    // Error handling
    const errorDetails = [];
    if (complaints.error) errorDetails.push('complaints');
    if (workOrders.error) errorDetails.push('work orders');
    if (lockers.error) errorDetails.push('package information');
    if (parking.error) errorDetails.push('parking permits');
    if (leaseError) errorDetails.push('lease status');

    const hasErrors = errorDetails.length > 0;
    const isInitialLoading = complaints.isLoading && workOrders.isLoading && lockers.isLoading && parking.isLoading;

    return {
        userId,
        clerkUserId,
        complaints: complaints.data as ComplaintsData[],
        workOrders: workOrders.data as WorkOrderData[],
        lockers: lockers.data as ComplaintsData[],
        parking: parking.data as Parking[],
        leaseStatus,
        leaseError,
        hasErrors,
        errorDetails,
        isInitialLoading,
        isLoadingComplaints: complaints.isLoading,
        isLoadingWorkOrders: workOrders.isLoading,
        isLoadingLockers: lockers.isLoading,
        isLoadingParking: parking.isLoading,
    };
};

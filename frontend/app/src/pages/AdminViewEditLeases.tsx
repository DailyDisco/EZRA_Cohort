import { useState, useEffect } from "react";
import "../styles/styles.scss";
import { Spin, Alert } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import TableComponent from "../components/reusableComponents/TableComponent.tsx";
import ButtonComponent from "../components/reusableComponents/ButtonComponent";
import AlertComponent from "../components/reusableComponents/AlertComponent";
import { LeaseData } from "../types/types.ts";
import { LeaseModalComponent } from "../components/LeaseModalComponent";
import { SearchOutlined } from "@ant-design/icons";
import { Input, message } from "antd";
import type { ColumnType } from "antd/es/table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { FileTextOutlined, SendOutlined, SyncOutlined, EditOutlined, StopOutlined } from "@ant-design/icons";
import { PageLoader } from "../components/reusableComponents/CardSkeletonLoader";

// Use VITE_API_URL for the server URL, ensuring no trailing slash
const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/$/, "");

// Log the API_URL to ensure it's correctly formed
console.log("API URL:", API_URL);

// Default status filters in case dynamic generation fails
const DEFAULT_STATUS_FILTERS = [
    { text: "Active", value: "active" },
    { text: "Expires Soon", value: "expires_soon" },
    { text: "Expired", value: "expired" },
    { text: "Draft", value: "draft" },
    { text: "Terminated", value: "terminated" },
    { text: "Pending Approval", value: "pending_approval" },
];

// Mock lease data for when Documenso/API is not available
const MOCK_LEASE_DATA: (LeaseData & { admin_doc_url?: string })[] = [
    {
        id: 1,
        tenantId: 101,
        apartmentId: 201,
        tenantEmail: "john.doe@example.com",
        tenantName: "John Doe",
        apartment: "Apt 101",
        leaseStartDate: "2024-01-01",
        leaseEndDate: "2025-12-31",
        rentAmount: 2500,
        status: "active",
        admin_doc_url: "https://demo.documenso.com/view/lease-101", // Mock Documenso URL
    },
    {
        id: 2,
        tenantId: 102,
        apartmentId: 202,
        tenantEmail: "jane.smith@example.com",
        tenantName: "Jane Smith",
        apartment: "Apt 102",
        leaseStartDate: "2024-02-15",
        leaseEndDate: "2025-02-14",
        rentAmount: 2200,
        status: "active",
        admin_doc_url: "https://demo.documenso.com/view/lease-102", // Mock Documenso URL
    },
    {
        id: 3,
        tenantId: 103,
        apartmentId: 203,
        tenantEmail: "mike.johnson@example.com",
        tenantName: "Mike Johnson",
        apartment: "Apt 203",
        leaseStartDate: "2023-08-01",
        leaseEndDate: dayjs().subtract(30, "days").format("YYYY-MM-DD"), // Expired 30 days ago
        rentAmount: 2800,
        status: "expired",
    },
    {
        id: 4,
        tenantId: 104,
        apartmentId: 204,
        tenantEmail: "sarah.wilson@example.com",
        tenantName: "Sarah Wilson",
        apartment: "Apt 204",
        leaseStartDate: "2024-06-01",
        leaseEndDate: dayjs().add(45, "days").format("YYYY-MM-DD"), // Expires in 45 days
        rentAmount: 1950,
        status: "expires_soon",
        admin_doc_url: "https://demo.documenso.com/view/lease-104", // Mock Documenso URL
    },
    {
        id: 5,
        tenantId: 105,
        apartmentId: 205,
        tenantEmail: "david.brown@example.com",
        tenantName: "David Brown",
        apartment: "Apt 205",
        leaseStartDate: "2024-03-01",
        leaseEndDate: "2025-02-28",
        rentAmount: 3100,
        status: "draft",
    },
    {
        id: 6,
        tenantId: 106,
        apartmentId: 206,
        tenantEmail: "emily.davis@example.com",
        tenantName: "Emily Davis",
        apartment: "Apt 206",
        leaseStartDate: "2024-01-15",
        leaseEndDate: "2025-01-14",
        rentAmount: 2600,
        status: "pending_approval",
    },
    {
        id: 7,
        tenantId: 107,
        apartmentId: 207,
        tenantEmail: "alex.martinez@example.com",
        tenantName: "Alex Martinez",
        apartment: "Apt 207",
        leaseStartDate: "2023-09-01",
        leaseEndDate: "2024-08-31",
        rentAmount: 2400,
        status: "terminated",
        admin_doc_url: "https://demo.documenso.com/view/lease-107", // Mock Documenso URL
    },
];

export default function AdminViewEditLeases() {
    const { getToken, isLoaded: authLoaded, isSignedIn } = useAuth();
    const [authError, setAuthError] = useState<string | null>(null);

    const [modalConfig, setModalConfig] = useState({
        visible: false,
        mode: "add" as "add" | "send" | "renew" | "amend",
        selectedLease: null as LeaseData | null,
    });
    const [statusFilters, setStatusFilters] = useState<{ text: string; value: string }[]>(DEFAULT_STATUS_FILTERS);

    // Initialize the query client
    const queryClient = useQueryClient();

    // Verify authentication when component loads
    useEffect(() => {
        const verifyAuth = async () => {
            try {
                if (isSignedIn) {
                    const token = await getToken();
                    if (!token) {
                        setAuthError("Authentication token not available. Please sign in again.");
                    } else {
                        // Clear any previous error if we have a valid token
                        setAuthError(null);
                    }
                }
            } catch (error) {
                console.error("Authentication error:", error);
                setAuthError("Failed to authenticate. Please try signing in again.");
            }
        };

        if (authLoaded) {
            verifyAuth();
        }
    }, [authLoaded, isSignedIn, getToken]);

    // Function to extract and format status filters
    const extractStatusFilters = (data: LeaseData[]) => {
        if (data && Array.isArray(data)) {
            try {
                // Extract unique status values from the lease data
                const uniqueStatuses = [...new Set(data.map((lease) => lease.status))];

                // Format the status values for display
                const formattedFilters = uniqueStatuses
                    .filter((status) => status) // Filter out any null/undefined values
                    .map((status) => {
                        // Parse the status string
                        const text = String(status)
                            .split("_")
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(" ");

                        return { text, value: status };
                    });

                // Sort filters alphabetically for better UX
                formattedFilters.sort((a, b) => a.text.localeCompare(b.text));

                setStatusFilters(formattedFilters);
            } catch (error) {
                console.error("Error generating status filters:", error);
                // Default filters will be used from initial state
            }
        }
    };

    // Populate table with Tanstack Query
    const {
        data: leases = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery<LeaseData[]>({
        queryKey: ["tenants", "leases"],
        queryFn: async () => {
            if (!API_URL) {
                console.log("API URL not configured, using mock data");
                extractStatusFilters(MOCK_LEASE_DATA);
                return MOCK_LEASE_DATA;
            }

            // Get the authentication token
            const token = await getToken();
            if (!token) {
                console.log("No authentication token available, using mock data");
                extractStatusFilters(MOCK_LEASE_DATA);
                return MOCK_LEASE_DATA;
            }

            try {
                console.log(`Fetching leases from: ${API_URL}/admin/leases/`);
                console.log("Using auth token:", token ? "Token available" : "No token");

                const response = await fetch(`${API_URL}/admin/leases/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        console.log("Authentication failed, using mock data");
                        extractStatusFilters(MOCK_LEASE_DATA);
                        return MOCK_LEASE_DATA;
                    }
                    console.log(`API request failed (${response.status}), using mock data`);
                    extractStatusFilters(MOCK_LEASE_DATA);
                    return MOCK_LEASE_DATA;
                }

                const data = await response.json();
                console.log("Raw API response:", data);

                // If API returns empty data or null, use mock data
                if (!data || (Array.isArray(data) && data.length === 0)) {
                    console.log("API returned empty data, using mock data");
                    extractStatusFilters(MOCK_LEASE_DATA);
                    return MOCK_LEASE_DATA;
                }

                console.log("Sample lease data:", data[0]);
                extractStatusFilters(data);
                return data;
            } catch (fetchError) {
                console.log("Network error when fetching leases, using mock data:", fetchError);
                extractStatusFilters(MOCK_LEASE_DATA);
                return MOCK_LEASE_DATA;
            }
        },
        // Only run query if authentication is loaded and user is signed in
        enabled: authLoaded && isSignedIn && !authError,
        // Only retry once to avoid flooding logs with errors
        retry: 1,
        // Set stale time to reduce unnecessary refetches
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Retry fetching leases if auth is fixed
    useEffect(() => {
        if (authLoaded && isSignedIn && !authError) {
            refetch();
        }
    }, [authLoaded, isSignedIn, authError, refetch]);

    const getColumnSearchProps = (dataIndex: keyof LeaseData, title: string): ColumnType<LeaseData> => {
        return {
            filterDropdown: (filterDropdownProps) => {
                return (
                    <div style={{ padding: 8 }}>
                        <Input
                            placeholder={"Search " + title}
                            value={filterDropdownProps.selectedKeys[0]}
                            onChange={(e) => filterDropdownProps.setSelectedKeys(e.target.value ? [e.target.value] : [])}
                            style={{ width: 188, marginBottom: 8, display: "block" }}
                        />
                        <ButtonComponent
                            type="primary"
                            title="Search"
                            icon={<SearchOutlined />}
                            size="small"
                            onClick={() => filterDropdownProps.confirm()}
                        />
                        <ButtonComponent
                            type="default"
                            title="Reset"
                            size="small"
                            onClick={() => {
                                if (filterDropdownProps.clearFilters) {
                                    filterDropdownProps.clearFilters();
                                }
                                filterDropdownProps.confirm();
                            }}
                        />
                    </div>
                );
            },
            filterIcon: function (filtered) {
                return <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />;
            },
            onFilter: function (value, record) {
                // Safely handle null/undefined values
                const recordValue = record[dataIndex];
                if (recordValue == null) {
                    return false;
                }
                return recordValue.toString().toLowerCase().includes(value.toString().toLowerCase());
            },
        };
    };

    // Status is calculated on the backend, but we maintain this function for backward compatibility
    const getLeaseStatus = (record: { leaseEndDate: string; status: string }) => {
        // If the status is already set to terminated, respect that
        if (record.status === "active") {
            const today = dayjs();
            const leaseEnd = dayjs(record.leaseEndDate);
            if (leaseEnd.diff(today, "days") <= 60) return "expires_soon";
        }
        return record.status;
    };

    // Prepare lease data before rendering
    const filteredData: (LeaseData & { adminDocUrl?: string })[] = Array.isArray(leases)
        ? leases.map((lease) => {
              return {
                  ...lease,
                  key: lease.id,
                  id: lease.id,
                  tenantId: lease.tenantId || lease.id,
                  apartmentId: lease.apartmentId,
                  tenantName: lease.tenantName || "",
                  apartment: lease.apartment || "",
                  leaseStartDate: dayjs(lease.leaseStartDate).format("YYYY-MM-DD"),
                  leaseEndDate: dayjs(lease.leaseEndDate).format("YYYY-MM-DD"),
                  rentAmount: lease.rentAmount ? lease.rentAmount / 100 : 0,
                  status: lease.status === "terminated" ? "terminated" : getLeaseStatus(lease),
                  adminDocUrl: (lease as LeaseData & { admin_doc_url?: string }).admin_doc_url,
              };
          })
        : [];

    const showSendModal = (lease: LeaseData & { adminDocUrl?: string }) => {
        console.log("Opening send modal", lease);
        setModalConfig({
            visible: true,
            mode: "send",
            selectedLease: {
                ...lease,
                formattedStartDate: dayjs(lease.leaseStartDate),
                formattedEndDate: dayjs(lease.leaseEndDate),
            } as LeaseData,
        });
    };

    const handleModalClose = () => {
        setModalConfig((prev) => ({ ...prev, visible: false }));

        // Invalidate the query to trigger a refetch
        queryClient.invalidateQueries({ queryKey: ["tenants", "leases"] });
    };

    const handleAddLease = () => {
        setModalConfig({
            visible: true,
            mode: "add",
            selectedLease: null,
        });
    };

    const handleRenew = (lease: LeaseData & { adminDocUrl?: string }) => {
        console.log("Renewing lease:", lease);

        // Ensure we have the correct IDs (especially apartmentId)
        if (!lease.apartmentId) {
            message.error("Cannot renew lease: Missing apartment ID");
            return;
        }

        setModalConfig({
            visible: true,
            mode: "renew",
            selectedLease: {
                ...lease,
                formattedStartDate: dayjs().add(1, "day"),
                formattedEndDate: dayjs().add(1, "year"),
            } as LeaseData,
        });
    };

    const handleAmend = (lease: LeaseData & { adminDocUrl?: string }) => {
        console.log("Amend button clicked", lease);

        // Ensure we have the correct IDs
        if (!lease.apartmentId) {
            console.error("Missing apartmentId in lease:", lease);
            message.error("Cannot amend lease: Missing apartment ID");
            return;
        }

        console.log("Setting modal config:", {
            visible: true,
            mode: "amend",
            selectedLease: {
                ...lease,
                formattedStartDate: dayjs(lease.leaseStartDate),
                formattedEndDate: dayjs(lease.leaseEndDate),
            },
        });

        setModalConfig({
            visible: true,
            mode: "amend",
            selectedLease: {
                ...lease,
                formattedStartDate: dayjs(lease.leaseStartDate),
                formattedEndDate: dayjs(lease.leaseEndDate),
            } as LeaseData,
        });

        // Log state change after setting it
        setTimeout(() => {
            console.log("Modal config after state update:", modalConfig);
        }, 0);
    };

    const handleTerminate = async (leaseId: number) => {
        try {
            const token = await getToken();
            if (!token) {
                throw new Error("Authentication token is required");
            }

            const payload = {
                id: leaseId,
                updated_by: 100, // You might want to use the actual user ID here
            };

            const response = await fetch(`${API_URL}/admin/leases/terminate/${leaseId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Failed to terminate lease");
            }

            message.success("Lease successfully terminated");

            // Invalidate the query to trigger a refetch
            queryClient.invalidateQueries({ queryKey: ["tenants", "leases"] });
        } catch (err) {
            console.error("Error terminating lease:", err);
            message.error("Failed to terminate lease");
        }
    };

    // Define lease table columns
    const leaseColumns: ColumnsType<LeaseData> = [
        {
            title: "Tenant Name",
            dataIndex: "tenantName",
            key: "tenantName",
            sorter: (a, b) => a.tenantName.localeCompare(b.tenantName),
            ...getColumnSearchProps("tenantName", "Tenant Name"),
        },
        {
            title: "Apartment",
            dataIndex: "apartment",
            key: "apartment",
            ...getColumnSearchProps("apartment", "Apartment"),
        },
        {
            title: "Lease Start",
            dataIndex: "leaseStartDate",
            key: "leaseStartDate",
            sorter: (a, b) => dayjs(a.leaseStartDate).unix() - dayjs(b.leaseStartDate).unix(),
            ...getColumnSearchProps("leaseStartDate", "Lease Start"),
        },
        {
            title: "Lease End",
            dataIndex: "leaseEndDate",
            key: "leaseEndDate",
            sorter: (a, b) => dayjs(a.leaseEndDate).unix() - dayjs(b.leaseEndDate).unix(),
            ...getColumnSearchProps("leaseEndDate", "Lease End"),
        },
        {
            title: "Rent Amount ($)",
            dataIndex: "rentAmount",
            key: "rentAmount",
            sorter: (a, b) => a.rentAmount - b.rentAmount,
            ...getColumnSearchProps("rentAmount", "Rent Amount"),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <AlertComponent
                    title={status}
                    description=""
                    type={status === "active" ? "success" : "warning"}
                />
            ),
            filters: statusFilters,
            onFilter: (value, record) => record.status === value,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record: LeaseData & { adminDocUrl?: string }) => (
                <div className="action-buttons">
                    {/* View button - always first if available */}
                    {record.adminDocUrl && (
                        <button
                            className="btn btn-view"
                            onClick={() => window.open(record.adminDocUrl, "_blank")}
                            title="View Lease Document">
                            <FileTextOutlined />
                            <span>View</span>
                        </button>
                    )}

                    {/* Primary actions based on status */}
                    {record.status === "draft" && (
                        <button
                            className="btn btn-send"
                            onClick={() => showSendModal(record)}
                            title="Send Lease">
                            <SendOutlined />
                            <span>Send</span>
                        </button>
                    )}

                    {/* Renewal for expired/expiring leases */}
                    {(record.status === "expired" || record.status === "expires_soon") && (
                        <button
                            className="btn btn-renew"
                            onClick={() => handleRenew(record)}
                            title="Renew Lease">
                            <SyncOutlined />
                            <span>Renew</span>
                        </button>
                    )}

                    {/* Amendment for active/pending leases */}
                    {(record.status === "active" || record.status === "expires_soon" || record.status === "draft") && (
                        <button
                            className="btn btn-amend"
                            onClick={() => handleAmend(record)}
                            title="Amend Lease">
                            <EditOutlined />
                            <span>Amend</span>
                        </button>
                    )}

                    {/* Termination - always last as it's destructive */}
                    {(record.status === "active" || record.status === "pending_approval" || record.status === "expires_soon") && (
                        <button
                            className="btn btn-terminate"
                            onClick={() => handleTerminate(record.id)}
                            title="Terminate Lease">
                            <StopOutlined />
                            <span>Terminate</span>
                        </button>
                    )}
                </div>
            ),
        },
    ];

    // Render authentication errors if needed
    if (!authLoaded) {
        return (
            <div className="container overflow-hidden">
                <h1 className="p-3 text-primary">Admin View & Edit Leases</h1>
                <Spin
                    size="large"
                    tip="Loading authentication..."
                />
            </div>
        );
    }

    if (!isSignedIn) {
        return (
            <div className="container overflow-hidden">
                <h1 className="p-3 text-primary">Admin View & Edit Leases</h1>
                <Alert
                    message="Authentication Required"
                    description="You need to sign in to view this page."
                    type="error"
                    showIcon
                />
            </div>
        );
    }

    if (authError) {
        return (
            <div className="container overflow-hidden">
                <h1 className="p-3 text-primary">Admin View & Edit Leases</h1>
                <Alert
                    message="Authentication Error"
                    description={authError}
                    type="error"
                    showIcon
                />
            </div>
        );
    }

    // Render loading, error, or table
    return (
        <div className="container overflow-hidden">
            <h1 className="p-3 text-primary">Admin View & Edit Leases</h1>

            <div className="mb-3">
                <ButtonComponent
                    type="primary"
                    title="Add New Lease"
                    onClick={handleAddLease}
                />
            </div>

            {isLoading ? (
                <PageLoader message="Loading lease data..." />
            ) : isError ? (
                <Alert
                    message="Error Loading Leases"
                    description={(error as Error)?.message || "Failed to fetch leases"}
                    type="error"
                    showIcon
                />
            ) : (
                <TableComponent<LeaseData>
                    columns={leaseColumns}
                    dataSource={filteredData}
                    scroll={{ x: "100%" }}
                    onChange={(pagination, filters, sorter, extra) => {
                        // This properly forwards the event to the underlying Table component
                        console.log("Table changed:", { pagination, filters, sorter, extra });
                    }}
                />
            )}
            <LeaseModalComponent
                visible={modalConfig.visible}
                onClose={handleModalClose}
                mode={modalConfig.mode}
                selectedLease={modalConfig.selectedLease}
            />
        </div>
    );
}

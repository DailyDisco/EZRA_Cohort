import { ToolOutlined, WarningOutlined, InboxOutlined, CarOutlined } from '@ant-design/icons';
import { Modal, Button, Divider, Form, Input, Select } from 'antd';
import { useState, useEffect, useMemo } from 'react';
import { ComplaintsData, Parking, ParkingEntry, WorkOrderData } from '../types/types';
import ModalComponent from '../components/ModalComponent';
import AlertComponent from '../components/reusableComponents/AlertComponent';
import ButtonComponent from '../components/reusableComponents/ButtonComponent';
import { CardComponent } from '../components/reusableComponents/CardComponent';
import { CardSkeletonLoader } from '../components/reusableComponents/CardSkeletonLoader';
import PageTitleComponent from '../components/reusableComponents/PageTitleComponent';
import MyChatBot from '../components/ChatBot';
import { useAuth, useUser } from '@clerk/react-router';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';

interface LeaseStatus {
    lease_status: string;
    url: string;
}

// Use VITE_API_URL for the server URL, ensuring no trailing slash
const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const absoluteServerUrl = serverUrl.replace(/\/$/, ''); // Remove trailing slash if present

export const TenantDashBoard = () => {
    const [isSigningModalVisible, setSigningModalVisible] = useState(false);
    const { user } = useUser();
    const userId = user?.publicMetadata['db_id'];
    const { getToken } = useAuth();

    // Removed excessive logging for performance

    async function getParkingPermit() {
        const authToken = await getToken();
        if (!authToken) {
            throw new Error('[TENANT_DASHBOARD] Error unauthorized');
        }
        const res = await fetch(`${absoluteServerUrl}/tenant/parking`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (!res.ok) {
            throw new Error('[TENANT_DASHBOARD] Error parking_permits request failed');
        }
        return (await res.json()) as Parking[];
    }

    async function getComplaints() {
        const authToken = await getToken();
        if (!authToken) {
            throw new Error('[TENANT_DASHBOARD] Error unauthorized');
        }
        const res = await fetch(`${absoluteServerUrl}/tenant/complaints`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (!res.ok) {
            throw new Error('[TENANT_DASHBOARD] Error complaints request failed');
        }
        const data = (await res.json()) as ComplaintsData[];
        return data;
    }

    async function getWorkOrders() {
        const authToken = await getToken();
        if (!authToken) {
            throw new Error('[TENANT_DASHBOARD] Error unauthorized');
        }
        const res = await fetch(`${absoluteServerUrl}/tenant/work_orders`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (!res.ok) {
            throw new Error('[TENANT_DASHBOARD] Error work orders request failed');
        }
        const data = (await res.json()) as WorkOrderData[];
        return data;
    }

    async function getLockers() {
        const authToken = await getToken();
        if (!authToken) {
            throw new Error('[TENANT_DASHBOARD] Error unauthorized');
        }
        const res = await fetch(`${absoluteServerUrl}/tenant/lockers`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (!res.ok) {
            throw new Error('[TENANT_DASHBOARD] Error complaints request failed');
        }
        return (await res.json()) as ComplaintsData[];
    }

    const clerkUserId = user?.id;

    // Common query configuration to reduce repetition
    const queryConfig = {
        retry: 2,
        staleTime: 5 * 60 * 1000, // 5 minutes
    };

    const [complaints, workOrders, lockers, parking] = useQueries({
        queries: [
            {
                queryKey: [`${clerkUserId}-complaints`],
                queryFn: getComplaints,
                ...queryConfig,
            },
            {
                queryKey: [`${clerkUserId}-work-orders`],
                queryFn: getWorkOrders,
                ...queryConfig,
            },
            {
                queryKey: [`${clerkUserId}-lockers`],
                queryFn: getLockers,
                ...queryConfig,
            },
            {
                queryKey: [`${clerkUserId}-parking`],
                queryFn: getParkingPermit,
                ...queryConfig,
            },
        ],
    });

    // Fetch lease status using TanStack Query
    const { data: leaseStatus, error: leaseError } = useQuery<LeaseStatus>({
        queryKey: ['leaseStatus', clerkUserId], // Unique key for the query
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
            const data = await response.json();
            return data;
        },
        enabled: !!userId,
        retry: 2,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });

    // This is the recommended approach in newer versions of TanStack Query. `onSuccess` is deprecated
    useEffect(() => {
        if (leaseStatus && leaseStatus.lease_status && leaseStatus.lease_status !== 'no_lease') {
            if (['pending_approval', 'terminated', 'expired'].includes(leaseStatus.lease_status)) {
                setSigningModalVisible(true);
            }
        }
    }, [leaseStatus]);

    // This is used to redirect to signing URL when button is clicked
    const handleOk = () => {
        if (leaseStatus?.url) {
            window.location.href = leaseStatus.url;
        } else {
            console.error('No signing URL available');
        }
    };

    // Show loading only for lease status, other data can load independently

    // Check if any queries have errors and create specific error messages
    const errorDetails = [];
    if (complaints.error) errorDetails.push('complaints');
    if (workOrders.error) errorDetails.push('work orders');
    if (lockers.error) errorDetails.push('package information');
    if (parking.error) errorDetails.push('parking permits');
    if (leaseError) errorDetails.push('lease status');

    const hasErrors = errorDetails.length > 0;

    // Check if any queries are initially loading
    const isInitialLoading = complaints.isLoading && workOrders.isLoading && lockers.isLoading && parking.isLoading;

    // Memoize card values to prevent unnecessary recalculations
    const cardValues = useMemo(
        () => ({
            complaintsCount: complaints.data?.length ?? 0,
            workOrdersCount: workOrders.data?.length ?? 0,
            lockersCount: lockers.data?.length ?? 0,
            parkingCount: parking.data?.length ?? 0,
        }),
        [complaints.data?.length, workOrders.data?.length, lockers.data?.length, parking.data?.length],
    );

    return (
        <div className="container">
            {/* <h1 className="my-4">Tenant Dashboard</h1> */}
            <PageTitleComponent title="Tenant Dashboard" />

            {/* Show error alert if any queries failed */}
            {hasErrors && (
                <AlertComponent
                    title="Data Loading Error"
                    message={`Unable to load: ${errorDetails.join(', ')}`}
                    description="Please refresh the page or contact support if the problem persists."
                    type="error"
                />
            )}

            {/* <div className="alert-container"> */}
            <AlertComponent
                title=""
                message="Welcome to the Tenant Dashboard"
                description="Please review and sign your lease agreement. Remember to make timely rent payments."
                type="warning"
            />
            {/* </div> */}

            {/* Dashboard Statistics Cards */}
            <h2 className="my-3 p-3 text-center">Quick Actions</h2>
            <div className="flex-container my-3">
                {isInitialLoading ? (
                    <>
                        <CardSkeletonLoader />
                        <CardSkeletonLoader />
                        <CardSkeletonLoader />
                    </>
                ) : (
                    <>
                        <CardComponent
                            title="Complaints"
                            value={cardValues.complaintsCount}
                            description="Something not working right or disturbing you? Let us know."
                            hoverable={true}
                            icon={<ToolOutlined className="icon" />}
                            button={<TenantCreateComplaintsModal />}
                        />
                        <CardComponent
                            title="Package info"
                            value={cardValues.lockersCount}
                            description={`${cardValues.lockersCount ? 'You have a package. Click the button at your locker to open it.' : 'When package arrives you will be notified here.'}`}
                            hoverable={true}
                            icon={<InboxOutlined className="icon" />}
                            button={<TenantOpenLockerModal numberOfPackages={cardValues.lockersCount} />}
                        />
                        <CardComponent
                            title="Guest Parking"
                            value={cardValues.parkingCount}
                            description="Got a guest coming to visit? Make sure they have spots to park"
                            hoverable={true}
                            icon={<CarOutlined className="icon" />}
                            button={<TenantParkingPeritModal userParkingPermitsUsed={cardValues.parkingCount} />}
                        />
                    </>
                )}
            </div>

            {/* Quick Access Documents Section */}
            <h2 className="my-3 p-3 text-center">Quick Access Documents Section</h2>
            <div className="flex-container mb-3">
                <CardComponent
                    title="Lease"
                    description="View and sign your lease"
                    hoverable={true}
                    button={
                        <ModalComponent
                            type="default"
                            buttonTitle="View Lease"
                            content="Lease should go here"
                            buttonType="primary"
                            handleOkay={async () => {}}
                            setUserId={() => {}}
                            setAccessCode={() => {}}
                            selectedUserId=""
                            accessCode=""
                        />
                    }
                />
                <CardComponent
                    title="Work Orders"
                    description={'View your work orders here.'}
                    hoverable={true}
                    value={cardValues.workOrdersCount}
                    button={<TenantViewWorkOrdersModal data={workOrders.data} />}
                />
                <CardComponent
                    title="Complaints"
                    description={'View your complaints here.'}
                    hoverable={true}
                    value={cardValues.complaintsCount}
                    button={<TenantViewComplaintsModal data={complaints.data} />}
                />

                <MyChatBot />
            </div>

            {/* Inescapable Modal for lease signing */}
            <Modal
                title="Action Required: Lease Signing"
                open={isSigningModalVisible}
                onOk={handleOk}
                onCancel={() => {}} // Empty function prevents closing
                maskClosable={false} // Prevents closing when clicking outside
                keyboard={false} // Prevents closing with ESC key
                closable={false} // Removes the X button
                footer={[
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleOk}>
                        Sign Lease Now
                    </Button>,
                ]}>
                <div style={{ textAlign: 'center' }}>
                    <WarningOutlined style={{ fontSize: '4rem', color: '#faad14', marginBottom: '1rem' }} />
                    <h3 style={{ marginBottom: '1rem' }}>Your Lease Requires Attention</h3>
                    <p>
                        Your lease status is <strong>{leaseStatus?.lease_status === 'pending_approval' ? 'Pending Approval' : leaseStatus?.lease_status}</strong>.
                    </p>
                    <p>You must sign your lease to continue using the tenant portal.</p>
                    <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>This action is required and cannot be dismissed.</p>
                </div>
            </Modal>
        </div>
    );
};

interface ParkingPermitModalProps {
    userParkingPermitsUsed: number;
}

function TenantParkingPeritModal(props: ParkingPermitModalProps) {
    const queryClient = useQueryClient();
    const [internalModalOpen, setInternalModalOpen] = useState(false);
    const { userId, getToken } = useAuth();
    const [parkingPermitForm] = Form.useForm<ParkingEntry>();
    const { mutate: createParkingPermit, isPending: isParkingPending } = useMutation({
        mutationKey: [`${userId}-create-parking`],
        mutationFn: async () => {
            const authToken = await getToken();
            if (!authToken) {
                throw new Error('[TENANT_DASHBOARD] Error unauthorized');
            }

            // console.log(`FORM VALUES: ${JSON.stringify(parkingPermitForm.getFieldsValue())}`);
            const res = await fetch(`${absoluteServerUrl}/tenant/parking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(parkingPermitForm.getFieldsValue()),
            });

            if (!res.ok) {
                throw new Error('[TENANT_DASHBOARD] Error creating parking_permit');
            }
            return;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [`${userId}-parking`],
            });
            handleCancel();
        },
    });

    const showModal = () => {
        setInternalModalOpen(true);
    };
    const handleCancel = () => {
        setInternalModalOpen(false);
    };
    return (
        <>
            <ButtonComponent
                title="Add Guest Parking"
                type="primary"
                onClick={showModal}
                disabled={props.userParkingPermitsUsed >= 2 ? true : false}
            />
            <Modal
                className="p-3 flex-wrap-row"
                title={<h3>Guest Parking Permit</h3>}
                open={internalModalOpen}
                onOk={() => {
                    createParkingPermit();
                }}
                okText={'Create'}
                onCancel={handleCancel}
                okButtonProps={{ disabled: isParkingPending ? true : false }}
                cancelButtonProps={{ disabled: isParkingPending ? true : false }}>
                <Divider />
                <Form form={parkingPermitForm}>
                    <p className="fs-6">Guest Name</p>
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Please enter a guest name', type: 'string' }]}>
                        <Input placeholder="John Doe" />
                    </Form.Item>
                    <p className="fs-6">Car Color</p>
                    <Form.Item
                        name="car-color"
                        rules={[{ required: true, message: "Enter guest's car color", type: 'string' }]}>
                        <Input placeholder="Blue" />
                    </Form.Item>
                    <p className="fs-6">Car Model</p>
                    <Form.Item
                        name="car-model"
                        rules={[{ required: true, message: "Enter guest's car model", type: 'string' }]}>
                        <Input
                            placeholder="Car Make"
                            type="text"
                        />
                    </Form.Item>
                    <p className="fs-6">License Plate</p>
                    <Form.Item
                        name="license-plate-number"
                        rules={[{ required: true, message: "Enter guest's license plate", type: 'string' }]}>
                        <Input placeholder="3ha3-3213" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

interface WorkOrderModalProps {
    data: WorkOrderData[] | undefined;
}

function TenantViewWorkOrdersModal(props: WorkOrderModalProps) {
    const [internalModalOpen, setInternalModalOpen] = useState(false);
    const showModal = () => {
        setInternalModalOpen(true);
    };
    const handleCancel = () => {
        setInternalModalOpen(false);
    };
    return (
        <>
            <ButtonComponent
                title="View Work Orders"
                type="primary"
                onClick={showModal}
            />
            <Modal
                className="p-3 flex-wrap-row"
                title={<h3>Work Orders</h3>}
                open={internalModalOpen}
                onOk={() => {}}
                onCancel={handleCancel}
                okButtonProps={{ hidden: true, disabled: true }}
                cancelButtonProps={{ hidden: true, disabled: true }}>
                <Divider />
                <div style={{ overflowY: 'auto', height: '200px' }}>
                    {props.data ? (
                        <>
                            {props.data.map((order, idx) => (
                                <div
                                    key={idx}
                                    className="flex gap-2 mb-2 mt-2 border-b-2 pb-2 border-gray-300">
                                    <p>{order.title}</p>
                                    <p>
                                        Category: <span style={{ color: 'green' }}>{order.category}</span>
                                    </p>
                                    <p>
                                        Status: <span style={{ color: 'green' }}>{order.status}</span>
                                    </p>
                                </div>
                            ))}
                        </>
                    ) : (
                        <p>No work orders found.</p>
                    )}
                </div>
            </Modal>
        </>
    );
}

interface ComplaintModalProps {
    data: ComplaintsData[] | undefined;
}

function TenantViewComplaintsModal(props: ComplaintModalProps) {
    const [internalModalOpen, setInternalModalOpen] = useState(false);
    const showModal = () => {
        setInternalModalOpen(true);
    };
    const handleCancel = () => {
        setInternalModalOpen(false);
    };
    return (
        <>
            <ButtonComponent
                title="View Complaints"
                type="primary"
                onClick={showModal}
            />
            <Modal
                className="p-3 flex-wrap-row"
                title={<h3>Complaints</h3>}
                open={internalModalOpen}
                onCancel={handleCancel}
                okButtonProps={{ hidden: true, disabled: true }}
                cancelButtonProps={{ hidden: true, disabled: true }}>
                <Divider />
                <div style={{ overflowY: 'auto', height: '200px' }}>
                    {props.data ? (
                        <>
                            {props.data.map((order, idx) => (
                                <div
                                    key={idx}
                                    className="flex gap-2 mb-2 mt-2 border-b-2 pb-2 border-gray-300">
                                    <p>{order.title}</p>
                                    <p>
                                        Category: <span style={{ color: 'green' }}>{order.category}</span>
                                    </p>
                                    <p>
                                        Status: <span style={{ color: 'green' }}>{order.status}</span>
                                    </p>
                                </div>
                            ))}
                        </>
                    ) : (
                        <p>No complaints found.</p>
                    )}
                </div>
            </Modal>
        </>
    );
}
function TenantCreateComplaintsModal() {
    const queryClient = useQueryClient();
    const { getToken, userId } = useAuth();
    const [internalModalOpen, setInternalModalOpen] = useState(false);
    const [complaintForm] = Form.useForm<ComplaintsData>();
    const showModal = () => {
        setInternalModalOpen(true);
    };
    const handleCancel = () => {
        setInternalModalOpen(false);
    };

    const { mutate: createComplaint, isPending: isPendingComplaint } = useMutation({
        mutationKey: [`${userId}-create-complaint`],
        mutationFn: async () => {
            const authToken = await getToken();
            if (!authToken) {
                throw new Error('[TENANT_DASHBOARD] Error unauthorized');
            }

            // console.log(`COMPLAINT FORM: ${JSON.stringify(complaintForm.getFieldsValue())}`);
            const res = await fetch(`${absoluteServerUrl}/tenant/complaints`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(complaintForm.getFieldsValue()),
            });

            if (!res.ok) {
                throw new Error('[TENANT_DASHBOARD] Error creating complaint');
            }
            return;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [`${userId}-complaints`],
            });
            handleCancel();
        },
    });
    return (
        <>
            <ButtonComponent
                type="primary"
                title="Create Complaint"
                onClick={showModal}
            />
            <Modal
                className="p-3 flex-wrap-row"
                title={<h3>Complaints</h3>}
                open={internalModalOpen}
                onOk={() => {
                    createComplaint();
                }}
                okText={'Create'}
                onCancel={handleCancel}
                okButtonProps={{ disabled: isPendingComplaint ? true : false }}
                cancelButtonProps={{ disabled: isPendingComplaint ? true : false }}>
                <p>Enter information about a complaint that you're having here.</p>
                <Divider />
                <Form form={complaintForm}>
                    <p className="fs-7">Title</p>
                    <Form.Item
                        name="title"
                        rules={[{ required: true, type: 'string', min: 3, max: 50 }]}>
                        <Input
                            placeholder="Enter a title"
                            type="text"
                        />
                    </Form.Item>
                    <p className="fs-7">Description</p>
                    <Form.Item
                        name="description"
                        rules={[{ required: true, type: 'string', min: 5, max: 500 }]}>
                        <Input.TextArea
                            placeholder="Enter a brief description for complaint"
                            rows={4}
                        />
                    </Form.Item>
                    <p className="fs-7">Category</p>
                    <Form.Item
                        name="category"
                        rules={[{ required: true, type: 'string' }]}>
                        <Select placeholder={'Select a category'}>
                            {['maintenance', 'noise', 'security', 'parking', 'neighbor', 'trash', 'internet', 'lease', 'natural_disaster', 'other'].map((c) => (
                                <Select.Option key={c}>{c}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

interface LockerModalProps {
    numberOfPackages: number;
}

function TenantOpenLockerModal(props: LockerModalProps) {
    const queryClient = useQueryClient();
    const { getToken, userId } = useAuth();
    const [internalModalOpen, setInternalModalOpen] = useState(false);
    const showModal = () => {
        setInternalModalOpen(true);
    };
    const handleCancel = () => {
        setInternalModalOpen(false);
    };
    const { mutate: openLocker } = useMutation({
        mutationKey: [`${userId}-locker`],
        mutationFn: async () => {
            const authToken = await getToken();
            if (!authToken) {
                throw new Error('[TENANT_DASHBOARD] Error unauthorized');
            }
            const res = await fetch(`${absoluteServerUrl}/tenants/lockers/unlock`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (!res.ok) {
                throw new Error('[TENANT_DASHBOARD] Error opening locker');
            }
            return;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [`${userId}-lockers`],
            });
        },
    });

    useEffect(() => {
        if (internalModalOpen) {
            openLocker();
        }
    }, [internalModalOpen, openLocker, setInternalModalOpen]);

    return (
        <>
            <ButtonComponent
                type="primary"
                title="Open Locker"
                onClick={showModal}
                disabled={props.numberOfPackages === 0 ? true : false}
            />
            <Modal
                className="p-3 flex-wrap-row"
                title={<h3>Locker Notification</h3>}
                open={internalModalOpen}
                onCancel={handleCancel}
                okButtonProps={{ hidden: true, disabled: true }}
                cancelButtonProps={{ hidden: true, disabled: true }}
                aria-describedby="locker-status-message">
                <Divider />
                <span
                    id="locker-status-message"
                    className="d-flex align-items-center text-success">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-key-square-icon lucide-key-square mb-3 me-1">
                        <path d="M12.4 2.7a2.5 2.5 0 0 1 3.4 0l5.5 5.5a2.5 2.5 0 0 1 0 3.4l-3.7 3.7a2.5 2.5 0 0 1-3.4 0L8.7 9.8a2.5 2.5 0 0 1 0-3.4z" />
                        <path d="m14 7 3 3" />
                        <path d="m9.4 10.6-6.814 6.814A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814" />
                    </svg>
                    <p className="fs-5">Locker is open!</p>
                </span>
            </Modal>
        </>
    );
}

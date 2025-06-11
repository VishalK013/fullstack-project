import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, suspendUser } from "../features/user/UserSlice";
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Switch } from '@mui/material';

function UserList() {
    const dispatch = useDispatch();
    const { loading, users, error } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(fetchUser());
    }, [dispatch]);

    const handleSuspend = (id) => {
        dispatch(suspendUser(id));
    };

    const columns = [
        { field: 'username', headerName: 'Username', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'email', headerName: 'Email', flex: 1.5, headerAlign: 'center', align: 'center' },
        { field: 'role', headerName: 'Role', flex: 1, headerAlign: 'center', align: 'center' },
        {
            field: 'isSuspended',
            headerName: 'Suspended',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Switch
                    checked={params.row.isSuspended}
                    onChange={() => handleSuspend(params.row.id)}
                    color="error"
                />
            ),
        },
    ];

    const rows = users.map(u => ({
        id: u._id,
        username: u.username,
        email: u.email,
        role: u.role,
        isSuspended: u.isSuspended,
    }));

    if (loading) return <p>Loading users...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div style={{ width: 1000, margin: 'auto', textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom mt={10}>All Users</Typography>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pagination
                    initialState={{
                        pagination: { paginationModel: { pageSize: 5, page: 0 } },
                    }}
                    disableSelectionOnClick
                    sx={{
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#f5f5f5',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                        },
                        '& .MuiDataGrid-cell': {
                            fontSize: '0.9rem',
                        },
                    }}
                />
            </div>
        </div>
    );
}

export default UserList;

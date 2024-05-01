import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Popconfirm, message } from "antd"; // Import Popconfirm from antd
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import { DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const DataTable = () => {
  const navigate = useNavigate(); 
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    React.useState({});
  const [selectedRowId, setSelectedRowId] = React.useState(null);

  const handleDeleteConfirmation = (rowId) => {
    setSelectedRowId(rowId);
    setDeleteConfirmationVisible((prev) => ({ ...prev, [rowId]: true }));
  };

  const handleDelete = () => {
    // Implement your delete logic here
    message.success(`Row with ID ${selectedRowId} deleted successfully`);
    setDeleteConfirmationVisible((prev) => ({
      ...prev,
      [selectedRowId]: false,
    }));
  };
  const handleEdit = (customerId) => {
    // Find the selected row based on customerId
    const selectedRow = rows.find((row) => row.id === customerId);
  console.log(selectedRow);
    // Navigate to the EditCustomer page with the selected customer ID and details
    navigate(`/editCustomer/${customerId}`, {
      state: { customerDetails: selectedRow },
    });
  };
  const handleCancelDelete = () => {
    setDeleteConfirmationVisible((prev) => ({
      ...prev,
      [selectedRowId]: false,
    }));
  };
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "customerCode", headerName: "Customer Code", width: 130 },
    { field: "firstName", headerName: "First Name", width: 130 },
    { field: "lastName", headerName: "Last Name", width: 90 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phoneNumber", headerName: "Phone Number", width: 150 },
    { field: "address", headerName: "Address", width: 150 },
    { field: "dob", headerName: "Date of Birth", width: 150 },
    { field: "city", headerName: "City", width: 150 },
    { field: "postalCode", headerName: "Postal Code", width: 150 },
    { field: "creditLimit", headerName: "Credit Limit", width: 150 },

    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            aria-label="edit"
            onClick={() => handleEdit(params.row.id)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="secondary"
            aria-label="delete"
            onClick={() => handleDeleteConfirmation(params.row.id)}
          >
            <DeleteOutlined />
          </IconButton>
          <Popconfirm
            title="Are you sure you want to delete this row?"
            visible={deleteConfirmationVisible[params.row.id] || false}
            onConfirm={handleDelete}
            onCancel={handleCancelDelete}
            okText="Yes"
            cancelText="No"
          />
        </>
      ),
    },
  ];

  const rows = [
  {
    id: 1,
    customerCode: "CC001",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phoneNumber: "123-456-7890",
    address: "123 Main St",
    dob: "1990-01-15",
    city: "New York",
    postalCode: "10001",
    creditLimit: 5000,
  },
 
  {
    id: 15,
    customerCode: "CC015",
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.davis@example.com",
    phoneNumber: "456-789-0123",
    address: "789 Oak Ave",
    dob: "1989-08-22",
    city: "Los Angeles",
    postalCode: "90001",
    creditLimit: 8000,
  },
];


  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  );
};

export default DataTable;

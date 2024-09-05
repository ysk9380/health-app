import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Box,
  Grid,
  CardActions,
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PrintIcon from "@mui/icons-material/Print";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { Email } from "@mui/icons-material";

const ServicesHome: React.FC = () => {
  const transactions = [
    {
      date: "2023-01-01",
      amount: 100,
      description: "Consultation",
      doctor: "Dr. John Doe",
      status: "Pending",
    },
    {
      date: "2023-02-15",
      amount: 200,
      description: "Lab Test",
      doctor: "Dr. Jane Smith",
      status: "Completed",
    },
    {
      date: "2023-03-10",
      amount: 150,
      description: "X-Ray",
      doctor: "Dr. Emily Davis",
      status: "Pending",
    },
    {
      date: "2023-04-05",
      amount: 250,
      description: "MRI Scan",
      doctor: "Dr. Michael Brown",
      status: "Completed",
    },
    {
      date: "2023-05-20",
      amount: 300,
      description: "Surgery",
      doctor: "Dr. Sarah Wilson",
      status: "Pending",
    },
    {
      date: "2023-06-15",
      amount: 120,
      description: "Follow-up",
      doctor: "Dr. John Doe",
      status: "Completed",
    },
  ];

  const columns: GridColDef[] = [
    { field: "date", headerName: "Date", width: 150 },
    { field: "doctor", headerName: "Doctor", width: 150 },
    { field: "amount", headerName: "Amount", width: 100 },
    { field: "status", headerName: "Status", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <>
          <IconButton color="primary" onClick={() => handleView(params.row)}>
            <VisibilityIcon />
          </IconButton>
          <IconButton color="primary" onClick={() => handlePrint(params.row)}>
            <PrintIcon />
          </IconButton>
          <IconButton color="primary" onClick={() => handlePrint(params.row)}>
            <Email />
          </IconButton>
        </>
      ),
    },
  ];

  const rows = transactions.map((transaction, index) => ({
    id: index,
    date: transaction.date,
    doctor: transaction.doctor,
    amount: transaction.amount,
    status: transaction.status,
  }));

  const handleView = (row: any) => {
    // Handle the view action here
    console.log("View button clicked for:", row);
  };

  const handlePrint = (row: any) => {
    // Handle the view action here
    console.log("Print button clicked for:", row);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        <Box mb={2} display="flex" justifyContent="space-between">
          <Card
            sx={{
              flex: 1,
              marginRight: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" component="div" gutterBottom>
                Case Sheet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Created on: January 1, 2023
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Doctor: Dr. John Doe
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1.5 }}
              >
                Diagnosis Summary: Patient diagnosed with acute bronchitis.
              </Typography>
            </CardContent>
            <Box sx={{ mt: "auto" }}>
              <CardActions>
                <Button size="small">Update</Button>
                <Button size="small">Admit IPD</Button>
                <Button size="small">Create Bill</Button>
              </CardActions>
            </Box>
          </Card>

          <Card
            sx={{
              flex: 1,
              marginLeft: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" component="div" gutterBottom>
                IPD Card
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Admitted on: January 1, 2023
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Room: 101, Building A
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Primary Doctor: Dr. John Doe
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1.5 }}
              >
                Diagnosis Summary: Patient diagnosed with acute bronchitis.
              </Typography>
            </CardContent>
            <Box sx={{ mt: "auto" }}>
              <CardActions>
                <Button size="small">Room</Button>
                <Button size="small">Add Service</Button>
                <Button size="small">Discharge</Button>
              </CardActions>
            </Box>
          </Card>
        </Box>
        <Box>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Transaction History (Last 1 Year)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSizeOptions={[5, 10, 25]}
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: 10 },
                    },
                  }}
                  pagination
                />
              </div>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Grid>
      <Grid item xs={12} md={4}>
        <Box
          display="flex"
          flexDirection="column"
          height="100%"
          justifyContent="flex-start"
          sx={{ backgroundColor: "#D3D3A2", padding: 2 }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#808000",
              "&:hover": {
                backgroundColor: "#556B2F", // Darker shade of Khaki
              },
            }}
            startIcon={<AddIcon />}
          >
            Create a new case
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: "#808000",
              "&:hover": {
                backgroundColor: "#556B2F", // Darker shade of Khaki
              },
              marginY: 2,
            }}
            startIcon={<LocalHospitalIcon />}
          >
            Admit to IPD
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: "#808000",
              "&:hover": {
                backgroundColor: "#556B2F", // Darker shade of Khaki
              },
            }}
            startIcon={<ReceiptIcon />}
            component={Link}
            to="/services/billing"
          >
            Generate Bill
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ServicesHome;

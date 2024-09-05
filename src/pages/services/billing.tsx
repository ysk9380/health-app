import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Grid,
} from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";

const services = [
  {
    id: 1,
    type: "Consultation",
    department: "Gynecology",
    name: "Prenatal Checkup",
    unitPrice: 150,
  },
  {
    id: 2,
    type: "Consultation",
    department: "Pediatrics",
    name: "Well-Baby Checkup",
    unitPrice: 100,
  },
  {
    id: 3,
    type: "Procedure",
    department: "Gynecology",
    name: "Pap Smear",
    unitPrice: 50,
  },
  {
    id: 4,
    type: "Procedure",
    department: "Pediatrics",
    name: "Vaccination",
    unitPrice: 75,
  },
  {
    id: 5,
    type: "Surgery",
    department: "Gynecology",
    name: "Cesarean Section",
    unitPrice: 3000,
  },
  {
    id: 6,
    type: "Surgery",
    department: "Pediatrics",
    name: "Tonsillectomy",
    unitPrice: 2000,
  },
  {
    id: 7,
    type: "Consultation",
    department: "Gynecology",
    name: "Postnatal Checkup",
    unitPrice: 150,
  },
  {
    id: 8,
    type: "Consultation",
    department: "Pediatrics",
    name: "Sick Visit",
    unitPrice: 120,
  },
  {
    id: 9,
    type: "Procedure",
    department: "Gynecology",
    name: "Ultrasound",
    unitPrice: 200,
  },
  {
    id: 10,
    type: "Procedure",
    department: "Pediatrics",
    name: "Newborn Screening",
    unitPrice: 100,
  },
];

const columns: GridColDef[] = [
  { field: "type", headerName: "Type Of Service", width: 150 },
  { field: "department", headerName: "Department", width: 150 },
  { field: "name", headerName: "Service Name", width: 200 },
];

const Billing: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [filteredServices, setFilteredServices] = useState(services);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [discount, setDiscount] = useState<number>(0);
  const [billingItems, setBillingItems] = useState<any[]>([]);
  const [note, setNote] = useState("");

  const handleRowSelection = (selection: GridRowSelectionModel) => {
    const selectedId = selection[0];
    const service = services.find((s) => s.id === selectedId);
    setSelectedService(service || null);
  };

  const handleAddBillingItem = () => {
    if (selectedService) {
      const newItem = {
        id: Date.now(),
        name: selectedService.name,
        unitPrice: selectedService.unitPrice,
        quantity,
        discount,
        note: note,
        totalAmount: selectedService.unitPrice * quantity - discount,
      };
      setBillingItems((prev) => [...prev, newItem]);
      setSelectedService(null);
      setQuantity(1);
      setDiscount(0);
      setNote("");
    }
  };

  const handleCancel = () => {
    setSelectedService(null);
    setQuantity(1);
    setDiscount(0);
  };

  const handleDeleteBillingItem = (id: number) => {
    setBillingItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchText(value);

    const searchWords = value.split(" ").filter((word) => word);

    setFilteredServices(
      services.filter((service) =>
        searchWords.every(
          (word) =>
            service.name.toLowerCase().includes(word) ||
            service.type.toLowerCase().includes(word) ||
            service.department.toLowerCase().includes(word)
        )
      )
    );
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        {!selectedService ? (
          <>
            <TextField
              label="Search a service"
              value={searchText}
              onChange={handleSearchChange}
              fullWidth
              margin="normal"
              size="small"
            />
            <Box style={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={filteredServices}
                columns={columns}
                pageSizeOptions={[5, 100]}
                onRowSelectionModelChange={handleRowSelection}
              />
            </Box>
          </>
        ) : (
          <Box mt={2}>
            <Typography variant="h6">Service Details</Typography>
            <TextField
              label="Service Name"
              value={selectedService.name}
              InputProps={{ readOnly: true }}
              fullWidth
              margin="normal"
              size="small"
            />
            <TextField
              label="Type of Service"
              value={selectedService.type}
              InputProps={{ readOnly: true }}
              fullWidth
              margin="normal"
              size="small"
            />
            <TextField
              label="Department"
              value={selectedService.department}
              InputProps={{ readOnly: true }}
              fullWidth
              margin="normal"
              size="small"
            />
            <TextField
              label="Unit Price"
              value={selectedService.unitPrice}
              InputProps={{
                readOnly: true,
                inputProps: { style: { textAlign: "right" } },
              }}
              fullWidth
              margin="normal"
              size="small"
            />
            <TextField
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              InputProps={{ inputProps: { style: { textAlign: "right" } } }}
              fullWidth
              margin="normal"
              size="small"
            />
            <TextField
              label="Total Amount"
              value={selectedService.unitPrice * quantity - discount}
              InputProps={{
                readOnly: true,
                inputProps: { style: { textAlign: "right" } },
              }}
              fullWidth
              margin="normal"
              size="small"
            />
            <TextField
              label="Discount"
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              InputProps={{ inputProps: { style: { textAlign: "right" } } }}
              fullWidth
              margin="normal"
              size="small"
            />
            <TextField
              label="Note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              fullWidth
              margin="normal"
              size="small"
            />
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleCancel}
                startIcon={<CancelIcon />}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddBillingItem}
                startIcon={<AddIcon />}
              >
                Add
              </Button>
            </Box>
          </Box>
        )}
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="h6">Billing Items</Typography>
        <List>
          {billingItems.map((item) => (
            <Box borderBottom={1} borderColor="grey.300" pb={1} mb={1}>
              <ListItem
                key={item.id}
                secondaryAction={
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    alignItems="flex-end"
                    height="100%"
                  >
                    <Typography variant="body2">
                      Total: ₹{item.totalAmount.toFixed(2)}
                    </Typography>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteBillingItem(item.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  primary={`${item.name}`}
                  secondary={
                    <>
                      <Typography variant="body2">
                        ₹{item.unitPrice.toFixed(2)} x {item.quantity}
                      </Typography>
                      {item.discount > 0 && (
                        <Typography variant="body2">
                          Discount: ₹{item.discount.toFixed(2)}
                        </Typography>
                      )}
                      <Typography variant="body2">
                        Note: This is a sample note.
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            </Box>
          ))}
        </List>
      </Grid>
    </Grid>
  );
};

export default Billing;

import React, { useState } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import {
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  Pagination,
  useMediaQuery,
} from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import InfoIcon from "@mui/icons-material/Info";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";

const doctorsData = [
  {
    id: 1,
    name: "Dr. Smith",
    specialization: "Cardiology",
    status: "In",
    queue: 15,
    completed: 10,
  },
  {
    id: 2,
    name: "Dr. Johnson",
    specialization: "Neurology",
    status: "Out",
    queue: 0,
    completed: 0,
  },
  {
    id: 3,
    name: "Dr. Williams",
    specialization: "Dermatology",
    status: "In",
    queue: 30,
    completed: 15,
  },
];

const Doctors: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const currentPatientProfile = useSelector(
    (state: RootState) => state.currentPatient.profile
  );
  const isMediumScree = useMediaQuery(theme.breakpoints.down("md"));
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: t("doctor.doctorName"), width: 300 },
    {
      field: "specialization",
      headerName: t("doctor.specialization"),
      width: 200,
    },
    {
      field: "status",
      headerName: t("doctor.status"),
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          color={params.value === "In" ? "success" : "default"}
          variant="filled"
        />
      ),
    },
    {
      field: "queue",
      headerName: t("doctor.todaysQueue"),
      width: 150,
      type: "number",
    },
    {
      field: "completed",
      headerName: t("doctor.consultationsCompleted"),
      width: 200,
      type: "number",
    },
    {
      field: "action",
      headerName: t("doctor.action"),
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <>
          <Tooltip title={t("doctor.viewDetails")}>
            <IconButton>
              <InfoIcon />
            </IconButton>
          </Tooltip>
          {params.row.status === "In" && currentPatientProfile && (
            <Tooltip title={t("doctor.bookAppointment")}>
              <IconButton color="primary">
                <EventAvailableIcon />
              </IconButton>
            </Tooltip>
          )}
        </>
      ),
    },
  ];

  const paginatedDoctors = doctorsData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div style={{ width: "100%" }}>
      <h1>{t("doctor.title")}</h1>
      {isMediumScree ? (
        <>
          {paginatedDoctors.map((doctor) => (
            <Card key={doctor.id} style={{ marginBottom: "16px" }}>
              <CardContent>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h5" component="div">
                    {doctor.name}
                  </Typography>
                  <Chip
                    label={doctor.status}
                    color={doctor.status === "In" ? "success" : "default"}
                    variant="filled"
                  />
                </div>
                <Typography color="textSecondary">
                  {doctor.specialization}
                </Typography>
                <Typography variant="body2" style={{ marginTop: "8px" }}>
                  {t("doctor.completedConsultationsMessage", {
                    completed: doctor.completed,
                    total: doctor.queue,
                  })}
                </Typography>
              </CardContent>
              <CardActions
                sx={{
                  justifyContent: "flex-end",
                  backgroundColor: "#f5f5f5",
                }}
              >
                {doctor.status === "In" && currentPatientProfile && (
                  <Tooltip title={t("doctor.bookAppointment")}>
                    <IconButton color="primary">
                      <EventAvailableIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title={t("doctor.viewDetails")}>
                  <IconButton>
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          ))}
          <Pagination
            count={Math.ceil(doctorsData.length / pageSize)}
            page={page}
            onChange={handlePageChange}
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "16px",
            }}
          />
        </>
      ) : (
        <div style={{ height: 400 }}>
          <DataGrid
            rows={doctorsData}
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
      )}
    </div>
  );
};

export default Doctors;

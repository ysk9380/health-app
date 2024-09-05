import CssBaseline from "@mui/material/CssBaseline";
import RoutesComponent from "./routes-component";
import NavBar from "./components/nav-bar"; // Import the NavBar component
import { Container } from "@mui/material";
import { useSelector } from "react-redux";
import Loader from "./components/loader";
import { BrowserRouter as Router } from "react-router-dom";
import { RootState } from "./store/store";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { SnackbarProvider } from "./components/Snackbar";

export const App: React.FC = () => {
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {isLoading && <Loader />}
      <CssBaseline />
      <Router>
        <SnackbarProvider>
          <NavBar />
          <Container>
            <RoutesComponent />
          </Container>
        </SnackbarProvider>
      </Router>
    </LocalizationProvider>
  );
};

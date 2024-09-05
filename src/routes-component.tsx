import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./home";
import Services from "./pages/services/services";
import Doctors from "./pages/doctors";
import Appointments from "./pages/appointments";
import Pharmacy from "./pages/pharmacy";
import PatientPortal from "./pages/patients/patient-portal";
import ContactUs from "./pages/contact-us";
import Login from "./login";
import ProtectedRoute from "./protected-route";
import PatientInformation from "./pages/patients/patient-information";
import Patients from "./pages/patients/patients";
import PatientAdd from "./pages/patients/patient-add";
import Billing from "./pages/services/billing";
import ServicesHome from "./pages/services/services-home";

const RoutesComponent: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/services"
        element={<ProtectedRoute element={<Services />} />}
      >
        <Route index element={<ServicesHome />} /> {/* Default route */}
        <Route path="billing" element={<Billing />} />
      </Route>
      <Route
        path="/doctors"
        element={<ProtectedRoute element={<Doctors />} />}
      />
      <Route
        path="/appointments"
        element={<ProtectedRoute element={<Appointments />} />}
      />
      <Route
        path="/pharmacy"
        element={<ProtectedRoute element={<Pharmacy />} />}
      />
      <Route
        path="/patients"
        element={<ProtectedRoute element={<Patients />} />}
      >
        <Route index element={<PatientPortal />} /> {/* Default route */}
        <Route path="portal" element={<PatientPortal />} />
        <Route path="information" element={<PatientInformation />} />
        <Route path="add" element={<PatientAdd />} />
      </Route>
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default RoutesComponent;

import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

// Home
import Home from '../pages/Home';

// Hospital pages
import HospitalLogin from '../pages/hospital/HospitalLogin';
import HospitalRegister from '../pages/hospital/HospitalRegister';
import HospiGoDashboard from '../pages/hospital/HospitalDashboard';

// User pages
import UserLogin from '../pages/user/UserLogin';
import UserRegister from '../pages/user/UserRegister';
import UserDashboard from '../pages/user/UserDashboard';
import Appointments from '../pages/user/Appointments';
import ServicesDashboard from '../pages/user/ServicesDashboard';
import LabAppointments from '../pages/user/LabAppointments';
import AppointmentConfirmation from '../pages/user/Confirmation';
import Profile from '../pages/user/Profile';


import LabCalendar from '../components/LabCalendar';
import Calendar from '../components/Calendar';


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Hospital */}
        <Route path="/hospital/login" element={<HospitalLogin />} />
        <Route path="/hospital/register" element={<HospitalRegister />} />
        <Route path="/hospital/dashboard" element={<HospiGoDashboard />} />

        {/* User */}
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/services" element={<ServicesDashboard />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/appointments" element={<Appointments />} />
        <Route path="/user/labs" element={<LabAppointments />} />
        <Route path="/user/profile" element={<Profile />} />

        {/* Components */}
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/lab-calendar" element={<LabCalendar />} />
        <Route path="/user/appointments/confirmation" element={<AppointmentConfirmation />} />
        <Route path="/user/labs/confirmation" element={<AppointmentConfirmation />} />

      </Routes>
    </BrowserRouter>
  );
}

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/layout/AppLayout";
import AirlinesPage from "./pages/Airlines";
import AircraftsPage from "./pages/Aircrafts";
import FlightSchedulePage from "./pages/FlightSchedule";
import ServicesPage from "./pages/Services";
import AirportChargesPage from "./pages/AirportCharges";
import DashboardPage from "./pages/Dashboard";
import ServiceReportPage from "./pages/ServiceReport";
import InvoicesPage from "./pages/Invoices";
import OverflySchedulePage from "./pages/OverflySchedule";
import DelayCodesPage from "./pages/DelayCodes";
import LostFoundPage from "./pages/LostFound";
import StaffRosterPage from "./pages/StaffRoster";
import ContractsPage from "./pages/Contracts";
import TubePage from "./pages/Tube";
import AirportTaxPage from "./pages/AirportTax";
import BasicRampPage from "./pages/BasicRamp";
import VendorEquipmentPage from "./pages/VendorEquipment";
import HallVVIPPage from "./pages/HallVVIP";
import CateringPage from "./pages/Catering";
import TrafficRightsPage from "./pages/TrafficRights";
import BulletinsPage from "./pages/Bulletins";
import ManualsAndFormsPage from "./pages/ManualsAndForms";
import AbbreviationsPage from "./pages/Abbreviations";
import AircraftTypesPage from "./pages/AircraftTypes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout><DashboardPage /></AppLayout>} />
          <Route path="/airport-charges" element={<AppLayout><AirportChargesPage /></AppLayout>} />
          <Route path="/airlines" element={<AppLayout><AirlinesPage /></AppLayout>} />
          <Route path="/aircrafts" element={<AppLayout><AircraftsPage /></AppLayout>} />
          <Route path="/flight-schedule" element={<AppLayout><FlightSchedulePage /></AppLayout>} />
          <Route path="/services" element={<AppLayout><ServicesPage /></AppLayout>} />
          <Route path="/service-report" element={<AppLayout><ServiceReportPage /></AppLayout>} />
          <Route path="/invoices" element={<AppLayout><InvoicesPage /></AppLayout>} />
          <Route path="/overfly-schedule" element={<AppLayout><OverflySchedulePage /></AppLayout>} />
          <Route path="/delay-codes" element={<AppLayout><DelayCodesPage /></AppLayout>} />
          <Route path="/lost-found" element={<AppLayout><LostFoundPage /></AppLayout>} />
          <Route path="/staff-roster" element={<AppLayout><StaffRosterPage /></AppLayout>} />
          <Route path="/contracts" element={<AppLayout><ContractsPage /></AppLayout>} />
          <Route path="/tube" element={<AppLayout><TubePage /></AppLayout>} />
          <Route path="/airport-tax" element={<AppLayout><AirportTaxPage /></AppLayout>} />
          <Route path="/basic-ramp" element={<AppLayout><BasicRampPage /></AppLayout>} />
          <Route path="/vendor-equipment" element={<AppLayout><VendorEquipmentPage /></AppLayout>} />
          <Route path="/hall-vvip" element={<AppLayout><HallVVIPPage /></AppLayout>} />
          <Route path="/catering" element={<AppLayout><CateringPage /></AppLayout>} />
          <Route path="/traffic-rights" element={<AppLayout><TrafficRightsPage /></AppLayout>} />
          <Route path="/bulletins" element={<AppLayout><BulletinsPage /></AppLayout>} />
          <Route path="/manuals-forms" element={<AppLayout><ManualsAndFormsPage /></AppLayout>} />
          <Route path="/abbreviations" element={<AppLayout><AbbreviationsPage /></AppLayout>} />
          <Route path="/aircraft-types" element={<AppLayout><AircraftTypesPage /></AppLayout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

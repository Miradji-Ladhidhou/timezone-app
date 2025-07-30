import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard';
import Pointages from './pages/Pointages';
import CongeEmploye from './components/conges/CongeEmploye';
import CongeGestion from './components/conges/CongeGestion';
import HomePage from './pages/HomePage.jsx';
import UsersAdmin from './pages/UsersAdmin';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CguPage from './pages/CguPage';
import ConfidentialitePage from './pages/ConfidentialitePage';
import MentionsLegalesPage from './pages/MentionsLegalesPage';
import HeuresEmploye from './pages/HeuresEmploye';
import HeuresAdmin from './pages/HeuresAdmin';
import GestionPointage from './pages/GestionPointage';
import PrivateRoute from './components/PrivateRoute';
import Unauthorized from './pages/unauthorized';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Auth publiques */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Layout général */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cgu" element={<CguPage />} />
          <Route path="/confidentialite" element={<ConfidentialitePage />} />
          <Route path="/mentions-legales" element={<MentionsLegalesPage />} />

          {/* Routes protégées */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute allowedRoles={['admin', 'secretaire', 'employe']}>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/pointages"
            element={
              <PrivateRoute allowedRoles={['employe']}>
                <Pointages />
              </PrivateRoute>
            }
          />

          <Route
            path="/gestion-pointages"
            element={
              <PrivateRoute allowedRoles={['admin', 'secretaire']}>
                <GestionPointage />
              </PrivateRoute>
            }
          />

          <Route
            path="/conges"
            element={
              <PrivateRoute allowedRoles={['employe']}>
                <CongeEmploye />
              </PrivateRoute>
            }
          />

          <Route
            path="/conges-gestion"
            element={
              <PrivateRoute allowedRoles={['admin', 'secretaire']}>
                <CongeGestion />
              </PrivateRoute>
            }
          />

          <Route
            path="/users"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <UsersAdmin />
              </PrivateRoute>
            }
          />

          <Route
            path="/heures-supp"
            element={
              <PrivateRoute allowedRoles={['employe']}>
                <HeuresEmploye />
              </PrivateRoute>
            }
          />

          <Route
            path="/heures-suppGestion"
            element={
              <PrivateRoute allowedRoles={['admin', 'secretaire']}>
                <HeuresAdmin />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;


import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register'
import Dashboard from './pages/Dashboard';
import Pointages from './pages/Pointages';
import CongesRouter from './components/conges/CongesRouter';
import HomePage from './pages/HomePage.jsx';
import Users from './pages/Users';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CguPage from './pages/CguPage';
import ConfidentialitePage from './pages/ConfidentialitePage';
import MentionsLegalesPage from './pages/MentionsLegalesPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pointages" element={<Pointages />} />
          <Route path="/conges" element={<CongesRouter />} />
          <Route path="/users" element={<Users />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cgu" element={<CguPage />} />
          <Route path="/confidentialite" element={<ConfidentialitePage />} />
          <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;


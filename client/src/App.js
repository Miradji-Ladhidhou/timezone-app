
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register'
import Dashboard from './pages/Dashboard';
import Pointages from './pages/Pointages';
import Conges from './pages/Conges';
import DatesBloquees from './pages/DatesBloquees';
import Users from './pages/Users';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pointages" element={<Pointages />} />
          <Route path="/conges" element={<Conges />} />
          <Route path="/dates-bloquees" element={<DatesBloquees />} />
          <Route path="/users" element={<Users />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;


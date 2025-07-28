import React from 'react';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBar />
      
      <Container className="flex-grow-1 mt-4">
        <Outlet />
      </Container>

      <Footer />
    </div>
  );
};

export default Layout;

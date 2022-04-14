import React, { useState } from 'react';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';

//        <NavDropdown.Item eventKey="2.2" href="./Hamiltonian_Monte_Carlo">Hamiltonian Monte Carlo</NavDropdown.Item>

const Navigation = () => (
<>
  <Navbar bg="dark" variant="dark">
    <Container>
    <Navbar.Brand href="./">COMPSCI 688</Navbar.Brand>
    <Nav className="me-auto">
      <Nav.Link href="./">Home</Nav.Link>
      <NavDropdown title="Demonstrations" id="nav-dropdown">
        <NavDropdown.Item eventKey="2.1" href="./D_Separation">D-Separation</NavDropdown.Item>
      </NavDropdown>
      <Nav.Link href="./more">More</Nav.Link>
    </Nav>
    </Container>
  </Navbar>
</>
);

export default Navigation;
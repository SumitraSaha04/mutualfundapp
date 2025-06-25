import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';


function AppNavbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  let username = '';

  if (token) {
    try {
      const decoded = jwtDecode(token);
      username = decoded.username || '';
    } catch (err) {
      console.error("Invalid token");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Navbar expand="lg" style={{ backgroundColor: '#002244' }} variant="dark">
      <Container>
        <Navbar.Brand style={{ fontWeight: 'bold' }}>MutualFundApp</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {token ? (
              <>
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link as={Link} to="/saved-funds">Saved Funds</Nav.Link>
                <Dropdown align="end">
                  <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                    <FaUserCircle style={{ marginRight: '5px' }} />
                    {username}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;

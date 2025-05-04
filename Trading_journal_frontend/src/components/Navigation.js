import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import TradeService from '../services/api';

const Navigation = () => {
  const navigate = useNavigate();
  
  const handleExport = async () => {
    try {
      await TradeService.downloadExcel();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
          Trading Journal
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar" />
        <Navbar.Collapse id="navbar">
          <Nav className="me-auto">
            <Nav.Link onClick={() => navigate('/')}>Dashboard</Nav.Link>
            <Nav.Link onClick={() => navigate('/trades/add')}>Add Trade</Nav.Link>
            <Nav.Link onClick={() => navigate('/trades')}>All Trades</Nav.Link>
            <Nav.Link onClick={() => navigate('/analytics')}>Analytics</Nav.Link>
          </Nav>
          <Button 
            variant="outline-light" 
            onClick={handleExport}
            className="ms-2"
          >
            Export to Excel
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
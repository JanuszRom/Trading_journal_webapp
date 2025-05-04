import React, { useState } from 'react';
import { Table, Button, Badge, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const TradeList = ({ trades = [], onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');

  // Filter trades based on search term
  const filteredTrades = (trades || []).filter(trade => 
    trade.instrument.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trade.direction.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort trades
  const sortedTrades = [...filteredTrades].sort((a, b) => {
    let fieldA = a[sortField];
    let fieldB = b[sortField];
    
    // Handle dates
    if (sortField === 'timestamp') {
      fieldA = new Date(fieldA);
      fieldB = new Date(fieldB);
    }
    
    if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? '▲' : '▼';
  };

  return (
    <>
      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>Search</InputGroup.Text>
            <Form.Control
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by instrument or direction..."
            />
          </InputGroup>
        </Col>
        <Col md={6} className="text-end">
          <strong>Total Trades:</strong> {trades.length}
        </Col>
      </Row>
      
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th onClick={() => handleSort('timestamp')}>
              Date {getSortIcon('timestamp')}
            </th>
            <th onClick={() => handleSort('instrument')}>
              Instrument {getSortIcon('instrument')}
            </th>
            <th onClick={() => handleSort('direction')}>
              Direction {getSortIcon('direction')}
            </th>
            <th onClick={() => handleSort('profit_loss')}>
              P/L {getSortIcon('profit_loss')}
            </th>
            <th onClick={() => handleSort('risk')}>
              Risk {getSortIcon('risk')}
            </th> 
            <th onClick={() => handleSort('reward')}>
              Reward {getSortIcon('reward')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedTrades.map((trade) => (
            <tr key={trade.id}>
              <td>{new Date(trade.timestamp).toLocaleDateString()}</td>
              <td>{trade.instrument}</td>
              <td>
                <Badge bg={trade.direction === 'Long' ? 'success' : 'danger'}>
                  {trade.direction}
                </Badge>
              </td>
              <td>
                <Badge bg={trade.profit_loss >= 0 ? 'success' : 'danger'}>
                  {trade.profit_loss}
                </Badge>
              </td>
              <td>{trade.risk}</td>
              <td>{trade.reward}</td>
              <td>
                <Link to={`/trade/${trade.id}`} className="btn btn-sm btn-info me-2">
                  View
                </Link>
                <Link to={`trades/edit/${trade.id}`} className="btn btn-sm btn-warning me-2">
                  Edit
                </Link>
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={() => onDelete(trade.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      {sortedTrades.length === 0 && (
        <div className="text-center p-4">
          <p className="text-muted">No trades found. Add a new trade to get started.</p>
        </div>
      )}
    </>
  );
};

export default TradeList;
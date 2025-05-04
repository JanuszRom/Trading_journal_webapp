import React, { useState, useEffect } from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import TradeList from '../components/TradeList';
import TradeService from '../services/api';

const TradeListPage = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrades = async () => {
    try {
      const data = await TradeService.getAllTrades();
      setTrades(data);
    } catch (err) {
      setError(err.message || 'Failed to load trades.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this trade?')) {
      try {
        await TradeService.deleteTrade(id);
        setTrades((prev) => prev.filter((t) => t.id !== id));
      } catch (err) {
        setError(err.message || 'Failed to delete trade.');
      }
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">All Trades</h2>
      <TradeList trades={trades} onDelete={handleDelete} />
    </Container>
  );
};

export default TradeListPage;
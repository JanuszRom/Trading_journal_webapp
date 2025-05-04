import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Spinner, Alert, Badge, Button } from 'react-bootstrap';
import TradeService from '../services/api';
import Screenshot from '../components/Screenshot';

const TradeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trade, setTrade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrade = async () => {
      try {
        setLoading(true);
        const data = await TradeService.getTrade(id);
        setTrade(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load trade.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrade();
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error || !trade) {
    return (
      <Container className="my-4">
        <Alert variant="danger">{error || 'Trade not found'}</Alert>
        <Button variant="secondary" onClick={() => navigate(-1)}>Go Back</Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-3">
        <Col><h2>Trade Details</h2></Col>
      </Row>
      <Row>
        <Col md={8}>
          <ul className="list-group">
            <li className="list-group-item"><strong>Date:</strong> {new Date(trade.timestamp).toLocaleString()}</li>
            <li className="list-group-item"><strong>Instrument:</strong> {trade.instrument}</li>
            <li className="list-group-item">
              <strong>Direction:</strong>{' '}
              <Badge bg={trade.direction === 'Long' ? 'success' : 'danger'}>
                {trade.direction}
              </Badge>
            </li>
            <li className="list-group-item"><strong>Entry Price:</strong> {trade.entry}</li>
            <li className="list-group-item"><strong>Exit Price:</strong> {trade.exit}</li>
            <li className="list-group-item"><strong>Stop Loss:</strong> {trade.stop_loss}</li>
            <li className="list-group-item"><strong>Take Profit:</strong> {trade.take_profit}</li>
            <li className="list-group-item"><strong>Profit/Loss:</strong> {trade.profit_loss}</li>
            <li className="list-group-item"><strong>Risk:</strong> {trade.risk}</li>
            <li className="list-group-item"><strong>Reward:</strong> {trade.reward}</li>
            <li className="list-group-item"><strong>Duration:</strong> {trade.duration}</li>
            <li className="list-group-item"><strong>Comments:</strong> {trade.comments}</li>
          </ul>
        </Col>

        <Col md={4}>
          <h5>Screenshots</h5>
          <div className="d-flex flex-column gap-3">
            {trade.screenshots?.length > 0 ? (
              trade.screenshots.map(screenshot => (
                <Screenshot key={screenshot.id} screenshot={screenshot} />
              ))
            ) : (
              <Alert variant="info">No screenshots available</Alert>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default TradeDetails;
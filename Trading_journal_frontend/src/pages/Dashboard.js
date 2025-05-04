import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import TradeList from '../components/TradeList';
import TradeService from '../services/api';

const Dashboard = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalTrades: 0,
    winningTrades: 0,
    losingTrades: 0,
    winRate: 0,
    averageProfit: 0,
    averageLoss: 0,
    biggestWin: 0,
    biggestLoss: 0,
    totalProfit: 0
  });

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    try {
      setLoading(true);
      const data = await TradeService.getAllTrades();
      setTrades(data);
      calculateStats(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch trades. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (tradeData) => {
    if (!tradeData.length) return;

    const winningTrades = tradeData.filter(t => t.profit_loss > 0);
    const losingTrades = tradeData.filter(t => t.profit_loss < 0);
    const totalProfit = tradeData.reduce((sum, t) => sum + t.profit_loss, 0);
    
    const avgProfit = winningTrades.length 
      ? winningTrades.reduce((sum, t) => sum + t.profit_loss, 0) / winningTrades.length 
      : 0;
      
    const avgLoss = losingTrades.length 
      ? losingTrades.reduce((sum, t) => sum + t.profit_loss, 0) / losingTrades.length 
      : 0;

    setStats({
      totalTrades: tradeData.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate: tradeData.length ? (winningTrades.length / tradeData.length) * 100 : 0,
      averageProfit: avgProfit,
      averageLoss: avgLoss,
      biggestWin: Math.max(...tradeData.map(t => t.profit_loss), 0),
      biggestLoss: Math.min(...tradeData.map(t => t.profit_loss), 0),
      totalProfit
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this trade?')) {
      try {
        await TradeService.deleteTrade(id);
        setTrades(trades.filter(trade => trade.id !== id));
        calculateStats(trades.filter(trade => trade.id !== id));
      } catch (err) {
        setError('Failed to delete trade.');
      }
    }
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">Trading Journal Dashboard</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {loading ? (
        <p>Loading trades...</p>
      ) : (
        <>
          <Row className="mb-4">
            <Col md={3}>
              <Card className="text-center h-100">
                <Card.Body>
                  <Card.Title>Total Trades</Card.Title>
                  <h2>{stats.totalTrades}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center h-100" bg={stats.totalProfit >= 0 ? "success" : "danger"} text="white">
                <Card.Body>
                  <Card.Title>Total P/L</Card.Title>
                  <h2>{stats.totalProfit.toFixed(2)}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center h-100">
                <Card.Body>
                  <Card.Title>Win Rate</Card.Title>
                  <h2>{stats.winRate.toFixed(2)}%</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center h-100">
                <Card.Body>
                  <Card.Title>Avg Profit/Loss</Card.Title>
                  <h2>{stats.averageProfit.toFixed(2)} / {stats.averageLoss.toFixed(2)}</h2>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <TradeList trades={trades} onDelete={handleDelete} />
        </>
      )}
    </Container>
  );
};

export default Dashboard;
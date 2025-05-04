import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Spinner, Alert } from 'react-bootstrap';
import TradeService from '../services/api';
import { Chart as ChartJS, registerables } from 'chart.js';
import EquityCurve from '../components/charts/EquityCurve';
import ProfitByInstrument from '../components/charts/ProfitByInstrument';
import WinLossDistribution from '../components/charts/WinLossDistribution';
import DurationVsProfit from '../components/charts/DurationVsProfit';
import RiskRewardRatios from '../components/charts/RiskRewardRatios';
import TradesOverTime from '../components/charts/TradesOverTime';
import DirectionBias from '../components/charts/DirectionBias';
ChartJS.register(...registerables);


const AnalyticsPage = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChart, setSelectedChart] = useState('equityCurve');
  
  // Optional filters
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null
  });
  const [selectedInstrument, setSelectedInstrument] = useState('all');
  
  // List of unique instruments (will be populated from trades)
  const [instruments, setInstruments] = useState([]);

  useEffect(() => {
    fetchTradeData();
  }, []);
  
  const fetchTradeData = async () => {
    try {
      setLoading(true);
      const data = await TradeService.getAllTrades();
      setTrades(data);
      
      // Extract unique instruments for the filter dropdown
      const uniqueInstruments = [...new Set(data.map(trade => trade.instrument))];
      setInstruments(uniqueInstruments);
      
      setLoading(false);
      setError(null);
    } catch (err) {
      setError('Failed to load trade data. Please try again later.');
      setLoading(false);
      console.error('Error fetching trade data:', err);
    }
  };
  // Function to filter trades based on selected filters
  const getFilteredTrades = () => {
    return trades.filter(trade => {
      // Filter by instrument if one is selected
      if (selectedInstrument !== 'all' && trade.instrument !== selectedInstrument) {
        return false;
      }
      
      // Filter by date range if dates are selected
      if (dateRange.startDate && new Date(trade.entry_date) < new Date(dateRange.startDate)) {
        return false;
      }
      
      if (dateRange.endDate && new Date(trade.entry_date) > new Date(dateRange.endDate)) {
        return false;
      }
      
      return true;
    });
  };

  // Function to render the selected chart (placeholder for now)
  const renderChart = () => {
    const filteredTrades = getFilteredTrades();
    
    if (filteredTrades.length === 0) {
      return <Alert variant="info">No trade data available for the selected filters.</Alert>;
    }
    
    switch(selectedChart) {
      case 'equityCurve':
        return <EquityCurve trades={filteredTrades} />;
      case 'profitByInstrument':
        return <ProfitByInstrument trades={filteredTrades} />;
      case 'winLossDistribution':
        return <WinLossDistribution trades={filteredTrades} />;
      case 'durationVsProfit':
        return <DurationVsProfit trades={filteredTrades} />;
      case 'riskRewardRatios':
        return <RiskRewardRatios trades={filteredTrades} />;
      case 'tradesOverTime':
        return <TradesOverTime trades={filteredTrades} />;
      case 'directionBias':
        return <DirectionBias trades={filteredTrades} />;
      default:
        return (
          <Card className="p-3">
            <Card.Body>
              <Card.Title>{getChartTitle(selectedChart)}</Card.Title>
              <div className="text-center p-5">Chart not available</div>
            </Card.Body>
          </Card>
        );
    }
  };

  // Helper function to get chart title
  const getChartTitle = (chartType) => {
    const titles = {
      equityCurve: 'Equity Curve',
      profitByInstrument: 'Profit/Loss by Instrument',
      winLossDistribution: 'Win vs Loss Distribution',
      durationVsProfit: 'Trade Duration vs P/L',
      riskRewardRatios: 'Risk/Reward Ratios',
      tradesOverTime: 'Trades Over Time',
      directionBias: 'Direction Bias (Long vs Short)'
    };
    return titles[chartType] || 'Analytics';
  };
  
  // Calculate summary statistics
  const calculateStats = () => {
    const filteredTrades = getFilteredTrades();
    
    if (filteredTrades.length === 0) {
      return { totalTrades: 0, winRate: 0, avgProfit: 0, totalProfit: 0 };
    }
    
    const winningTrades = filteredTrades.filter(trade => parseFloat(trade.profit_loss) > 0);
    const totalProfit = filteredTrades.reduce((sum, trade) => sum + parseFloat(trade.profit_loss), 0);
    
    return {
      totalTrades: filteredTrades.length,
      winRate: (winningTrades.length / filteredTrades.length * 100).toFixed(2),
      avgProfit: (totalProfit / filteredTrades.length).toFixed(2),
      totalProfit: totalProfit.toFixed(2)
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>Trade Analytics</h2>
      
      {/* Summary Statistics */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center p-3">
            <h5>Total Trades</h5>
            <h3>{stats.totalTrades}</h3>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center p-3">
            <h5>Win Rate</h5>
            <h3>{stats.winRate}%</h3>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center p-3">
            <h5>Avg P/L</h5>
            <h3>{stats.avgProfit}</h3>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center p-3">
            <h5>Total P/L</h5>
            <h3>{stats.totalProfit}</h3>
          </Card>
        </Col>
      </Row>
      
      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Chart Type</Form.Label>
                <Form.Select 
                  value={selectedChart}
                  onChange={(e) => setSelectedChart(e.target.value)}
                >
                  <option value="equityCurve">Equity Curve</option>
                  <option value="profitByInstrument">P/L by Instrument</option>
                  <option value="winLossDistribution">Win/Loss Distribution</option>
                  <option value="durationVsProfit">Duration vs P/L</option>
                  <option value="riskRewardRatios">Risk/Reward Ratios</option>
                  <option value="tradesOverTime">Trades Over Time</option>
                  <option value="directionBias">Direction Bias</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={4}>
              <Form.Group>
                <Form.Label>Instrument</Form.Label>
                <Form.Select 
                  value={selectedInstrument}
                  onChange={(e) => setSelectedInstrument(e.target.value)}
                >
                  <option value="all">All Instruments</option>
                  {instruments.map((instrument, idx) => (
                    <option key={idx} value={instrument}>{instrument}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={4}>
              <Form.Group>
                <Form.Label>Date Range</Form.Label>
                <div className="d-flex">
                  <Form.Control 
                    type="date" 
                    placeholder="Start Date"
                    value={dateRange.startDate || ''}
                    onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                    className="me-2"
                  />
                  <Form.Control 
                    type="date" 
                    placeholder="End Date"
                    value={dateRange.endDate || ''}
                    onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {/* Chart Display */}
      <Row>
        <Col>
          {error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            renderChart()
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AnalyticsPage;
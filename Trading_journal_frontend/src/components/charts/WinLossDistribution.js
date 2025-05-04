import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Card, Row, Col } from 'react-bootstrap';

const WinLossDistribution = ({ trades }) => {
  const chartData = useMemo(() => {
    if (!trades || trades.length === 0) {
      return { labels: [], datasets: [] };
    }

    const winningTrades = trades.filter(trade => parseFloat(trade.profit_loss) > 0);
    const losingTrades = trades.filter(trade => parseFloat(trade.profit_loss) < 0);
    const breakEvenTrades = trades.filter(trade => parseFloat(trade.profit_loss) === 0);

    return {
      labels: ['Win', 'Loss', 'Break Even'],
      datasets: [
        {
          data: [winningTrades.length, losingTrades.length, breakEvenTrades.length],
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(201, 203, 207, 0.6)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(201, 203, 207, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  }, [trades]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) + '%' : '0%';
            return `${context.label}: ${value} (${percentage})`;
          }
        }
      }
    }
  };

  // Calculate win rate stats
  const stats = useMemo(() => {
    if (!trades || trades.length === 0) {
      return { winRate: 0, totalTrades: 0, wins: 0, losses: 0, breakEven: 0 };
    }

    const wins = trades.filter(trade => parseFloat(trade.profit_loss) > 0).length;
    const losses = trades.filter(trade => parseFloat(trade.profit_loss) < 0).length;
    const breakEven = trades.filter(trade => parseFloat(trade.profit_loss) === 0).length;
    const total = trades.length;
    const winRate = total > 0 ? (wins / total) * 100 : 0;

    return {
      winRate: winRate.toFixed(2),
      totalTrades: total,
      wins,
      losses,
      breakEven
    };
  }, [trades]);

  if (!trades || trades.length === 0) {
    return (
      <Card className="p-3">
        <Card.Body>
          <Card.Title>Win/Loss Distribution</Card.Title>
          <div className="text-center p-5">No trade data available</div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="p-3">
      <Card.Body>
        <Card.Title>Win/Loss Distribution</Card.Title>
        <Row>
          <Col md={5}>
            <div style={{ height: '300px' }}>
              <Doughnut data={chartData} options={chartOptions} />
            </div>
          </Col>
          <Col md={7}>
            <div className="mt-4">
              <h5>Summary</h5>
              <p>Win Rate: <strong>{stats.winRate}%</strong></p>
              <p>Total Trades: <strong>{stats.totalTrades}</strong></p>
              <ul>
                <li>Winning Trades: <strong>{stats.wins}</strong></li>
                <li>Losing Trades: <strong>{stats.losses}</strong></li>
                <li>Break Even: <strong>{stats.breakEven}</strong></li>
              </ul>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default WinLossDistribution;
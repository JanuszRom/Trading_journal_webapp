import React, { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import { Card, Row, Col, Table } from 'react-bootstrap';

const DirectionBias = ({ trades }) => {
  const chartData = useMemo(() => {
    if (!trades || trades.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Count trades by direction
    const longTrades = trades.filter(trade => 
      trade.direction?.toLowerCase() === 'long' || 
      trade.direction?.toLowerCase() === 'buy'
    );
    const shortTrades = trades.filter(trade => 
      trade.direction?.toLowerCase() === 'short' || 
      trade.direction?.toLowerCase() === 'sell'
    );
    
    // Calculate total P/L by direction
    const longProfit = longTrades.reduce((sum, trade) => sum + parseFloat(trade.profit_loss), 0);
    const shortProfit = shortTrades.reduce((sum, trade) => sum + parseFloat(trade.profit_loss), 0);
    
    // Calculate win rates
    const longWins = longTrades.filter(trade => parseFloat(trade.profit_loss) > 0).length;
    const shortWins = shortTrades.filter(trade => parseFloat(trade.profit_loss) > 0).length;
    
    const longWinRate = longTrades.length > 0 ? (longWins / longTrades.length) * 100 : 0;
    const shortWinRate = shortTrades.length > 0 ? (shortWins / shortTrades.length) * 100 : 0;

    return {
      pieData: {
        labels: ['Long', 'Short'],
        datasets: [
          {
            data: [longTrades.length, shortTrades.length],
            backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
            borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
            borderWidth: 1
          }
        ]
      },
      stats: {
        long: {
          count: longTrades.length,
          profit: longProfit,
          winRate: longWinRate,
          avgProfit: longTrades.length > 0 ? longProfit / longTrades.length : 0
        },
        short: {
          count: shortTrades.length,
          profit: shortProfit,
          winRate: shortWinRate,
          avgProfit: shortTrades.length > 0 ? shortProfit / shortTrades.length : 0
        }
      }
    };
  }, [trades]);

  const pieOptions = {
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
            return `${context.label}: ${value} trades (${percentage})`;
          }
        }
      }
    }
  };

  if (!trades || trades.length === 0) {
    return (
      <Card className="p-3">
        <Card.Body>
          <Card.Title>Direction Bias (Long vs Short)</Card.Title>
          <div className="text-center p-5">No trade data available</div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="p-3">
      <Card.Body>
        <Card.Title>Direction Bias (Long vs Short)</Card.Title>
        <Row>
          <Col md={5}>
            <div style={{ height: '300px' }}>
              <Pie data={chartData.pieData} options={pieOptions} />
            </div>
          </Col>
          <Col md={7}>
            <h5 className="mt-3">Performance Analysis</h5>
            <Table striped bordered hover size="sm" className="mt-3">
              <thead>
                <tr>
                  <th>Direction</th>
                  <th>Trades</th>
                  <th>Win Rate</th>
                  <th>Total P/L</th>
                  <th>Avg P/L</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Long</strong></td>
                  <td>{chartData.stats.long.count}</td>
                  <td>{chartData.stats.long.winRate.toFixed(2)}%</td>
                  <td className={chartData.stats.long.profit >= 0 ? 'text-success' : 'text-danger'}>
                    {chartData.stats.long.profit.toFixed(2)}
                  </td>
                  <td className={chartData.stats.long.avgProfit >= 0 ? 'text-success' : 'text-danger'}>
                    {chartData.stats.long.avgProfit.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td><strong>Short</strong></td>
                  <td>{chartData.stats.short.count}</td>
                  <td>{chartData.stats.short.winRate.toFixed(2)}%</td>
                  <td className={chartData.stats.short.profit >= 0 ? 'text-success' : 'text-danger'}>
                    {chartData.stats.short.profit.toFixed(2)}
                  </td>
                  <td className={chartData.stats.short.avgProfit >= 0 ? 'text-success' : 'text-danger'}>
                    {chartData.stats.short.avgProfit.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </Table>
            <div className="mt-3">
              <h6>Analysis</h6>
              <p className="text-muted small">
                {chartData.stats.long.count > chartData.stats.short.count 
                  ? "You tend to take more long positions than short positions. "
                  : chartData.stats.short.count > chartData.stats.long.count
                  ? "You tend to take more short positions than long positions. "
                  : "You have a balanced approach between long and short positions. "}
                
                {chartData.stats.long.winRate > chartData.stats.short.winRate 
                  ? "Your win rate is higher on long trades. "
                  : chartData.stats.short.winRate > chartData.stats.long.winRate
                  ? "Your win rate is higher on short trades. "
                  : "Your win rate is similar for both directions. "}
                
                {chartData.stats.long.avgProfit > chartData.stats.short.avgProfit 
                  ? "Your average profit is higher on long trades."
                  : chartData.stats.short.avgProfit > chartData.stats.long.avgProfit
                  ? "Your average profit is higher on short trades."
                  : "Your average profit is similar for both directions."}
              </p>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default DirectionBias;
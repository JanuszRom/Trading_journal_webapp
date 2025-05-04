import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Card } from 'react-bootstrap';

const RiskRewardRatios = ({ trades }) => {
  const chartData = useMemo(() => {
    if (!trades || trades.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Filter trades that have both risk and reward data
    const tradesWithRR = trades.filter(trade => 
      trade.risk !== undefined && trade.risk !== null && !isNaN(parseFloat(trade.risk)) &&
      trade.reward !== undefined && trade.reward !== null && !isNaN(parseFloat(trade.reward)) &&
      parseFloat(trade.risk) > 0 // Avoid division by zero
    );

    if (tradesWithRR.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Calculate risk/reward ratio for each trade
    const tradesWithCalculatedRR = tradesWithRR.map(trade => {
      const risk = parseFloat(trade.risk);
      const reward = parseFloat(trade.reward);
      const riskRewardRatio = reward / risk; // This is the R:R ratio
      return {
        ...trade,
        calculatedRR: riskRewardRatio
      };
    });

    // Define risk/reward ratio buckets
    const riskRewardBuckets = [
      { label: '<0.5', min: 0, max: 0.5, count: 0, profit: 0 },
      { label: '0.5-1', min: 0.5, max: 1, count: 0, profit: 0 },
      { label: '1', min: 1, max: 1, count: 0, profit: 0 },
      { label: '1-2', min: 1, max: 2, count: 0, profit: 0 },
      { label: '2-3', min: 2, max: 3, count: 0, profit: 0 },
      { label: '3+', min: 3, max: Infinity, count: 0, profit: 0 }
    ];

    // Count trades in each bucket
    tradesWithCalculatedRR.forEach(trade => {
      const rr = trade.calculatedRR;
      const profit = parseFloat(trade.profit_loss);
      
      for (const bucket of riskRewardBuckets) {
        if (rr === bucket.min && bucket.min === bucket.max) {
          bucket.count++;
          bucket.profit += profit;
          break;
        } else if (rr >= bucket.min && rr < bucket.max) {
          bucket.count++;
          bucket.profit += profit;
          break;
        }
      }
    });

    // Prepare chart data
    return {
      labels: riskRewardBuckets.map(bucket => bucket.label),
      datasets: [
        {
          label: 'Number of Trades',
          data: riskRewardBuckets.map(bucket => bucket.count),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          yAxisID: 'y'
        },
        {
          label: 'Total P/L',
          data: riskRewardBuckets.map(bucket => bucket.profit),
          backgroundColor: 'rgba(255, 206, 86, 0.6)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1,
          yAxisID: 'y1',
          type: 'line'
        }
      ]
    };
  }, [trades]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        callbacks: {
          title: function(tooltipItems) {
            return `Risk/Reward Ratio: ${tooltipItems[0].label}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Risk/Reward Ratio'
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Number of Trades'
        },
        beginAtZero: true
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Total P/L'
        },
        grid: {
          drawOnChartArea: false
        }
      }
    }
  };

  // Check if trades have risk and reward data
  const hasRiskRewardData = trades && trades.some(trade => 
    trade.risk !== undefined && trade.risk !== null && !isNaN(parseFloat(trade.risk)) &&
    trade.reward !== undefined && trade.reward !== null && !isNaN(parseFloat(trade.reward)) &&
    parseFloat(trade.risk) > 0
  );

  if (!trades || trades.length === 0) {
    return (
      <Card className="p-3">
        <Card.Body>
          <Card.Title>Risk/Reward Ratios</Card.Title>
          <div className="text-center p-5">No trade data available</div>
        </Card.Body>
      </Card>
    );
  }

  if (!hasRiskRewardData) {
    return (
      <Card className="p-3">
        <Card.Body>
          <Card.Title>Risk/Reward Ratios</Card.Title>
          <div className="text-center p-5">
            No risk/reward data available for trades.
            <br />
            <small className="text-muted">
              Make sure your trades have both "risk" and "reward" properties with valid numbers.
            </small>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="p-3">
      <Card.Body>
        <Card.Title>Risk/Reward Ratios</Card.Title>
        <div style={{ height: '400px' }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
        <div className="mt-3 text-muted">
          <small>
            This chart shows how many trades you've taken at different risk/reward ratios 
            and the total P/L for each category.
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default RiskRewardRatios;
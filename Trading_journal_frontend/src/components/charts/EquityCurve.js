import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Card } from 'react-bootstrap';
import { formatDate } from '../../utils/helpers'; // Import the helper function

const EquityCurve = ({ trades }) => {
  const chartData = useMemo(() => {
    if (!trades || trades.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Sort trades by date ascending
    const sortedTrades = [...trades].sort((a, b) => 
      new Date(a.entry_date) - new Date(b.entry_date)
    );

    let cumulativeProfit = 0;
    const data = sortedTrades.map(trade => {
      cumulativeProfit += parseFloat(trade.profit_loss);
      return cumulativeProfit;
    });

    // Use formatDate helper instead of toLocaleDateString
    const labels = sortedTrades.map(trade => formatDate(trade.entry_date));

    return {
      labels,
      datasets: [
        {
          label: 'Equity Curve',
          data,
          fill: false,
          borderColor: cumulativeProfit >= 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)',
          tension: 0.1,
          pointRadius: 2,
          pointHoverRadius: 5
        }
      ]
    };
  }, [trades]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          title: function(tooltipItems) {
            return `Date: ${tooltipItems[0].label}`;
          },
          label: function(context) {
            return `Balance: ${context.raw.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date'
        },
        ticks: {
          maxTicksLimit: 10
        }
      },
      y: {
        title: {
          display: true,
          text: 'Cumulative P/L'
        },
        beginAtZero: false
      }
    }
  };

  if (!trades || trades.length === 0) {
    return (
      <Card className="p-3">
        <Card.Body>
          <Card.Title>Equity Curve</Card.Title>
          <div className="text-center p-5">No trade data available</div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="p-3">
      <Card.Body>
        <Card.Title>Equity Curve</Card.Title>
        <div style={{ height: '400px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default EquityCurve;
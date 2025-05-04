import React, { useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Card, ButtonGroup, Button } from 'react-bootstrap';

const TradesOverTime = ({ trades }) => {
  const [timeframe, setTimeframe] = useState('daily'); // 'daily', 'weekly', 'monthly'

  const chartData = useMemo(() => {
    if (!trades || trades.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Group trades by date according to selected timeframe
    const groupedTrades = {};
    const profitByPeriod = {};

    trades.forEach(trade => {
      if (!trade.entry_date) return;
      
      const date = new Date(trade.entry_date);
      let periodKey;
      
      if (timeframe === 'daily') {
        periodKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
      } else if (timeframe === 'weekly') {
        // Get the first day of the week (Sunday)
        const firstDay = new Date(date);
        const day = date.getDay();
        const diff = date.getDate() - day;
        firstDay.setDate(diff);
        periodKey = firstDay.toISOString().split('T')[0];
      } else if (timeframe === 'monthly') {
        periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }
      
      if (!groupedTrades[periodKey]) {
        groupedTrades[periodKey] = [];
        profitByPeriod[periodKey] = 0;
      }
      
      groupedTrades[periodKey].push(trade);
      profitByPeriod[periodKey] += parseFloat(trade.profit_loss);
    });

    // Sort periods
    const sortedPeriods = Object.keys(groupedTrades).sort();
    
    // Format labels based on timeframe
    const labels = sortedPeriods.map(period => {
      if (timeframe === 'daily') {
        // Convert YYYY-MM-DD to MM/DD
        const parts = period.split('-');
        return `${parts[1]}/${parts[2]}`;
      } else if (timeframe === 'weekly') {
        // Show as "Week of MM/DD"
        const date = new Date(period);
        return `Week of ${(date.getMonth() + 1)}/${date.getDate()}`;
      } else if (timeframe === 'monthly') {
        // Show as "MM/YYYY"
        const [year, month] = period.split('-');
        return `${month}/${year}`;
      }
      return period;
    });

    return {
      labels,
      datasets: [
        {
          label: 'Number of Trades',
          data: sortedPeriods.map(period => groupedTrades[period].length),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          yAxisID: 'y'
        },
        {
          label: 'P/L',
          data: sortedPeriods.map(period => profitByPeriod[period]),
          backgroundColor: profitByPeriod[sortedPeriods[0]] >= 0 ? 
            'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)',
          borderColor: profitByPeriod[sortedPeriods[0]] >= 0 ? 
            'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          type: 'line',
          yAxisID: 'y1'
        }
      ]
    };
  }, [trades, timeframe]);

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
            return tooltipItems[0].label;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: timeframe === 'daily' ? 'Date' : 
                timeframe === 'weekly' ? 'Week' : 'Month'
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
          text: 'P/L'
        },
        grid: {
          drawOnChartArea: false
        }
      }
    }
  };

  if (!trades || trades.length === 0) {
    return (
      <Card className="p-3">
        <Card.Body>
          <Card.Title>Trades Over Time</Card.Title>
          <div className="text-center p-5">No trade data available</div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="p-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Card.Title>Trades Over Time</Card.Title>
          <ButtonGroup size="sm">
            <Button 
              variant={timeframe === 'daily' ? 'primary' : 'outline-primary'}
              onClick={() => setTimeframe('daily')}
            >
              Daily
            </Button>
            <Button 
              variant={timeframe === 'weekly' ? 'primary' : 'outline-primary'}
              onClick={() => setTimeframe('weekly')}
            >
              Weekly
            </Button>
            <Button 
              variant={timeframe === 'monthly' ? 'primary' : 'outline-primary'}
              onClick={() => setTimeframe('monthly')}
            >
              Monthly
            </Button>
          </ButtonGroup>
        </div>
        <div style={{ height: '400px' }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default TradesOverTime;
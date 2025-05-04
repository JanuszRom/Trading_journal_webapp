import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Card } from 'react-bootstrap';

const ProfitByInstrument = ({ trades }) => {
  const chartData = useMemo(() => {
    if (!trades || trades.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Group trades by instrument
    const instrumentSummary = trades.reduce((acc, trade) => {
      const instrument = trade.instrument || 'Unknown';
      if (!acc[instrument]) {
        acc[instrument] = {
          totalProfit: 0,
          count: 0,
        };
      }
      acc[instrument].totalProfit += parseFloat(trade.profit_loss);
      acc[instrument].count += 1;
      return acc;
    }, {});

    // Sort by total profit
    const sortedInstruments = Object.keys(instrumentSummary).sort(
      (a, b) => instrumentSummary[b].totalProfit - instrumentSummary[a].totalProfit
    );

    const profitData = sortedInstruments.map(instrument => instrumentSummary[instrument].totalProfit);
    const backgroundColors = profitData.map(profit => 
      profit >= 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)'
    );
    const borderColors = profitData.map(profit => 
      profit >= 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'
    );

    return {
      labels: sortedInstruments,
      datasets: [
        {
          label: 'Total P/L',
          data: profitData,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
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
        display: false
      },
      tooltip: {
        callbacks: {
          title: function(tooltipItems) {
            return tooltipItems[0].label;
          },
          label: function(context) {
            return `P/L: ${context.raw.toFixed(2)}`;
          },
          afterLabel: function(context) {
            const instrument = context.label;
            const tradeCount = trades.filter(t => t.instrument === instrument).length;
            return `Trades: ${tradeCount}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Instrument'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Total P/L'
        }
      }
    }
  };

  if (!trades || trades.length === 0) {
    return (
      <Card className="p-3">
        <Card.Body>
          <Card.Title>P/L by Instrument</Card.Title>
          <div className="text-center p-5">No trade data available</div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="p-3">
      <Card.Body>
        <Card.Title>P/L by Instrument</Card.Title>
        <div style={{ height: '400px' }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProfitByInstrument;
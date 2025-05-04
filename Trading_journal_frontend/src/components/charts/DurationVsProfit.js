import React, { useMemo } from 'react';
import { Scatter } from 'react-chartjs-2';
import { Card } from 'react-bootstrap';

const DurationVsProfit = ({ trades }) => {
  // Helper function to calculate trade duration in hours
  const calculateDuration = (entryDate, exitDate) => {
    if (!entryDate || !exitDate) return 0;
    
    const entry = new Date(entryDate);
    const exit = new Date(exitDate);
    
    // Duration in milliseconds
    const durationMs = exit - entry;
    
    // Convert to hours
    return durationMs / (1000 * 60 * 60);
  };

  const chartData = useMemo(() => {
    if (!trades || trades.length === 0) {
      return { datasets: [] };
    }

    // Create scatter plot data points
    const dataPoints = trades.map(trade => {
      const duration = calculateDuration(trade.entry, trade.exit);
      return {
        x: duration,
        y: parseFloat(trade.profit_loss),
        id: trade.id,
        instrument: trade.instrument,
        direction: trade.direction
      };
    });

    return {
      datasets: [
        {
          label: 'Trade Duration vs P/L',
          data: dataPoints,
          backgroundColor: dataPoints.map(point => 
            point.y >= 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)'
          ),
          pointRadius: 6,
          pointHoverRadius: 8
        }
      ]
    };
  }, [trades]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          title: function(tooltipItems) {
            const dataPoint = tooltipItems[0].raw;
            return `Trade: ${dataPoint.instrument || 'Unknown'}`;
          },
          label: function(context) {
            const dataPoint = context.raw;
            const hours = dataPoint.x;
            let durationText;
            
            if (hours < 1) {
              durationText = `${Math.round(hours * 60)} minutes`;
            } else if (hours < 24) {
              durationText = `${hours.toFixed(1)} hours`;
            } else {
              durationText = `${(hours / 24).toFixed(1)} days`;
            }
            
            return [
              `P/L: ${dataPoint.y.toFixed(2)}`,
              `Duration: ${durationText}`,
              `Direction: ${dataPoint.direction || 'Unknown'}`
            ];
          }
        }
      },
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Duration (hours)'
        },
        min: 0
      },
      y: {
        title: {
          display: true,
          text: 'Profit/Loss'
        }
      }
    }
  };

  // Linear regression for trendline
  const calculateTrendline = () => {
    if (!trades || trades.length < 2) return null;
    
    const points = trades.map(trade => ({
      x: calculateDuration(trade.entry_date, trade.exit_date),
      y: parseFloat(trade.profit_loss)
    }));
    
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;
    let count = points.length;
    
    // Calculate the sums needed for linear regression
    points.forEach(point => {
      sumX += point.x;
      sumY += point.y;
      sumXY += point.x * point.y;
      sumXX += point.x * point.x;
    });
    
    // Calculate slope and y-intercept
    const slope = (count * sumXY - sumX * sumY) / (count * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / count;
    
    // Correlation coefficient
    const correlation = (count * sumXY - sumX * sumY) / 
      Math.sqrt((count * sumXX - sumX * sumX) * (count * sumXY - sumY * sumY));
    
    return { slope, intercept, correlation };
  };

  const trendline = useMemo(() => calculateTrendline(), [trades]);

  if (!trades || trades.length === 0) {
    return (
      <Card className="p-3">
        <Card.Body>
          <Card.Title>Trade Duration vs P/L</Card.Title>
          <div className="text-center p-5">No trade data available</div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="p-3">
      <Card.Body>
        <Card.Title>Trade Duration vs P/L</Card.Title>
        <div style={{ height: '400px' }}>
          <Scatter data={chartData} options={chartOptions} />
        </div>
        {trendline && (
          <div className="mt-3 text-muted">
            <small>
              Analysis: {trendline.slope > 0 ? 'Longer' : 'Shorter'} duration trades tend to be {Math.abs(trendline.slope) > 0.1 ? 'significantly' : 'slightly'} more profitable.
              {Math.abs(trendline.correlation) < 0.3 ? ' However, correlation is weak.' : 
               Math.abs(trendline.correlation) < 0.7 ? ' Moderate correlation observed.' : 
               ' Strong correlation observed.'}
            </small>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default DurationVsProfit;

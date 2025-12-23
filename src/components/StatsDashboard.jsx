
import React, { useMemo, useState } from 'react';
import 'chart.js/auto'; // Import everything to avoid registration issues
import { Line, Bar } from 'react-chartjs-2';
import { format, subMonths, isAfter, startOfMonth } from 'date-fns';

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { color: '#94a3b8' }
    },
    title: { display: false },
  },
  scales: {
    y: {
      grid: { color: 'rgba(255, 255, 255, 0.05)' },
      ticks: { color: '#64748b' }
    },
    x: {
      grid: { display: false },
      ticks: { color: '#64748b' }
    }
  }
};

export const StatsDashboard = ({ entries }) => {
  const [range, setRange] = useState(3); // Months: 1, 3, 6, 12

  const stats = useMemo(() => {
    if (!entries.length) return null;

    const now = new Date();
    const startDate = subMonths(now, range);
    
    // Filter entries within range
    const filtered = entries
      .filter(e => isAfter(new Date(e.date), startDate))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate totals
    const totalCost = filtered.reduce((acc, curr) => acc + curr.cost, 0);
    const totalReach = filtered.reduce((acc, curr) => acc + curr.reach, 0);
    const avgCostPerKm = totalReach > 0 ? (totalCost / totalReach).toFixed(3) : 0;

    // Accuracy Calculations
    const entriesWithFinal = filtered.filter(e => e.finalMileage);
    let accuracy = 0;
    let avgDiff = 0;

    if (entriesWithFinal.length > 0) {
      const totalValidEst = entriesWithFinal.reduce((acc, curr) => acc + curr.reach, 0);
      const totalValidActual = entriesWithFinal.reduce((acc, curr) => acc + (curr.finalMileage - curr.mileage + (curr.remainingReach || 0)), 0);
      
      accuracy = totalValidEst > 0 ? ((totalValidActual / totalValidEst) * 100).toFixed(1) : 0;
      avgDiff = ((totalValidActual - totalValidEst) / entriesWithFinal.length).toFixed(1);
    }

    // Chart Data
    const groupedByMonth = filtered.reduce((acc, curr) => {
      const month = format(new Date(curr.date), 'MMM yyyy');
      if (!acc[month]) acc[month] = { cost: 0, reach: 0, count: 0 };
      acc[month].cost += curr.cost;
      acc[month].reach += curr.reach;
      acc[month].count += 1;
      return acc;
    }, {});

    const labels = Object.keys(groupedByMonth);
    const costData = labels.map(l => groupedByMonth[l].cost);
    const reachData = labels.map(l => groupedByMonth[l].reach);
    
    const actualReachData = labels.map(l => {
      const monthEntries = filtered.filter(e => format(new Date(e.date), 'MMM yyyy') === l);
      return monthEntries.reduce((sum, e) => sum + (e.finalMileage ? (e.finalMileage - e.mileage + (e.remainingReach || 0)) : 0), 0);
    });

    return {
      totalCost,
      totalReach,
      avgCostPerKm,
      accuracy,
      avgDiff,
      chartData: {
        labels,
        datasets: [
          {
            label: 'Cost',
            data: costData,
            borderColor: '#38bdf8',
            backgroundColor: 'rgba(56, 189, 248, 0.5)',
            yAxisID: 'y',
            type: 'line'
          },
          {
            label: 'Est Reach',
            data: reachData,
            borderColor: '#818cf8',
            backgroundColor: 'rgba(129, 140, 248, 0.5)',
            yAxisID: 'y1',
            type: 'bar',
            barPercentage: 0.6,
            categoryPercentage: 0.8
          },
          {
            label: 'Actual Reach',
            data: actualReachData,
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34, 197, 94, 0.5)',
            yAxisID: 'y1',
            type: 'bar',
            barPercentage: 0.6,
            categoryPercentage: 0.8
          }
        ]
      }
    };
  }, [entries, range]);

  if (!entries.length) return <div className="text-center p-8 text-muted">No data for statistics</div>;

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {[1, 3, 6, 12].map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              background: range === r ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
              color: range === r ? '#000' : 'var(--text-secondary)',
              fontSize: '0.875rem',
              fontWeight: 600,
              whiteSpace: 'nowrap'
            }}
          >
            {r === 1 ? '1 Month' : r === 12 ? '1 Year' : `${r} Months`}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOTAL SPENT</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {stats.totalCost.toFixed(2)}
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>COST / KM</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
            {stats.avgCostPerKm}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>REACH ACCURACY</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: Number(stats.accuracy) >= 100 ? 'var(--success)' : 'var(--warning)' }}>
            {stats.accuracy}%
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AVG DIFF</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: Number(stats.avgDiff) >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {Number(stats.avgDiff) > 0 ? '+' : ''}{stats.avgDiff} <span style={{fontSize: '0.8rem'}}>km</span>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1rem', height: '300px' }}>
        <Line 
          options={{
            ...chartOptions,
            scales: {
              ...chartOptions.scales,
              y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: { display: false },
                ticks: { color: '#818cf8' }
              },
            }
          }} 
          data={stats.chartData} 
        />
      </div>
    </div>
  );
};

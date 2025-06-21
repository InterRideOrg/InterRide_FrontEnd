import React from 'react';
import { BarChart, LineChart } from '@mui/x-charts';

export default function WalletCharts({ weekly, lineSeries }) {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        <BalanceCard amount={1250} />
        <Tabs/> {/* Día / Semana / Mes switches series */}
      </Grid>
      <Grid item xs={12} md={4}>
        <LineChart
          xAxis={[{ data: lineSeries.labels }]}
          series={[{ data: lineSeries.values, area: true }]}
          height={240}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <BarChart
          series={weekly}
          height={240}
          colors={['#007C91', '#2CA3B0', '#004C5A']}
        />
      </Grid>
    </Grid>
  );
}

import MainNavbar from "../../components/navigation/MainNavbar";
import axiosInstance from "../../interceptors/axiosInstance";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import './styles/DriverWalletPage.css';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const DriverWalletPage = () => {
  const { driverId } = useParams();
  const [monthlyData, setMonthlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const response = await axiosInstance.get(`/pagos/conductor/${driverId}/anual-report?year=${year}`);
        setMonthlyData(response.data);
      } catch (error) {
        console.error("Error fetching driver wallet data:", error);
      }
    }
    fetchMonthlyData();
  }, [driverId, year]);

  useEffect(() => {
    const fetchDailyData = async () => {
      try {
        const response = await axiosInstance.get(`/pagos/conductor/${driverId}/monthly-report?year=${year}&month=${month}`);
        setDailyData(response.data);
      } catch (error) {
        console.error("Error fetching driver wallet data:", error);
      }
    }
    fetchDailyData();
  }, [driverId, year, month]);

  // Función para obtener el nombre del mes
  const getMonthName = (monthNumber) => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[monthNumber - 1];
  };

  // Calcular total de ganancias
  const totalEarnings = monthlyData.reduce((sum, item) => sum + item.totalGanancias, 0);
  const monthlyTotal = dailyData.reduce((sum, item) => sum + item.totalGanancias, 0);

  // Configuración del gráfico mensual (Barras)
  const monthlyChartData = {
    labels: monthlyData.map(item => getMonthName(item.mes)),
    datasets: [
      {
        label: 'Ganancias Mensuales (S/.)',
        data: monthlyData.map(item => item.totalGanancias),
        backgroundColor: 'rgba(57, 166, 172, 0.8)',
        borderColor: 'rgba(57, 166, 172, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  };

  // Configuración del gráfico diario (Líneas)
  const dailyChartData = {
    labels: dailyData.map(item => `Día ${item.dia}`),
    datasets: [
      {
        label: 'Ganancias Diarias (S/.)',
        data: dailyData.map(item => item.totalGanancias),
        borderColor: 'rgba(255, 107, 53, 1)',
        backgroundColor: 'rgba(255, 107, 53, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(255, 107, 53, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
      }
    ]
  };

  // Opciones de los gráficos
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(57, 166, 172, 1)',
        borderWidth: 1,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return 'S/. ' + value;
          }
        }
      }
    }
  };

  return (
    <>
      <MainNavbar />
      <section className="driver-wallet-page-sec">
        <div className="driver-wallet-page-header">
          <h1>Reporte de Ingresos</h1>
          <div className="driver-wallet-page-controls">
            <div className="driver-wallet-page-year-selector">
              <label>Año:</label>
              <select 
                value={year} 
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="driver-wallet-page-select"
              >
                {[2023, 2024, 2025, 2026].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div className="driver-wallet-page-month-selector">
              <label>Mes:</label>
              <select 
                value={month} 
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="driver-wallet-page-select"
              >
                {Array.from({length: 12}, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {getMonthName(i + 1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="driver-wallet-page-content">
          {/* Resumen de ganancias */}
          <div className="driver-wallet-page-summary">
            <div className="driver-wallet-page-summary-card">
              <h3>Total Anual {year}</h3>
              <p className="driver-wallet-page-total">S/. {totalEarnings.toFixed(2)}</p>
            </div>
            <div className="driver-wallet-page-summary-card">
              <h3>{getMonthName(month)} {year}</h3>
              <p className="driver-wallet-page-monthly">S/. {monthlyTotal.toFixed(2)}</p>
            </div>
          </div>

          {/* Gráfico mensual */}
          <div className="driver-wallet-page-chart-container">
            <h2>Ganancias por Mes - {year}</h2>
            <div className="driver-wallet-page-chart">
              {monthlyData.length > 0 ? (
                <Bar data={monthlyChartData} options={chartOptions} />
              ) : (
                <div className="driver-wallet-page-no-data">
                  No hay datos disponibles para el año {year}
                </div>
              )}
            </div>
          </div>

          {/* Gráfico diario */}
          <div className="driver-wallet-page-chart-container">
            <h2>Ganancias por Día - {getMonthName(month)} {year}</h2>
            <div className="driver-wallet-page-chart">
              {dailyData.length > 0 ? (
                <Line data={dailyChartData} options={chartOptions} />
              ) : (
                <div className="driver-wallet-page-no-data">
                  No hay datos disponibles para {getMonthName(month)} {year}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default DriverWalletPage;
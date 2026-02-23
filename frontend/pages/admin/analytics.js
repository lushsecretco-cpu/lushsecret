import { API_URL } from '../../config/api';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

// Iconos SVG Luxury
const LuxuryIcons = {
  Eye: () => (
    <svg className="w-6 h-6 text-rose-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Shopping: () => (
    <svg className="w-6 h-6 text-rose-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Users: () => (
    <svg className="w-6 h-6 text-rose-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Cart: () => (
    <svg className="w-6 h-6 text-rose-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Money: () => (
    <svg className="w-6 h-6 text-rose-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Cash: () => (
    <svg className="w-6 h-6 text-rose-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Ticket: () => (
    <svg className="w-6 h-6 text-rose-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Chart: () => (
    <svg className="w-6 h-6 text-rose-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Target: () => (
    <svg className="w-6 h-6 text-rose-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="6" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Trophy: () => (
    <svg className="w-6 h-6 text-rose-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 3v1m6-1v1m4 8a5 5 0 11-10 0m10 0a5 5 0 01-10 0m10 0H5m0 0V6a2 2 0 012-2h10a2 2 0 012 2v6M7 21h10M12 17v4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Sparkles: () => (
    <svg className="w-6 h-6 text-rose-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Lightning: () => (
    <svg className="w-6 h-6 text-rose-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
};

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [days, setDays] = useState(7);
  const [refreshing, setRefreshing] = useState(false);
  const [orderStats, setOrderStats] = useState(null);

  useEffect(() => {
    // Verificar autenticación de admin
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    if (!token || userType !== 'admin') {
      router.push('/');
      return;
    }

    fetchDashboardData();
    fetchOrderStats();
  }, [days]);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      const response = await fetch(`${API_URL}/api/analytics/dashboard?days=${days}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchOrderStats = async () => {
    try {
      const response = await fetch('${API_URL}/api/orders/stats/shipping');
      const data = await response.json();
      setOrderStats(data);
    } catch (error) {
      console.error('Error al cargar estadísticas de pedidos:', error);
    }
  };

  // Colores luxury rose gold para los gráficos
  const COLORS = ['#E2A4B8', '#F4C2D4', '#D88CA6', '#FFB6C1', '#C97A92', '#F5B8CC'];
  
  // Preparar datos para gráficos
  const prepareChartData = () => {
    if (!stats) return null;
    
    // Datos para gráfico de líneas (visitas por día)
    const viewsByDayData = stats.viewsByDay?.map(item => ({
      fecha: item.date,
      visitas: parseInt(item.count)
    })) || [];
    
    // Datos para gráfico de barras (top productos)
    const topProductsData = stats.topViewed?.slice(0, 8).map(item => ({
      nombre: item.product_name.length > 20 ? item.product_name.substring(0, 20) + '...' : item.product_name,
      visitas: parseInt(item.views)
    })) || [];
    
    // Datos para gráfico circular (categorías)
    const categoriesData = stats.topCategories?.map(item => ({
      name: item.category || 'Sin categoría',
      value: parseInt(item.views)
    })) || [];
    
    // Datos de VENTAS por día
    const salesByDayData = stats.salesByDay?.map(item => ({
      fecha: item.date,
      ventas: parseInt(item.sales),
      ingresos: parseFloat(item.revenue)
    })) || [];
    
    // Productos más vendidos
    const topSellingData = stats.topSelling?.slice(0, 8).map(item => ({
      nombre: item.product_name.length > 20 ? item.product_name.substring(0, 20) + '...' : item.product_name,
      unidades: parseInt(item.units_sold),
      ingresos: parseFloat(item.revenue)
    })) || [];
    
    return { viewsByDayData, topProductsData, categoriesData, salesByDayData, topSellingData };
  };

  const chartData = prepareChartData();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatEventType = (type) => {
    const types = {
      page_view: 'Vista de página',
      product_view: 'Vista de producto',
      add_to_cart: 'Agregado al carrito',
      purchase: 'Compra realizada',
      search: 'Búsqueda',
      page_exit: 'Salida de página'
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-neutral-900 to-zinc-950 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-rose-300/60 border-r-4 border-r-rose-200/40"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border border-rose-400/20"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-neutral-900 to-zinc-950 text-white relative overflow-hidden">
      {/* Efectos de fondo luxury */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-900/10 via-transparent to-transparent pointer-events-none"></div>
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyMTgsIDE2NSwgMzIsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30 pointer-events-none"></div>
      
      <Head>
        <title>Panel de Monitoreo Luxury - LushSecret</title>
      </Head>

      {/* Header */}
      <div className="border-b border-rose-400/10 backdrop-blur-lg bg-black/20 sticky top-0 z-50 shadow-2xl shadow-rose-400/5">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-5xl font-light tracking-wide bg-gradient-to-r from-rose-200 via-pink-300 to-rose-200 bg-clip-text text-transparent drop-shadow-2xl">
                Panel de Monitoreo
              </h1>
              <p className="text-pink-100/40 mt-2 text-sm tracking-widest uppercase font-light">Análisis completo de la actividad web</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Selector de días */}
              <select
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="bg-zinc-900/80 backdrop-blur-xl border border-rose-400/20 rounded-xl px-6 py-3 text-pink-100 focus:border-rose-300 focus:ring-2 focus:ring-rose-400/30 outline-none shadow-xl shadow-black/50 hover:border-rose-300/40 transition-all duration-300 font-light"
              >
                <option value={1}>Últimas 24 horas</option>
                <option value={7}>Últimos 7 días</option>
                <option value={30}>Últimos 30 días</option>
                <option value={90}>Últimos 90 días</option>
                <option value={365}>Último año</option>
              </select>

              {/* Botón de refrescar */}
              <button
                onClick={() => {
                  fetchDashboardData();
                  fetchOrderStats();
                }}
                disabled={refreshing}
                className="bg-gradient-to-r from-rose-400 via-pink-300 to-rose-400 hover:from-rose-300 hover:via-pink-300 hover:to-rose-300 text-black font-light px-8 py-3 rounded-xl transition-all duration-300 disabled:opacity-50 shadow-2xl shadow-rose-400/40 hover:shadow-rose-300/60 hover:scale-105 disabled:scale-100 flex items-center gap-2"
              >
                <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {refreshing ? 'Actualizando...' : 'Actualizar'}
              </button>

              <button
                onClick={() => router.push('/admin/dashboard')}
                className="bg-zinc-900/60 backdrop-blur-xl hover:bg-zinc-800/80 border border-rose-400/20 hover:border-rose-300/40 text-pink-100 font-light px-8 py-3 rounded-xl transition-all duration-300 shadow-xl shadow-black/50 hover:shadow-rose-400/10"
              >
                ← Volver al Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tarjetas de estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total de Visitas"
            value={stats?.totalViews || 0}
            icon={<LuxuryIcons.Eye />}
            gradient="from-rose-900/80 via-rose-800/60 to-rose-900/80"
          />
          <StatCard
            title="Productos Vistos"
            value={stats?.productViews || 0}
            icon={<LuxuryIcons.Shopping />}
            gradient="from-rose-900/70 via-rose-900/50 to-rose-900/70"
          />
          <StatCard
            title="Sesiones Únicas"
            value={stats?.uniqueSessions || 0}
            icon={<LuxuryIcons.Users />}
            gradient="from-rose-800/70 via-rose-800/50 to-rose-800/70"
          />
          <StatCard
            title="Items al Carrito"
            value={stats?.cartAdds?.reduce((sum, item) => sum + parseInt(item.adds), 0) || 0}
            icon={<LuxuryIcons.Cart />}
            gradient="from-rose-800/80 via-rose-700/60 to-rose-800/80"
          />
        </div>

        {/* Tarjetas de estadísticas de VENTAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total de Ventas"
            value={stats?.totalSales || 0}
            icon={<LuxuryIcons.Money />}
            gradient="from-rose-700/80 via-rose-700/60 to-rose-700/80"
          />
          <StatCard
            title="Ingresos Totales"
            value={`$${(stats?.totalRevenue || 0).toLocaleString('es-ES', {minimumFractionDigits: 2})}`}
            icon={<LuxuryIcons.Cash />}
            gradient="from-rose-700/90 via-pink-400/70 to-rose-700/90"
          />
          <StatCard
            title="Ticket Promedio"
            value={`$${(stats?.avgTicket || 0).toLocaleString('es-ES', {minimumFractionDigits: 2})}`}
            icon={<LuxuryIcons.Ticket />}
            gradient="from-rose-800/70 via-rose-800/50 to-rose-800/70"
          />
          <StatCard
            title="Tasa Conversión"
            value={`${(stats?.conversionRate || 0)}%`}
            icon={<LuxuryIcons.Chart />}
            gradient="from-rose-800/80 via-rose-800/60 to-rose-800/80"
          />
        </div>

        {/* Tarjetas de RENTABILIDAD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="group relative bg-gradient-to-br from-rose-950/40 via-rose-950/30 to-rose-950/40 border border-rose-400/20 hover:border-rose-300/40 rounded-2xl p-8 backdrop-blur-xl hover:scale-[1.02] transition-all duration-500 overflow-hidden shadow-2xl shadow-black/50">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-rose-400/10 rounded-full blur-3xl group-hover:bg-rose-300/15 transition-all duration-700"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-light text-rose-200 tracking-wide">Ganancia Total Neta</h3>
                  <svg className="w-8 h-8 text-rose-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 00-1.3-3.2 4.2 4.2 0 00-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 00-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 00-.1 3.2A4.6 4.6 0 004 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-rose-300">
                  <LuxuryIcons.Money />
                </span>
              </div>
              <div className="text-center py-4">
                <p className="text-6xl font-light text-white mb-3 tracking-tight">
                  ${(stats?.totalProfit || 0).toLocaleString('es-ES', {minimumFractionDigits: 2})}
                </p>
                <p className="text-sm text-pink-100/40 uppercase tracking-widest font-light">
                  Diferencia entre ingresos y costos de producción
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-rose-400/10">
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <p className="text-xs text-pink-100/30 uppercase tracking-wide mb-1">Ingresos</p>
                    <p className="text-sm text-rose-200 font-light">${(stats?.totalRevenue || 0).toLocaleString('es-ES', {minimumFractionDigits: 2})}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-pink-100/30 uppercase tracking-wide mb-1">Margen</p>
                    <p className="text-sm text-rose-200 font-light">{stats?.avgMargin || 0}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-rose-950/40 via-rose-950/30 to-rose-950/40 border border-rose-400/20 hover:border-rose-300/40 rounded-2xl p-8 backdrop-blur-xl hover:scale-[1.02] transition-all duration-500 overflow-hidden shadow-2xl shadow-black/50">
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-rose-400/10 rounded-full blur-3xl group-hover:bg-rose-400/15 transition-all duration-700"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-light text-rose-200 tracking-wide">Margen Promedio</h3>
                  <svg className="w-6 h-6 text-rose-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-rose-300">
                  <LuxuryIcons.Chart />
                </span>
              </div>
              <div className="text-center py-4">
                <p className="text-6xl font-light text-white mb-3 tracking-tight">
                  {stats?.avgMargin || 0}%
                </p>
                <p className="text-sm text-pink-100/40 uppercase tracking-widest font-light">
                  Porcentaje de ganancia sobre ventas
                </p>
              </div>
              <div className="mt-6">
                <div className="w-full h-2 bg-gradient-to-r from-zinc-800/50 via-zinc-700/30 to-zinc-800/50 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-rose-400 via-pink-300 to-rose-300 transition-all duration-1000 shadow-lg shadow-rose-400/50 group-hover:shadow-rose-300/70"
                    style={{ width: `${Math.min(stats?.avgMargin || 0, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-pink-100/50 mt-4 text-center uppercase tracking-widest font-light">
                  {stats?.avgMargin >= 50 ? 'Excelente margen' : 
                   stats?.avgMargin >= 30 ? 'Buen margen' : 
                   stats?.avgMargin >= 15 ? 'Margen moderado' : 
                   'Margen bajo'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Métricas Avanzadas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Tasa de conversión visualización -> carrito */}
          <div className="group relative bg-gradient-to-br from-rose-950/30 via-rose-950/20 to-rose-950/30 border border-rose-400/20 hover:border-rose-300/30 rounded-2xl p-6 backdrop-blur-xl transition-all duration-500 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-400/5 rounded-full blur-2xl group-hover:bg-rose-300/10 transition-all duration-700"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-light text-rose-200 tracking-wide">Tasa de Conversión</h3>
                <span className="text-rose-300">
                  <LuxuryIcons.Target />
                </span>
              </div>
              <div className="text-center">
                <p className="text-5xl font-light text-white mb-2 tracking-tight">
                  {stats?.productViews && stats?.cartAdds?.length 
                    ? ((stats.cartAdds.reduce((sum, item) => sum + parseInt(item.adds), 0) / stats.productViews) * 100).toFixed(1)
                    : '0'}%
                </p>
                <p className="text-xs text-pink-100/40 uppercase tracking-wide font-light">de productos vistos se agregan al carrito</p>
              </div>
              <div className="mt-4 pt-4 border-t border-rose-400/10 flex justify-between text-xs text-pink-100/30">
                <span>Vistas: {stats?.productViews || 0}</span>
                <span>Carritos: {stats?.cartAdds?.reduce((sum, item) => sum + parseInt(item.adds), 0) || 0}</span>
              </div>
            </div>
          </div>

          {/* Promedio de visitas por sesión */}
          <div className="group relative bg-gradient-to-br from-rose-950/30 via-rose-950/20 to-rose-950/30 border border-rose-400/20 hover:border-rose-300/30 rounded-2xl p-6 backdrop-blur-xl transition-all duration-500 overflow-hidden">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-400/5 rounded-full blur-2xl group-hover:bg-rose-400/10 transition-all duration-700"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-light text-rose-200 tracking-wide">Engagement</h3>
                <span className="text-rose-300">
                  <LuxuryIcons.Lightning />
                </span>
              </div>
              <div className="text-center">
                <p className="text-5xl font-light text-white mb-2 tracking-tight">
                  {stats?.totalViews && stats?.uniqueSessions 
                    ? (stats.totalViews / stats.uniqueSessions).toFixed(1)
                    : '0'}
                </p>
                <p className="text-xs text-pink-100/40 uppercase tracking-wide font-light">páginas por sesión</p>
              </div>
              <div className="mt-4 pt-4 border-t border-rose-400/10 flex justify-between text-xs text-pink-100/30">
                <span>Total vistas: {stats?.totalViews || 0}</span>
                <span>Sesiones: {stats?.uniqueSessions || 0}</span>
              </div>
            </div>
          </div>

          {/* Producto más popular */}
          <div className="group relative bg-gradient-to-br from-rose-900/30 via-rose-900/20 to-rose-900/30 border border-rose-400/20 hover:border-rose-300/30 rounded-2xl p-6 backdrop-blur-xl transition-all duration-500 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-32 h-32 bg-rose-400/5 rounded-full blur-2xl group-hover:bg-rose-300/10 transition-all duration-700"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-light text-rose-200 tracking-wide">Más Popular</h3>
                <span className="text-rose-300">
                  <LuxuryIcons.Trophy />
                </span>
              </div>
              <div className="text-center">
                <p className="text-xl font-light text-white mb-1 line-clamp-2">
                  {stats?.topViewed?.[0]?.product_name || 'N/A'}
                </p>
                <p className="text-xs text-pink-100/40 mb-3 uppercase tracking-wide">{stats?.topViewed?.[0]?.category || 'Sin categoría'}</p>
                <div className="bg-gradient-to-r from-rose-400/30 via-pink-300/40 to-rose-400/30 rounded-full px-6 py-2 inline-block border border-rose-300/20 backdrop-blur">
                  <p className="text-2xl font-light text-white tracking-tight">
                    {stats?.topViewed?.[0]?.views || 0} <span className="text-sm text-pink-100/50">vistas</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos Visuales */}
        {chartData && (
          <>
            {/* Gráfico de tendencia de visitas */}
            <DashboardCard title={<span className="flex items-center gap-3"><LuxuryIcons.Chart /> Tendencia de Visitas</span>}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData.viewsByDayData}>
                  <defs>
                    <linearGradient id="colorVisitas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E2A4B8" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#E2A4B8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" opacity={0.3} />
                  <XAxis dataKey="fecha" stroke="#C97A92" style={{ fontSize: '12px', fill: '#E2A4B8' }} />
                  <YAxis stroke="#C97A92" style={{ fontSize: '12px', fill: '#E2A4B8' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                      border: '1px solid rgba(212, 175, 55, 0.5)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 8px 32px rgba(212, 175, 55, 0.2)'
                    }}
                    labelStyle={{ color: '#F4C2D4', fontWeight: '300' }}
                    itemStyle={{ color: '#E2A4B8' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="visitas" 
                    stroke="#E2A4B8" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorVisitas)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </DashboardCard>

            {/* Grid de gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Gráfico de barras - Productos más visitados */}
              <DashboardCard title={<span className="flex items-center gap-3"><LuxuryIcons.Trophy /> Top Productos (Gráfico)</span>}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.topProductsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" opacity={0.3} />
                    <XAxis dataKey="nombre" stroke="#C97A92" angle={-45} textAnchor="end" height={100} style={{ fontSize: '11px', fill: '#D88CA6' }} />
                    <YAxis stroke="#C97A92" style={{ fontSize: '12px', fill: '#E2A4B8' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                        border: '1px solid rgba(212, 175, 55, 0.5)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 32px rgba(212, 175, 55, 0.2)'
                      }}
                      labelStyle={{ color: '#F4C2D4', fontWeight: '300' }}
                      itemStyle={{ color: '#E2A4B8' }}
                    />
                    <Bar dataKey="visitas" fill="#E2A4B8" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </DashboardCard>

              {/* Gráfico circular - Categorías */}
              <DashboardCard title={<span className="flex items-center gap-3"><LuxuryIcons.Target /> Distribución por Categorías</span>}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData.categoriesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#E2A4B8"
                      dataKey="value"
                    >
                      {chartData.categoriesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                        border: '1px solid rgba(212, 175, 55, 0.5)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 32px rgba(212, 175, 55, 0.2)',
                        padding: '12px'
                      }}
                      labelStyle={{
                        color: '#E2A4B8',
                        fontWeight: '300',
                        fontSize: '13px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </DashboardCard>
            </div>

            {/* GRÁFICOS DE VENTAS */}
            <div className="mb-8">
              <div className="flex items-center gap-4">
                <h2 className="text-3xl font-light bg-gradient-to-r from-rose-200 via-pink-300 to-rose-200 bg-clip-text text-transparent">
                  Estadísticas de Ventas
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-rose-300/30 via-pink-300/20 to-transparent"></div>
              </div>
            </div>

            {/* Gráfico de ventas e ingresos por día */}
            <DashboardCard title={<span className="flex items-center gap-3"><LuxuryIcons.Cash /> Ventas e Ingresos por Día</span>}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.salesByDayData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" opacity={0.3} />
                  <XAxis 
                    dataKey="fecha" 
                    stroke="#C97A92"
                    style={{ fill: '#E2A4B8', fontSize: '12px', fontWeight: '300' }}
                  />
                  <YAxis 
                    yAxisId="left" 
                    stroke="#C97A92"
                    style={{ fill: '#E2A4B8', fontSize: '12px', fontWeight: '300' }}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    stroke="#D88CA6"
                    style={{ fill: '#F4C2D4', fontSize: '12px', fontWeight: '300' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                      border: '1px solid rgba(212, 175, 55, 0.5)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 8px 32px rgba(212, 175, 55, 0.2)',
                      padding: '12px'
                    }}
                    labelStyle={{
                      color: '#E2A4B8',
                      fontWeight: '300'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{
                      color: '#E2A4B8',
                      fontWeight: '300'
                    }}
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="ventas" 
                    stroke="#E2A4B8" 
                    strokeWidth={2}
                    name="Ventas"
                    dot={{ fill: '#E2A4B8', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#FFB6C1' }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="ingresos" 
                    stroke="#F4C2D4" 
                    strokeWidth={2}
                    name="Ingresos ($)"
                    dot={{ fill: '#F4C2D4', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#FFB6C1' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </DashboardCard>

            {/* Grid de gráficos de ventas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Productos más vendidos (barras) */}
              <DashboardCard title={<span className="flex items-center gap-3"><LuxuryIcons.Trophy /> Productos Más Vendidos (Unidades)</span>}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.topSellingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" opacity={0.3} />
                    <XAxis 
                      dataKey="nombre" 
                      stroke="#C97A92" 
                      angle={-45} 
                      textAnchor="end" 
                      height={100}
                      style={{ fill: '#E2A4B8', fontSize: '11px', fontWeight: '300' }}
                    />
                    <YAxis 
                      stroke="#C97A92"
                      style={{ fill: '#E2A4B8', fontSize: '12px', fontWeight: '300' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                        border: '1px solid rgba(212, 175, 55, 0.5)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 32px rgba(212, 175, 55, 0.2)',
                        padding: '12px'
                      }}
                      labelStyle={{
                        color: '#E2A4B8',
                        fontWeight: '300'
                      }}
                    />
                    <Bar 
                      dataKey="unidades" 
                      fill="#E2A4B8" 
                      radius={[8, 8, 0, 0]}
                      style={{ filter: 'drop-shadow(0 4px 8px rgba(212, 175, 55, 0.3))' }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </DashboardCard>

              {/* Ingresos por producto */}
              <DashboardCard title={<span className="flex items-center gap-3"><LuxuryIcons.Money /> Ingresos por Producto</span>}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.topSellingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" opacity={0.3} />
                    <XAxis 
                      dataKey="nombre" 
                      stroke="#C97A92" 
                      angle={-45} 
                      textAnchor="end" 
                      height={100}
                      style={{ fill: '#E2A4B8', fontSize: '11px', fontWeight: '300' }}
                    />
                    <YAxis 
                      stroke="#C97A92"
                      style={{ fill: '#E2A4B8', fontSize: '12px', fontWeight: '300' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                        border: '1px solid rgba(212, 175, 55, 0.5)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 32px rgba(212, 175, 55, 0.2)',
                        padding: '12px'
                      }}
                      labelStyle={{
                        color: '#E2A4B8',
                        fontWeight: '300'
                      }}
                    />
                    <Bar 
                      dataKey="ingresos" 
                      fill="#D88CA6" 
                      radius={[8, 8, 0, 0]}
                      style={{ filter: 'drop-shadow(0 4px 8px rgba(201, 176, 55, 0.3))' }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </DashboardCard>
            </div>
          </>
        )}

        {/* Grid de dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Productos más visitados con imágenes */}
          <DashboardCard title={<span className="flex items-center gap-3"><LuxuryIcons.Trophy /> Productos Más Visitados</span>}>
            <div className="space-y-3">
              {stats?.topViewed?.slice(0, 10).map((product, index) => (
                <div
                  key={product.product_id}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-zinc-900/40 via-neutral-900/30 to-zinc-900/40 backdrop-blur-xl rounded-xl border border-rose-400/10 hover:border-rose-300/30 transition-all duration-300 group"
                >
                  {/* Imagen del producto */}
                  {product.image && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-800 border border-rose-400/20">
                      <img 
                        src={product.image} 
                        alt={product.product_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between flex-1">
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center justify-center w-8 h-8 rounded-full border-2 flex-shrink-0 ${index === 0 ? 'border-rose-300 bg-rose-300/20 text-rose-300' : index === 1 ? 'border-rose-200 bg-rose-200/20 text-rose-200' : index === 2 ? 'border-rose-400 bg-rose-400/20 text-rose-400' : 'border-rose-600 bg-rose-800/20 text-rose-600'}`}>
                        <span className="text-xs font-light">{index + 1}</span>
                      </span>
                      <div>
                        <p className="font-light text-pink-100">{product.product_name}</p>
                        <div className="flex gap-2 items-center mt-1">
                          <p className="text-xs text-rose-200/60 uppercase tracking-wider">{product.category || 'Sin categoría'}</p>
                          {product.price && (
                            <span className="text-xs bg-rose-400/20 text-rose-200 px-2 py-0.5 rounded border border-rose-400/30">
                              ${product.price}
                            </span>
                          )}
                          {product.stock !== null && (
                            <span className={`text-xs px-2 py-0.5 rounded border ${product.stock > 0 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'}`}>
                              Stock: {product.stock}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="text-rose-300 font-light text-lg whitespace-nowrap flex items-center gap-2">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {product.views}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>

          {/* Categorías más populares */}
          <DashboardCard title={<span className="flex items-center gap-3"><LuxuryIcons.Target /> Categorías Más Populares</span>}>
            <div className="space-y-3">
              {stats?.topCategories?.map((cat, index) => {
                const total = stats.topCategories.reduce((sum, c) => sum + parseInt(c.views), 0);
                const percentage = ((parseInt(cat.views) / total) * 100).toFixed(1);
                
                return (
                  <div key={index} className="p-4 bg-gradient-to-br from-zinc-900/40 via-rose-950/10 to-zinc-900/40 backdrop-blur-xl rounded-xl border border-rose-400/10 hover:border-rose-300/20 transition-all duration-300">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-light text-pink-100 text-lg">{cat.category || 'Sin categoría'}</span>
                      <span className="text-rose-300 font-light">{cat.views} vistas</span>
                    </div>
                    <div className="w-full bg-zinc-800/50 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-rose-400 via-pink-300 to-rose-300 h-2 rounded-full transition-all duration-500 shadow-lg shadow-rose-400/50"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-rose-200/60 mt-2 uppercase tracking-wider">{percentage}% del total</p>
                  </div>
                );
              })}
            </div>
          </DashboardCard>
        </div>

        {/* Productos agregados al carrito con imágenes */}
        {stats?.cartAdds && stats.cartAdds.length > 0 && (
          <DashboardCard title={<span className="flex items-center gap-3"><LuxuryIcons.Cart /> Productos Más Agregados al Carrito</span>}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.cartAdds.map((item, index) => (
                <div
                  key={index}
                  className="relative p-5 bg-gradient-to-br from-rose-950/30 via-zinc-900/40 to-rose-900/20 backdrop-blur-xl rounded-2xl border border-rose-400/20 hover:border-rose-300/40 hover:scale-[1.02] transition-all duration-300 group overflow-hidden"
                >
                  {/* Badge de posición */}
                  <div className="absolute top-3 right-3 bg-gradient-to-br from-rose-300 to-rose-400 text-black text-xs font-light px-3 py-1.5 rounded-full shadow-lg shadow-rose-400/50">
                    #{index + 1}
                  </div>
                  
                  {/* Imagen del producto */}
                  {item.image && (
                    <div className="w-full h-40 rounded-xl overflow-hidden mb-4 bg-zinc-800 border border-rose-400/10">
                      <img 
                        src={item.image} 
                        alt={item.product_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = '/placeholder-product.jpg';
                        }}
                      />
                    </div>
                  )}
                  
                  <div>
                    <p className="font-light text-pink-100 mb-1 line-clamp-2 text-lg">{item.product_name}</p>
                    <p className="text-xs text-rose-200/60 mb-3 uppercase tracking-wider">{item.category || 'Sin categoría'}</p>
                    
                    <div className="flex justify-between items-end">
                      <div>
                        {item.price && (
                          <p className="text-xl font-light text-rose-300">${item.price}</p>
                        )}
                        {item.stock !== null && (
                          <p className={`text-xs mt-1 ${item.stock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {item.stock > 0 ? `${item.stock} en stock` : 'Agotado'}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-light text-rose-200">{item.adds}</p>
                        <p className="text-xs text-rose-300/60 uppercase tracking-wider">al carrito</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Barra de popularidad */}
                  <div className="mt-4 h-1 bg-zinc-800/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-rose-400 via-pink-300 to-rose-300 transition-all duration-500 shadow-lg shadow-rose-400/50"
                      style={{ width: `${(parseInt(item.adds) / parseInt(stats.cartAdds[0].adds)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        )}

        {/* Productos MÁS VENDIDOS con imágenes */}
        {stats?.topSelling && stats.topSelling.length > 0 && (
          <DashboardCard title={<span className="flex items-center gap-3"><LuxuryIcons.Trophy /> Productos Más Vendidos (Top 10)</span>}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.topSelling.map((item, index) => (
                <div
                  key={index}
                  className="relative p-5 bg-gradient-to-br from-rose-950/40 via-rose-950/30 to-rose-900/30 backdrop-blur-xl rounded-2xl border border-rose-400/20 hover:border-rose-300/40 hover:scale-[1.02] transition-all duration-300 group overflow-hidden"
                >
                  {/* Badge de posición */}
                  <div className="absolute top-3 right-3 bg-gradient-to-br from-rose-300 to-rose-300 text-black text-xs font-light px-3 py-1.5 rounded-full shadow-lg shadow-rose-400/50 z-10">
                    #{index + 1}
                  </div>
                  
                  {/* Imagen del producto */}
                  {item.image && (
                    <div className="w-full h-40 rounded-xl overflow-hidden mb-4 bg-zinc-800 border border-rose-400/10">
                      <img 
                        src={item.image} 
                        alt={item.product_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = '/placeholder-product.jpg';
                        }}
                      />
                    </div>
                  )}
                  
                  <div>
                    <p className="font-light text-pink-100 mb-1 line-clamp-2 text-lg">{item.product_name}</p>
                    <p className="text-xs text-rose-200/60 mb-3 uppercase tracking-wider">{item.category || 'Sin categoría'}</p>
                    
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="bg-rose-400/20 backdrop-blur rounded-lg p-2 border border-rose-400/30">
                        <p className="text-xs text-rose-200/70 uppercase tracking-wide">Unidades</p>
                        <p className="text-lg font-light text-pink-100">{item.units_sold}</p>
                      </div>
                      <div className="bg-rose-400/20 backdrop-blur rounded-lg p-2 border border-rose-400/30">
                        <p className="text-xs text-rose-200/70 uppercase tracking-wide">Ingresos</p>
                        <p className="text-sm font-light text-pink-100">${parseFloat(item.revenue).toFixed(2)}</p>
                      </div>
                      <div className="bg-rose-700/20 backdrop-blur rounded-lg p-2 border border-rose-500/30">
                        <p className="text-xs text-rose-200/70 uppercase tracking-wide">Ganancia</p>
                        <p className="text-sm font-light text-pink-100">${parseFloat(item.profit || 0).toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-rose-300/10 to-rose-400/10 border border-rose-400/30 rounded-lg p-3 mb-2 backdrop-blur">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-rose-200/70 uppercase tracking-wider">Margen:</span>
                        <span className="text-sm font-light text-rose-300">{parseFloat(item.profit_margin || 0).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-zinc-800/50 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-rose-400 via-pink-300 to-rose-300 transition-all duration-500 shadow-lg shadow-rose-400/50"
                          style={{ width: `${Math.min(parseFloat(item.profit_margin || 0), 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {item.stock !== null && (
                      <div className="text-center">
                        <p className={`text-xs ${item.stock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {item.stock > 0 ? `${item.stock} en stock` : 'Agotado'}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Barra de popularidad */}
                  <div className="mt-4 h-1 bg-zinc-800/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-rose-400 via-pink-300 to-rose-300 transition-all duration-500 shadow-lg shadow-rose-400/50"
                      style={{ width: `${(parseInt(item.units_sold) / parseInt(stats.topSelling[0].units_sold)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        )}

        {/* Órdenes Recientes */}
        {stats?.recentOrders && stats.recentOrders.length > 0 && (
          <DashboardCard title={<span className="flex items-center gap-3"><LuxuryIcons.Shopping /> Órdenes Recientes</span>}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-gradient-to-r from-rose-950/40 via-zinc-900/60 to-rose-950/40 backdrop-blur border-b border-rose-400/20">
                  <tr>
                    <th className="px-4 py-4 text-rose-300 font-light tracking-wider">ID</th>
                    <th className="px-4 py-4 text-rose-300 font-light tracking-wider">Cliente</th>
                    <th className="px-4 py-4 text-rose-300 font-light tracking-wider">Items</th>
                    <th className="px-4 py-4 text-rose-300 font-light tracking-wider">Total</th>
                    <th className="px-4 py-4 text-rose-300 font-light tracking-wider">Estado</th>
                    <th className="px-4 py-4 text-rose-300 font-light tracking-wider">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order, index) => (
                    <tr 
                      key={order.id} 
                      className="border-b border-rose-400/10 hover:bg-rose-400/5 transition-all duration-300"
                    >
                      <td className="px-4 py-4 font-mono text-rose-300">#{order.id}</td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-light text-pink-100">{order.customer_name || 'Invitado'}</p>
                          <p className="text-xs text-rose-200/60">{order.customer_email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="bg-rose-400/20 text-rose-200 px-3 py-1 rounded-lg text-xs border border-rose-400/30">
                          {order.items_count} items
                        </span>
                      </td>
                      <td className="px-4 py-4 font-light text-rose-300 text-lg">
                        ${parseFloat(order.total).toFixed(2)}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 rounded-lg text-xs border ${
                          order.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                          order.status === 'pending' ? 'bg-rose-400/20 text-rose-300 border-rose-400/30' :
                          order.status === 'processing' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                          'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-rose-200/60 text-xs">
                        {formatDate(order.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardCard>
        )}

        {/* Páginas más visitadas */}
        <DashboardCard title={<span className="flex items-center gap-3"><LuxuryIcons.Eye /> Páginas Más Visitadas</span>}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats?.topPages?.map((page, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-r from-zinc-900/40 via-rose-950/10 to-zinc-900/40 backdrop-blur-xl rounded-xl border border-rose-400/10 hover:border-rose-300/30 hover:scale-[1.02] transition-all duration-300"
              >
                <p className="font-mono text-sm text-rose-300 mb-2 truncate">{page.page_url}</p>
                <p className="text-xs text-rose-200/60 uppercase tracking-wider">{page.views} visitas</p>
              </div>
            ))}
          </div>
        </DashboardCard>

        {/* Visitas por día */}
        {stats?.viewsByDay && stats.viewsByDay.length > 0 && (
          <DashboardCard title={<span className="flex items-center gap-3"><LuxuryIcons.Chart /> Visitas por Día</span>}>
            <div className="space-y-3">
              {stats.viewsByDay.reverse().map((day, index) => {
                const maxViews = Math.max(...stats.viewsByDay.map(d => parseInt(d.count)));
                const percentage = (parseInt(day.count) / maxViews) * 100;
                
                return (
                  <div key={index} className="flex items-center gap-4">
                    <span className="text-sm text-rose-200/70 w-28 font-light">{day.date}</span>
                    <div className="flex-1 bg-zinc-900/50 rounded-full h-10 relative overflow-hidden border border-rose-400/10">
                      <div
                        className="bg-gradient-to-r from-rose-400 via-pink-300 to-rose-300 h-full flex items-center justify-end px-4 transition-all duration-500 shadow-lg shadow-rose-400/30"
                        style={{ width: `${percentage}%` }}
                      >
                        <span className="text-black font-light text-sm">{day.count}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </DashboardCard>
        )}

        {/* Estadísticas de Pedidos por Estado de Envío */}
        {orderStats && (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-pink-200 to-pink-200 mb-6 flex items-center gap-3">
                <svg className="w-8 h-8 text-rose-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Gestión de Pedidos y Envíos
              </h2>

              {/* Tarjetas de resumen de pedidos */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="group relative bg-gradient-to-br from-rose-950/40 via-pink-950/30 to-rose-950/40 border border-rose-400/30 hover:border-rose-300/50 rounded-2xl p-6 backdrop-blur-xl hover:scale-[1.02] transition-all duration-500 overflow-hidden shadow-2xl shadow-black/50">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-400/10 rounded-full blur-3xl group-hover:bg-rose-300/15 transition-all duration-700"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-light text-rose-200 uppercase tracking-wider">Total Pedidos</h3>
                      <svg className="w-6 h-6 text-rose-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className="text-4xl font-light text-white mb-2">{orderStats.totals?.total_orders || 0}</p>
                    <p className="text-xs text-rose-200/60">Pedidos confirmados</p>
                  </div>
                </div>

                <div className="group relative bg-gradient-to-br from-rose-950/40 via-rose-950/30 to-rose-950/40 border border-rose-400/30 hover:border-rose-300/50 rounded-2xl p-6 backdrop-blur-xl hover:scale-[1.02] transition-all duration-500 overflow-hidden shadow-2xl shadow-black/50">
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-rose-300/10 rounded-full blur-3xl group-hover:bg-rose-300/15 transition-all duration-700"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-light text-rose-200 uppercase tracking-wider">Ingresos Totales</h3>
                      <svg className="w-6 h-6 text-rose-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className="text-4xl font-light text-white mb-2">${parseFloat(orderStats.totals?.total_revenue || 0).toLocaleString('es-ES', {minimumFractionDigits: 0})}</p>
                    <p className="text-xs text-rose-200/60">De pedidos pagados</p>
                  </div>
                </div>

                <div className="group relative bg-gradient-to-br from-pink-950/40 via-rose-950/30 to-pink-950/40 border border-pink-400/30 hover:border-pink-300/50 rounded-2xl p-6 backdrop-blur-xl hover:scale-[1.02] transition-all duration-500 overflow-hidden shadow-2xl shadow-black/50">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-400/10 rounded-full blur-3xl group-hover:bg-pink-300/15 transition-all duration-700"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-light text-pink-200 uppercase tracking-wider">Ticket Promedio</h3>
                      <svg className="w-6 h-6 text-pink-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className="text-4xl font-light text-white mb-2">${parseFloat(orderStats.totals?.avg_order_value || 0).toLocaleString('es-ES', {minimumFractionDigits: 0})}</p>
                    <p className="text-xs text-pink-200/60">Valor promedio por pedido</p>
                  </div>
                </div>

                <div className="group relative bg-gradient-to-br from-rose-900/40 via-rose-900/30 to-rose-900/40 border border-rose-500/30 hover:border-rose-400/50 rounded-2xl p-6 backdrop-blur-xl hover:scale-[1.02] transition-all duration-500 overflow-hidden shadow-2xl shadow-black/50">
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl group-hover:bg-rose-400/15 transition-all duration-700"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-light text-rose-200 uppercase tracking-wider">En Proceso</h3>
                      <svg className="w-6 h-6 text-rose-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className="text-4xl font-light text-white mb-2">
                      {orderStats.statusCounts?.filter(s => ['pending', 'processing', 'packed'].includes(s.status)).reduce((sum, s) => sum + parseInt(s.count), 0) || 0}
                    </p>
                    <p className="text-xs text-rose-200/60">Pendientes de envío</p>
                  </div>
                </div>
              </div>

              {/* Estados de envío detallados */}
              <DashboardCard title={<span className="flex items-center gap-3">
                <svg className="w-6 h-6 text-rose-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Estados de Envío Detallados
              </span>}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { status: 'pending', label: 'Pendiente', icon: '📦', color: 'from-rose-900/30 to-rose-800/20 border-rose-400/30' },
                    { status: 'processing', label: 'En Preparación', icon: '⚙️', color: 'from-blue-900/30 to-blue-800/20 border-blue-500/30' },
                    { status: 'packed', label: 'Empacado', icon: '📦', color: 'from-purple-900/30 to-purple-800/20 border-purple-500/30' },
                    { status: 'shipped', label: 'En Camino', icon: '🚚', color: 'from-orange-900/30 to-orange-800/20 border-orange-500/30' },
                    { status: 'out_for_delivery', label: 'En Reparto', icon: '🏃', color: 'from-orange-900/30 to-orange-800/20 border-orange-500/30' },
                    { status: 'delivered', label: 'Entregado', icon: '✅', color: 'from-green-900/30 to-green-800/20 border-green-500/30' },
                    { status: 'failed', label: 'Intento Fallido', icon: '⚠️', color: 'from-red-900/30 to-red-800/20 border-red-500/30' },
                    { status: 'sin_asignar', label: 'Sin Asignar', icon: '❓', color: 'from-gray-900/30 to-gray-800/20 border-gray-500/30' }
                  ].map(({ status, label, icon, color }) => {
                    const statusData = orderStats.statusCounts?.find(s => s.status === status);
                    const count = statusData ? parseInt(statusData.count) : 0;
                    const amount = statusData ? parseFloat(statusData.total_amount) : 0;
                    
                    return (
                      <div key={status} className={`bg-gradient-to-br ${color} rounded-xl p-4 backdrop-blur-xl border transition-all duration-300 hover:scale-105`}>
                        <div className="text-center">
                          <span className="text-3xl mb-2 block">{icon}</span>
                          <p className="text-xs text-gray-300 uppercase tracking-wider mb-2">{label}</p>
                          <p className="text-2xl font-light text-white mb-1">{count}</p>
                          <p className="text-xs text-gray-400">${amount.toLocaleString('es-ES', {minimumFractionDigits: 0})}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </DashboardCard>

              {/* Pedidos recientes */}
              <DashboardCard title={<span className="flex items-center gap-3">
                <svg className="w-6 h-6 text-rose-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Pedidos Recientes
              </span>}>
                <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                  {orderStats.recentOrders?.map((order, index) => {
                    const customerInfo = typeof order.customer_info === 'string' ? JSON.parse(order.customer_info) : order.customer_info;
                    const statusColors = {
                      pending: 'bg-rose-900/20 border-rose-400/30 text-rose-200',
                      processing: 'bg-blue-900/20 border-blue-500/30 text-blue-300',
                      packed: 'bg-purple-900/20 border-purple-500/30 text-purple-300',
                      shipped: 'bg-orange-900/20 border-orange-500/30 text-orange-300',
                      out_for_delivery: 'bg-orange-900/20 border-orange-500/30 text-orange-300',
                      delivered: 'bg-green-900/20 border-green-500/30 text-green-300',
                      failed: 'bg-red-900/20 border-red-500/30 text-red-300',
                    };
                    const statusLabels = {
                      pending: 'Pendiente',
                      processing: 'En Preparación',
                      packed: 'Empacado',
                      shipped: 'En Camino',
                      out_for_delivery: 'En Reparto',
                      delivered: 'Entregado',
                      failed: 'Intento Fallido'
                    };
                    
                    return (
                      <div
                        key={order.id}
                        className="p-4 bg-gradient-to-r from-zinc-900/30 via-rose-950/10 to-zinc-900/30 backdrop-blur-xl rounded-xl border border-rose-400/20 hover:border-rose-300/40 transition-all duration-300"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-sm font-light text-rose-200">Pedido #{order.id}</p>
                            <p className="text-xs text-gray-400">{customerInfo?.nombre} {customerInfo?.apellidos}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-light text-white">${parseFloat(order.total).toLocaleString('es-ES')}</p>
                            <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString('es-ES')}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 items-center">
                          <span className={`px-3 py-1 rounded-full text-xs border ${statusColors[order.shipping_status] || 'bg-gray-900/20 border-gray-500/30 text-gray-300'}`}>
                            {statusLabels[order.shipping_status] || order.shipping_status || 'Sin asignar'}
                          </span>
                          {order.tracking_number && (
                            <span className="px-3 py-1 rounded-full text-xs bg-rose-900/20 border border-rose-500/30 text-rose-300">
                              📦 {order.tracking_number}
                            </span>
                          )}
                          {order.shipping_carrier && (
                            <span className="px-3 py-1 rounded-full text-xs bg-pink-900/20 border border-pink-500/30 text-pink-300">
                              🚚 {order.shipping_carrier}
                            </span>
                          )}
                        </div>
                        
                        {customerInfo?.ciudad && (
                          <p className="text-xs text-gray-500 mt-2">📍 {customerInfo.ciudad}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </DashboardCard>
            </div>
          </>
        )}

        {/* Actividad reciente */}
        <DashboardCard title={<span className="flex items-center gap-3"><LuxuryIcons.Lightning /> Actividad Reciente en Tiempo Real</span>}>
          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
            {stats?.recentEvents?.map((event, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-r from-zinc-900/30 via-rose-950/10 to-zinc-900/30 backdrop-blur-xl rounded-xl border border-rose-400/10 hover:border-rose-300/30 transition-all duration-300 animate-fadeIn"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-light text-rose-200">{formatEventType(event.event_type)}</span>
                  <span className="text-xs text-rose-300/60">{formatDate(event.created_at)}</span>
                </div>
                
                {event.product_name && (
                  <p className="text-sm text-rose-300">Producto: {event.product_name}</p>
                )}
                {event.category && (
                  <p className="text-xs text-rose-200/60 uppercase tracking-wider">Categoría: {event.category}</p>
                )}
                
                <div className="mt-3 pt-3 border-t border-rose-400/10 flex flex-wrap gap-3 text-xs text-rose-300/60">
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 12h20" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    IP: {event.user_ip || 'N/A'}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 18h.01" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Sesión: {event.session_id?.substring(0, 12)}...
                  </span>
                  {event.duration && (
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Duración: {event.duration}s
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(39, 39, 42, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #E2A4B8, #D88CA6);
          border-radius: 10px;
          border: 1px solid rgba(212, 175, 55, 0.3);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #FFB6C1, #E2A4B8);
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

// Componente de tarjeta de estadística luxury
function StatCard({ title, value, icon, gradient }) {
  return (
    <div className={`group relative bg-gradient-to-br ${gradient} p-8 rounded-2xl shadow-2xl border border-rose-400/20 hover:border-rose-300/40 hover:scale-[1.03] transition-all duration-500 overflow-hidden backdrop-blur-xl`}>
      {/* Efecto de brillo luxury */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-200/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-300/5 rounded-full blur-3xl group-hover:bg-rose-300/10 transition-all duration-500"></div>
      
      <div className="relative z-10 flex justify-between items-start">
        <div className="flex-1">
          <p className="text-pink-100/60 text-xs mb-2 uppercase tracking-[0.2em] font-light">{title}</p>
          <p className="text-5xl font-light text-white mb-3 tracking-tight">{typeof value === 'string' ? value : value.toLocaleString()}</p>
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-rose-300/50 to-transparent"></div>
            <p className="text-pink-100/40 text-[10px] uppercase tracking-widest">Actualizado</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-rose-300/10 to-rose-400/5 p-4 rounded-2xl backdrop-blur border border-rose-300/10 group-hover:border-rose-300/30 transition-all duration-300 group-hover:scale-110 shadow-xl shadow-rose-400/5">
          <span className="text-rose-300 filter drop-shadow-lg">{icon}</span>
        </div>
      </div>
      
      {/* Barra de progreso decorativa luxury */}
      <div className="mt-6 h-0.5 bg-gradient-to-r from-rose-900/30 via-pink-300/20 to-rose-900/30 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-rose-300/80 to-pink-200/60 rounded-full shadow-lg shadow-rose-400/50 transition-all duration-1000 group-hover:shadow-rose-300/70" style={{width: '70%'}}></div>
      </div>
    </div>
  );
}

// Componente de tarjeta del dashboard luxury
function DashboardCard({ title, children }) {
  return (
    <div className="group relative bg-gradient-to-br from-zinc-900/40 via-neutral-900/30 to-zinc-900/40 backdrop-blur-2xl border border-rose-400/10 hover:border-rose-300/20 rounded-2xl p-8 shadow-2xl shadow-black/50 mb-8 transition-all duration-500 overflow-hidden">
      {/* Efecto de luz de fondo */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-rose-400/5 rounded-full blur-3xl group-hover:bg-rose-400/8 transition-all duration-700"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-rose-400/3 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-3xl font-light tracking-wide bg-gradient-to-r from-rose-200 via-pink-300 to-rose-200 bg-clip-text text-transparent">
            {title}
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-rose-300/30 via-pink-300/20 to-transparent"></div>
        </div>
        {children}
      </div>
    </div>
  );
}









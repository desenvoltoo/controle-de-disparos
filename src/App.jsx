import { useCallback, useEffect, useMemo, useState } from 'react';
import CardsResumo from './components/CardsResumo.jsx';
import Filtros from './components/Filtros.jsx';
import GraficosDashboard from './components/GraficosDashboard.jsx';
import TabelaArquivos from './components/TabelaArquivos.jsx';
import TabelaConsultores from './components/TabelaConsultores.jsx';
import TabelaRanking from './components/TabelaRanking.jsx';
import { fetchDashboardData } from './services/dashboardService.js';

const INITIAL_FILTERS = { consultor: '', tipo: '', status: '', busca: '' };
const FILTER_KEYS = {
  consultor: ['consultor', 'nome'],
  tipo: ['tipo', 'tipoDisparo', 'canal'],
  status: ['status', 'pasta'],
  busca: ['campanha', 'arquivo', 'nome', 'pasta'],
};

function getValue(item, keys) {
  return keys.map((key) => item?.[key]).find((value) => value !== undefined && value !== null) || '';
}

function itemMatchesFilters(item, filtros) {
  return Object.entries(filtros).every(([filterKey, filterValue]) => {
    if (!filterValue) return true;
    const currentValue = String(getValue(item, FILTER_KEYS[filterKey])).toLowerCase();
    return currentValue.includes(String(filterValue).toLowerCase());
  });
}

function uniqueOptions(collections, keys) {
  const values = collections.flatMap((collection) => collection.map((item) => getValue(item, keys))).filter(Boolean);
  return Array.from(new Set(values.map(String))).sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

export default function App() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtros, setFiltros] = useState(INITIAL_FILTERS);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await fetchDashboardData();
      setDashboard(data);
    } catch (err) {
      setError(err.message || 'Ocorreu um erro inesperado ao buscar os dados.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const filteredData = useMemo(() => {
    const data = dashboard || { ranking: [], arquivos: [], consultores: [], matriculasPorMes: [], matriculasOrigem: [] };
    return {
      ...data,
      ranking: data.ranking.filter((item) => itemMatchesFilters(item, filtros)),
      arquivos: data.arquivos.filter((item) => itemMatchesFilters(item, filtros)),
      consultores: data.consultores.filter((item) => itemMatchesFilters(item, filtros)),
    };
  }, [dashboard, filtros]);

  const opcoes = useMemo(() => {
    const collections = [dashboard?.ranking || [], dashboard?.arquivos || [], dashboard?.consultores || []];
    return {
      consultores: uniqueOptions(collections, FILTER_KEYS.consultor),
      tipos: uniqueOptions(collections, FILTER_KEYS.tipo),
      status: uniqueOptions(collections, FILTER_KEYS.status),
    };
  }, [dashboard]);

  function handleFilterChange(key, value) {
    setFiltros((current) => ({ ...current, [key]: value }));
  }

  return (
    <main className="dashboard-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Controle de Disparos</p>
          <h1>Dashboard operacional</h1>
          <span className="hero-subtitle">Acompanhe disparos, retornos e matrículas sincronizados com o Google Sheets.</span>
          {dashboard?.atualizadoEm && <small>Atualizado em: {dashboard.atualizadoEm}</small>}
        </div>
        <button className="button" type="button" onClick={loadDashboard} disabled={loading}>{loading ? 'Atualizando...' : 'Atualizar dados'}</button>
      </header>

      {error && <div className="alert" role="alert">{error} Tente atualizar novamente em alguns instantes.</div>}
      {loading && <div className="loading-card">Carregando dados do dashboard...</div>}

      {!loading && dashboard && (
        <>
          <CardsResumo resumo={dashboard.resumo} />
          <Filtros filtros={filtros} opcoes={opcoes} onChange={handleFilterChange} onReset={() => setFiltros(INITIAL_FILTERS)} />
          <GraficosDashboard arquivos={filteredData.arquivos} consultores={filteredData.consultores} matriculasPorMes={dashboard.matriculasPorMes} matriculasOrigem={dashboard.matriculasOrigem} />
          <div className="tables-grid">
            <TabelaRanking dados={filteredData.ranking} />
            <TabelaArquivos dados={filteredData.arquivos} />
            <TabelaConsultores dados={filteredData.consultores} />
          </div>
        </>
      )}
    </main>
  );
}

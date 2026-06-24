import { useCallback, useEffect, useMemo, useState } from 'react';
import CardsResumo from './components/CardsResumo.jsx';
import Filtros from './components/Filtros.jsx';
import GraficosDashboard from './components/GraficosDashboard.jsx';
import TabelaArquivos from './components/TabelaArquivos.jsx';
import TabelaConsultores from './components/TabelaConsultores.jsx';
import TabelaRanking from './components/TabelaRanking.jsx';
import { fetchDashboardData } from './services/dashboardService.js';

const INITIAL_FILTERS = { consultor: '', tipo: '', status: '', busca: '' };
const FIXED_TYPES = ['ROBO', 'URA'];
const FIXED_STATUS = ['ROBO', 'URA', 'EM_ANDAMENTO', 'CONCLUIDAS', 'MATRICULAS'];

const FIELD_KEYS = {
  consultor: ['consultor', 'nome', 'nomeConsultor'],
  tipo: ['tipo', 'tipoDisparo', 'canal'],
  status: ['status', 'pasta', 'situacao'],
  campanha: ['campanha', 'nomeCampanha', 'arquivo', 'nomeArquivo', 'nome'],
};

function getValue(item, keys) {
  return keys.map((key) => item?.[key]).find((value) => value !== undefined && value !== null) || '';
}

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

function matchesSelect(item, keys, selectedValue) {
  if (!selectedValue) return true;
  const currentValue = normalize(getValue(item, keys));
  const selected = normalize(selectedValue);
  return currentValue === selected || currentValue.includes(selected);
}

function matchesSearch(item, keys, searchValue) {
  if (!searchValue) return true;
  return normalize(getValue(item, keys)).includes(normalize(searchValue));
}

function uniqueOptions(collections, keys) {
  const values = collections.flatMap((collection) => collection.map((item) => getValue(item, keys))).filter(Boolean);
  return Array.from(new Set(values.map(String))).sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

function mergeOptions(fixedOptions, dynamicOptions) {
  const options = [...fixedOptions, ...dynamicOptions].filter(Boolean);
  return Array.from(new Set(options.map(String)));
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
      ranking: data.ranking.filter((item) => (
        matchesSelect(item, FIELD_KEYS.consultor, filtros.consultor)
        && matchesSelect(item, FIELD_KEYS.tipo, filtros.tipo)
      )),
      arquivos: data.arquivos.filter((item) => (
        matchesSelect(item, FIELD_KEYS.consultor, filtros.consultor)
        && matchesSelect(item, FIELD_KEYS.tipo, filtros.tipo)
        && matchesSelect(item, FIELD_KEYS.status, filtros.status)
        && matchesSearch(item, FIELD_KEYS.campanha, filtros.busca)
      )),
      consultores: data.consultores.filter((item) => matchesSelect(item, FIELD_KEYS.consultor, filtros.consultor)),
    };
  }, [dashboard, filtros]);

  const opcoes = useMemo(() => {
    const collections = [dashboard?.ranking || [], dashboard?.arquivos || [], dashboard?.consultores || []];
    return {
      consultores: uniqueOptions(collections, FIELD_KEYS.consultor),
      tipos: mergeOptions(FIXED_TYPES, uniqueOptions(collections, FIELD_KEYS.tipo)),
      status: mergeOptions(FIXED_STATUS, uniqueOptions(collections, FIELD_KEYS.status)),
    };
  }, [dashboard]);

  function handleFilterChange(key, value) {
    setFiltros((current) => ({ ...current, [key]: value }));
  }

  return (
    <main className="dashboard-shell">
      <header className="hero">
        <div className="hero__content">
          <p className="eyebrow">Dashboard operacional</p>
          <h1>Controle de Disparos</h1>
          <span className="hero-subtitle">Disparos, retornos e matrículas sincronizados com o Google Sheets.</span>
          <small>Última atualização: {dashboard?.atualizadoEm || 'aguardando sincronização'}</small>
        </div>
        <button className="button hero__button" type="button" onClick={loadDashboard} disabled={loading}>{loading ? 'Atualizando...' : 'Atualizar dados'}</button>
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

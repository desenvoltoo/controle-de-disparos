const EMPTY_DASHBOARD = {
  resumo: [],
  ranking: [],
  arquivos: [],
  consultores: [],
  matriculasPorMes: [],
  matriculasOrigem: [],
  atualizadoEm: '',
};

export async function fetchDashboardData() {
  const apiUrl = import.meta.env.VITE_DASHBOARD_API_URL;

  if (!apiUrl) {
    throw new Error('Configure a variável VITE_DASHBOARD_API_URL no arquivo .env.');
  }

  const response = await fetch(apiUrl, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error('Não foi possível carregar os dados do dashboard.');
  }

  const data = await response.json();

  return {
    ...EMPTY_DASHBOARD,
    ...data,
    resumo: Array.isArray(data?.resumo) ? data.resumo : (data?.resumo || []),
    ranking: Array.isArray(data?.ranking) ? data.ranking : (Array.isArray(data?.RANKING) ? data.RANKING : []),
    arquivos: Array.isArray(data?.arquivos) ? data.arquivos : (Array.isArray(data?.ARQUIVOS) ? data.ARQUIVOS : []),
    consultores: Array.isArray(data?.consultores) ? data.consultores : (Array.isArray(data?.CONSULTORES) ? data.CONSULTORES : []),
    matriculasPorMes: Array.isArray(data?.matriculasPorMes) ? data.matriculasPorMes : (Array.isArray(data?.MATRICULAS_POR_MES) ? data.MATRICULAS_POR_MES : []),
    matriculasOrigem: Array.isArray(data?.matriculasOrigem) ? data.matriculasOrigem : (Array.isArray(data?.MATRICULAS_ORIGEM) ? data.MATRICULAS_ORIGEM : []),
    atualizadoEm: data?.atualizadoEm || data?.atualizado_em || '',
  };
}

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
    resumo: Array.isArray(data?.resumo) ? data.resumo : [],
    ranking: Array.isArray(data?.ranking) ? data.ranking : [],
    arquivos: Array.isArray(data?.arquivos) ? data.arquivos : [],
    consultores: Array.isArray(data?.consultores) ? data.consultores : [],
    matriculasPorMes: Array.isArray(data?.matriculasPorMes) ? data.matriculasPorMes : [],
    matriculasOrigem: Array.isArray(data?.matriculasOrigem) ? data.matriculasOrigem : [],
    atualizadoEm: data?.atualizadoEm || '',
  };
}

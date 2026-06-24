import StatusLegend from './StatusLegend.jsx';
import { DataTable } from './tableUtils.jsx';
const COLUMNS = ['campanha', 'nome_campanha', 'nomeCampanha', 'arquivo', 'nomeArquivo', 'pasta_status', 'status', 'pasta', 'tipo_disparo', 'tipo', 'consultor_disparo', 'consultor', 'total_leads', 'totalLeads', 'retorno', 'positivo', 'negativo', 'MAT', 'matriculas', 'disparo_iniciado', 'disparo_finalizado'];
export default function TabelaArquivos({ dados }) {
  return <><DataTable title="Arquivos" description="Acompanhamento filtrável de campanhas, pastas/status e resultados dos disparos." rows={dados} columns={COLUMNS} emptyMessage="Nenhum arquivo encontrado para os filtros selecionados." maxHeight={380} /><StatusLegend /></>;
}

import { DataTable } from './tableUtils.jsx';
const COLUMNS = ['consultor_disparo', 'consultor', 'tipo_disparo', 'tipo', 'planilhas', 'total_leads', 'totalLeads', 'retorno', 'positivo', 'negativo', 'matriculas', 'MAT', 'retorno_positivo', 'taxa_retorno', 'taxa_matricula'];
export default function TabelaRanking({ dados }) {
  return <DataTable title="Ranking" description="Desempenho consolidado por consultor e tipo de disparo, ordenado pelos maiores volumes." rows={dados} columns={COLUMNS} emptyMessage="Nenhum item no ranking para os filtros selecionados." />;
}

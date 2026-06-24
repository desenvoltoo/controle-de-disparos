import { DataTable } from './tableUtils.jsx';

export default function TabelaRanking({ dados }) {
  return <DataTable title="Ranking" description="Desempenho consolidado por campanha ou consultor." rows={dados} emptyMessage="Nenhum item no ranking para os filtros selecionados." />;
}

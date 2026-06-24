import { DataTable } from './tableUtils.jsx';

export default function TabelaConsultores({ dados }) {
  return <DataTable title="Consultores" description="Resumo de retornos e matrículas por consultor." rows={dados} emptyMessage="Nenhum consultor encontrado para os filtros selecionados." />;
}

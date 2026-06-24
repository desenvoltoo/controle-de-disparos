import { DataTable } from './tableUtils.jsx';

export default function TabelaArquivos({ dados }) {
  return <DataTable title="Arquivos" description="Acompanhamento dos arquivos, pastas e status importados." rows={dados} emptyMessage="Nenhum arquivo encontrado para os filtros selecionados." />;
}

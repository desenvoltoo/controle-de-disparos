import { formatHeader, formatValue, isNumericColumn } from './tableUtils.jsx';

const SUMMARY_COLUMNS = ['consultor', 'total_leads', 'retorno', 'positivo', 'negativo', 'matriculas', 'taxa_retorno', 'taxa_matricula'];
const ALIASES = {
  consultor: ['consultor', 'nome', 'nomeConsultor'],
  total_leads: ['total_leads', 'totalLeads', 'leads', 'total'],
  retorno: ['retorno', 'retornos', 'totalRetornos'],
  positivo: ['positivo', 'positivos'],
  negativo: ['negativo', 'negativos'],
  matriculas: ['matriculas', 'matrículas', 'totalMatriculas'],
  taxa_retorno: ['taxa_retorno', 'taxaRetorno'],
  taxa_matricula: ['taxa_matricula', 'taxaMatricula'],
};

function getValue(row, column) {
  const key = ALIASES[column].find((candidate) => Object.prototype.hasOwnProperty.call(row || {}, candidate));
  return key ? row[key] : undefined;
}

export default function TabelaConsultores({ dados }) {
  const detailColumns = Array.from(new Set(dados.flatMap((row) => Object.keys(row || {}))));

  return (
    <section className="panel table-card consultants-card">
      <div className="section-heading section-heading--compact">
        <div>
          <p className="eyebrow">Consultores</p>
          <h2>Resumo por consultor</h2>
          <span>Clique em um consultor para expandir ou recolher detalhes.</span>
        </div>
        <strong className="table-count">{dados.length.toLocaleString('pt-BR')} consultores</strong>
      </div>

      {dados.length ? (
        <div className="consultants-list">
          <div className="consultants-header">
            {SUMMARY_COLUMNS.map((column) => <span key={column} className={isNumericColumn(column) ? 'cell-number' : undefined}>{formatHeader(column)}</span>)}
          </div>
          {dados.map((consultor, index) => (
            <details className="consultant-row" key={`${getValue(consultor, 'consultor') || 'consultor'}-${index}`}>
              <summary>
                {SUMMARY_COLUMNS.map((column) => (
                  <span key={column} className={isNumericColumn(column, getValue(consultor, column)) ? 'cell-number' : undefined}>{formatValue(getValue(consultor, column), column)}</span>
                ))}
              </summary>
              <div className="consultant-details">
                {detailColumns.map((column) => (
                  <div className="detail-item" key={column}>
                    <span>{formatHeader(column)}</span>
                    <strong className={isNumericColumn(column, consultor?.[column]) ? 'cell-number' : undefined}>{formatValue(consultor?.[column], column)}</strong>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      ) : <div className="empty-state empty-state--table">Nenhum consultor encontrado para os filtros selecionados.</div>}
    </section>
  );
}

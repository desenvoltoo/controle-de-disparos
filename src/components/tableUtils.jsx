const NUMBER_HINTS = ['total', 'leads', 'retorno', 'retornos', 'positivo', 'negativo', 'matricula', 'matriculas', 'disparos', 'quantidade', 'qtd'];
const PERCENT_HINTS = ['taxa', 'percentual', 'porcentagem', 'conversao', 'conversão'];

export function formatHeader(key) {
  return key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^./, (letter) => letter.toUpperCase());
}

export function toNumber(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value === 'string') {
    const normalized = value.replace('%', '').replace(/\./g, '').replace(',', '.');
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

export function isNumericColumn(column, value) {
  if (typeof value === 'number') return true;
  const key = String(column).toLowerCase();
  return NUMBER_HINTS.some((hint) => key.includes(hint)) || PERCENT_HINTS.some((hint) => key.includes(hint));
}

export function isPercentColumn(column, value) {
  return String(column).toLowerCase().includes('taxa') || String(value).includes('%');
}

export function formatValue(value, column = '') {
  if (value === null || value === undefined || value === '') return '—';

  if (isPercentColumn(column, value)) {
    return `${toNumber(value).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%`;
  }

  if (isNumericColumn(column, value)) {
    return toNumber(value).toLocaleString('pt-BR', { maximumFractionDigits: 2 });
  }

  return String(value);
}

export function DataTable({ title, description, rows, emptyMessage, maxHeight = 360 }) {
  const columns = Array.from(new Set(rows.flatMap((row) => Object.keys(row || {}))));

  return (
    <section className="panel table-card">
      <div className="section-heading section-heading--compact">
        <div>
          <p className="eyebrow">Tabela</p>
          <h2>{title}</h2>
          <span>{description}</span>
        </div>
        <strong className="table-count">{rows.length.toLocaleString('pt-BR')} registros</strong>
      </div>

      {rows.length && columns.length ? (
        <div className="table-scroll" style={{ '--table-max-height': `${maxHeight}px` }}>
          <table>
            <thead>
              <tr>{columns.map((column) => <th key={column} className={isNumericColumn(column) ? 'cell-number' : undefined}>{formatHeader(column)}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={`${title}-${rowIndex}`}>
                  {columns.map((column) => (
                    <td key={column} className={isNumericColumn(column, row?.[column]) ? 'cell-number' : undefined}>{formatValue(row?.[column], column)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <div className="empty-state empty-state--table">{emptyMessage}</div>}
    </section>
  );
}

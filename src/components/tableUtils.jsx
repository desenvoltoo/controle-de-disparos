function formatHeader(key) {
  return key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^./, (letter) => letter.toUpperCase());
}

function formatValue(value) {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'number') return value.toLocaleString('pt-BR');
  return String(value);
}

export function DataTable({ title, description, rows, emptyMessage }) {
  const columns = Array.from(new Set(rows.flatMap((row) => Object.keys(row || {}))));

  return (
    <section className="panel table-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Tabela</p>
          <h2>{title}</h2>
          <span>{description}</span>
        </div>
      </div>

      {rows.length && columns.length ? (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>{columns.map((column) => <th key={column}>{formatHeader(column)}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={`${title}-${rowIndex}`}>
                  {columns.map((column) => <td key={column}>{formatValue(row?.[column])}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <div className="empty-state empty-state--table">{emptyMessage}</div>}
    </section>
  );
}
